# RFC: перевод `AsideHeader` на compound components

- **Статус:** черновик, на обсуждение
- **Компонент:** `@gravity-ui/navigation` → `AsideHeader`
- **Прототип:** [src/components/AsideHeaderNext/](../src/components/AsideHeaderNext/) (реализован рядом со старым, старый код не тронут)
- **Тип изменения:** breaking change, мажорная версия
- **Референс подхода:** [base-ui](https://github.com/mui/base-ui/tree/master/packages/react) — `useRenderElement` + `render`-проп, `internals/composite`

---

## 0. TL;DR

`AsideHeader` сегодня — один компонент с ~32 пропами верхнего уровня, «бог-контекстом», семью разными механизмами кастомизации и тремя почти идентичными видами пунктов (`subheaderItem` / `menuItem` / `footerItem`). Добавить фичу = изменить 5–7 файлов и добавить ещё один проп.

Предлагается разложить его на compound-компоненты в стиле base-ui:

```tsx
<AsideHeader.Root compact={compact} onCompactChange={setCompact}>
  <AsideHeader.Logo icon={logo} text="My App" />
  <AsideHeader.Subheader>…</AsideHeader.Subheader>
  <AsideHeader.Menu>…</AsideHeader.Menu>
  <AsideHeader.Footer>…</AsideHeader.Footer>
  <AsideHeader.CollapseButton />
  <AsideHeader.Content>…</AsideHeader.Content>
  <AsideHeader.Panel id="search" open={…} onClose={…}>…</AsideHeader.Panel>
</AsideHeader.Root>
```

Три ключевых решения:

1. **Один примитив `Item`** вместо трёх (`subheaderItem`, `menuItem`, `footerItem`, `FooterItem`). Поведение задаёт контейнер, а не тип пункта.
2. **Один `render`-проп** на каждом подкомпоненте вместо `renderContent` / `renderFooter` / `collapseButtonWrapper` / `itemWrapper` / `logo.wrapper` / `topAlert.render` / `renderPopupContent`.
3. **Два режима лейаута:** `layout="slots"` (строгая раскладка, порядок JSX не важен — «магия», но безопасная) и `layout="manual"` (свободная композиция). Дерево и пропы в обоих режимах одинаковые.

---

## 1. Проблемы текущей реализации

Это не абстрактная критика — ниже конкретные места в коде.

### 1.1 Переизбыток пропов: `AsideHeaderProps` = ~32 пропа верхнего уровня

[src/components/AsideHeader/types.tsx](../src/components/AsideHeader/types.tsx) склеивает три несвязанные группы:

| Группа               | Пропы                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Лейаут / тема        | `compact`, `className`, `customBackground`, `customBackgroundClassName`, `headerDecoration`, `topAlert`, `qa`                                                                |
| Данные навигации     | `logo`, `subheaderItems`, `menuItems`, `menuGroups`, `defaultMenuItems`, `panelItems`                                                                                        |
| Поведение меню       | `menuOverflow`, `menuMoreTitle`, `collapsedMenuGroupIds`, `defaultCollapsedMenuGroupIds`, `onToggleMenuGroupCollapsed`, `hideCollapseButton`, `collapseTitle`, `expandTitle` |
| Рендер-колбэки       | `renderContent`, `renderFooter`, `collapseButtonWrapper`                                                                                                                     |
| События              | `onChangeCompact`, `onClosePanel`, `onMenuMoreClick`, `onAllPagesClick`, `onMenuItemsChanged`, `onMenuGroupsChanged`, `openModalSubscriber`                                  |
| Режим редактирования | `editMenuProps` (внутри ещё 6 колбэков)                                                                                                                                      |

Из интерфейса невозможно понять:

- какие пропы обязательны (формально — ни один; фактически без `logo`/`menuItems` компонент бессмысленен);
- какие пропы работают только в связке (`menuOverflow: 'scroll'` + `menuGroups` + `collapsedMenuGroupIds`; `onMenuItemsChanged` включает скрытую фичу «All pages»);
- какие взаимоисключающи (`hideCollapseButton` vs `collapseButtonWrapper`).

Отдельно `AsideHeaderItem` (= `MenuItem` + расширения) имеет **~35 полей, из которых 7 помечены `@deprecated`** ([types.tsx:124-176](../src/components/AsideHeader/types.tsx)): `popupVisible`, `popupRef`, `popupPlacement`, `popupOffset`, `popupKeepMounted`, `renderPopupContent`, `onOpenChangePopup`. Плюс два поля с явной пометкой `@internal` (`compositeBarMenuPopupItems`, `compositeBarMenuPopupTitle`) — то есть внутренняя деталь протекла в публичный тип.

### 1.2 «Бог-контекст» и жёсткая связанность

```ts
// AsideHeaderContext.ts:5-14
export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: AsideHeaderItem[];
    allPagesIsAvailable: boolean;
    onItemClick: (…) => void;
}
```

`useAsideHeaderInnerContextValue` просто расплёскивает **все** пропы в контекст (`return {...props, …}`), и любой вложенный компонент дотягивается до любого пропа. Следствия:

- `FirstPanel` читает из контекста 17 значений сразу ([FirstPanel.tsx:19-36](../src/components/AsideHeader/components/FirstPanel.tsx));
- невозможно понять зону ответственности компонента по его сигнатуре — только чтением реализации;
- нельзя переиспользовать часть отдельно: `Header`, `CompositeBar`, `CollapseButton`, `Panels` падают без `AsideHeaderInnerContextProvider`;
- есть **два** контекста с почти одинаковыми именами (`AsideHeaderContext` — только `{compact, size}` и `AsideHeaderInnerContext` — всё остальное), плюс третий ad-hoc `ItemPopupNestContext`.

Цепочка рендера — 4 уровня обёрток, каждая из которых нужна только чтобы протащить данные:

```
AsideHeader → PageLayout → PageLayoutAside → FirstPanel → Header / CompositeBar / Footer / CollapseButton / Panels
```

### 1.3 Семь разных механизмов кастомизации

Каждый со своей сигнатурой:

| #   | Механизм                      | Сигнатура                                                          |
| --- | ----------------------------- | ------------------------------------------------------------------ |
| 1   | `renderContent`               | `(props) => ReactNode`                                             |
| 2   | `renderFooter`                | `({size, compact, asideRef}) => ReactNode`                         |
| 3   | `collapseButtonWrapper`       | `(defaultButton, {compact, onChangeCompact}) => ReactNode`         |
| 4   | `MenuItem.itemWrapper`        | `(params, makeItem, {collapsed, compact, item, ref}) => ReactNode` |
| 5   | `LogoProps.wrapper`           | `(node, compact) => ReactNode`                                     |
| 6   | `TopAlertProps.render`        | `({handleClose}) => ReactElement`                                  |
| 7   | `MenuItem.renderPopupContent` | `() => ReactNode` (deprecated)                                     |

Чтобы обернуть пункт меню в `react-router` `Link`, нужно знать про `itemWrapper` с трёхаргументной сигнатурой и про то, что при его наличии корневой тег меняется с `<button>` на `<div role="button">` ([Item.tsx:237-246](../src/components/AsideHeader/components/CompositeBar/Item/Item.tsx)). Это неочевидно и нигде не выводится из типов.

### 1.4 `subheaderItem`, `menuItem`, `footerItem` — это один и тот же примитив

Проверено по коду:

- `FooterItem` — обёртка над тем же `Item` с фиксированным `iconSize` и доп. классом; тип `FooterItemProps extends AsideHeaderItem`, т.е. полностью идентичен ([FooterItem.tsx](../src/components/AsideHeader/components/FooterItem/FooterItem.tsx));
- subheader-пункты рендерит **тот же** `CompositeBar` с `type="subheader"` и `items: AsideHeaderItem[]` ([Header.tsx:42-49](../src/components/AsideHeader/components/Header.tsx));
- menu-пункты — тот же `CompositeBar` с `type="menu"`, тот же `Item`, тот же тип (`ItemProps extends AsideHeaderItem`).

Различаются только **место размещения** и **режим overflow**. При этом публичного API — четыре (`subheaderItems`, `menuItems`, `renderFooter` + `FooterItem`), и в роадмапе уже стоит пункт «Unify subheaderItem, menuItem, footerItem API».

### 1.5 Костыли поверх UIKit `List`

`CompositeBar` (442 строки) использует `List` только ради клавиатурной навигации и отключает почти всё остальное:

```tsx
// CompositeBar.tsx:151-161
<List<CompositeBarRow>
    virtualized={false}
    filterable={false}
    sortable={false}
    …
/>
```

При этом приходится делать вещи вроде:

```ts
// CompositeBar.tsx:90-94 — сброс активного пункта, которого нет в API List
ref.current?.activateItem(undefined as unknown as number);
```

Плюс вручную считать высоты (`itemHeight`, `itemsHeight`, `getItemsHeight`, `getPopupItemHeight`, …, [utils.ts](../src/components/AsideHeader/components/CompositeBar/utils.ts) — 237 строк), потому что `List` требует знать высоту заранее.

### 1.6 Попапы и collapsible-пункты непрозрачны для пользователя

Недавно добавленные collapsible-пункты (пункт со вложенными пунктами), group-флайауты и overflow «More» — это один и тот же `ItemPopup` поверх UIKit `Popover` с **зашитым** позиционированием:

```ts
// ItemPopup.tsx:16-20, 142-161
const POPUP_MAIN_AXIS_OFFSET = 14;
const POPUP_CROSS_AXIS_OFFSET_WITH_TITLE = -30;
const POPUP_CROSS_AXIS_OFFSET_WITHOUT_TITLE = 0;
const DEFAULT_POPUP_DELAY = 100;
…
placement={isSingleLabel ? 'right' : 'right-start'}
strategy="fixed"
enableSafePolygon
```

Пользователь **не может** ни подменить контент попапа, ни управлять его положением относительно якоря (скоупа). Правило «не закрывать родителя, пока открыт вложенный попап» держится на ad-hoc счётчике через отдельный контекст ([ItemPopupNestContext.tsx](../src/components/AsideHeader/components/CompositeBar/Item/ItemPopupNestContext.tsx) + [Item.tsx:101-113](../src/components/AsideHeader/components/CompositeBar/Item/Item.tsx)), а не как часть примитива.

### 1.7 Нарушение SRP → плохая масштабируемость

`AsideHeader` одновременно отвечает за: лейаут страницы, навигацию, состояние compact, состояние панелей, состояние «All pages» и режим редактирования меню, рендер контента, топ-алерт с расчётом его высоты для SSR, тему и кастомный фон.

Поэтому добавление одной фичи (например, `menuOverflow: 'scroll'`) потребовало правок в `types.tsx`, `CompositeBar.tsx`, `FirstPanel.tsx`, `grouping.ts`, `utils.ts`, `ScrollableWithScrollbar/`\* и новых пропов `collapsedMenuGroupIds` / `defaultCollapsedMenuGroupIds` / `onToggleMenuGroupCollapsed`.

---

## 2. Цели и не-цели

### Цели

1. Явная композиция вместо скрытых рендер-функций.
2. Один примитив `Item` вместо трёх API.
3. Одна точка кастомизации (`render`) с единой семантикой на всех подкомпонентах.
4. Узкие контексты вместо «бог-контекста»; каждый подкомпонент читает только то, что ему нужно.
5. Своя клавиатурная навигация (`Composite`) вместо `List` с отключёнными фичами.
6. Полный контроль позиционирования попапов относительно скоупа + возможность принести свою реализацию.
7. Сохранить существующую темизацию: все `--gn-aside-header-*` CSS-переменные продолжают работать.

### Не-цели

- Не переписываем `Settings`, `MobileHeader`, `HotkeysPanel` и прочие компоненты пакета.
- Не сохраняем обратную совместимость на уровне пропов (согласовано: breaking change допустим).
- Не выносим `Composite` в публичный API пакета на первом этапе.

---

## 3. Опорные решения из base-ui

### 3.1 `useRenderElement` — единый рендер-примитив

Ключевая идея base-ui: компонент не рендерит тег напрямую, а проходит через хук, который мёрджит пропы и позволяет подменить элемент через `render`.

Реализовано в [internal/useRenderElement.tsx](../src/components/AsideHeaderNext/internal/useRenderElement.tsx):

```ts
export type RenderProp<State> =
  | React.ReactElement // элемент — с ним композируемся
  | ((props: AnyProps, state: State) => React.ReactElement); // функция — получает готовые пропы и state

useRenderElement<State>(defaultTag, {render, ref, state, props});
```

Семантика мёрджа ([internal/mergeProps.ts](../src/components/AsideHeaderNext/internal/mergeProps.ts)):

- обработчики `on[A-Z]*` **чейнятся** (сначала внутренний, потом пользовательский) — пользователь не может случайно «убить» внутреннее поведение;
- `className` склеиваются;
- `style` шэллоу-мёрджится;
- остальное — later wins;
- refs объединяются через [mergeRefs](../src/components/AsideHeaderNext/internal/mergeRefs.ts) с поддержкой cleanup-функций (React 19).

Три ветки поведения:

| `render`                     | Результат                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------- |
| не задан                     | `createElement(defaultTag, mergedProps)`                                        |
| элемент (`<Link to="/x" />`) | `cloneElement` с мёрджем пропов и refs                                          |
| функция                      | вызывается с `(mergedProps, state)`, пользователь сам решает, куда их применить |

Это **заменяет все 7 механизмов** из §1.3 одним пропом.

### 3.2 `Composite` вместо UIKit `List`

Порт идеи [base-ui `internals/composite](https://github.com/mui/base-ui/tree/master/packages/react/src/internals/composite)`: roving tabindex, где активный пункт — единственная tab-остановка, навигация стрелками / `Home`/`End`, опциональный `loop`.

Реализация: [internal/composite/](../src/components/AsideHeaderNext/internal/composite/) — `Composite` (~~150 строк) + `useCompositeItem` (~~60 строк). Что это даёт по сравнению с `List`:

- не нужно знать высоты пунктов заранее → уходит вся арифметика `getItemHeight` / `itemsHeight`;
- регистрация пунктов по DOM-порядку (`compareDocumentPosition`) → вложенные группы и произвольная разметка «просто работают»;
- нет `activateItem(undefined as unknown as number)`;
- контролируемый и неконтролируемый `activeIndex`.

### 3.3 React 19: `ref` как обычный проп

Прототип рассчитан на React 19, где `ref` — обычный проп и `forwardRef` не нужен. `peerDependencies` пакета **уже** допускают `^19` — потребовался только бамп dev-зависимостей до 19.2.

Плата (см. §11): бамп `@types/react` до 19 вскрыл **38 ошибок типов в старом коде** (React 19 сделал `RefObject<T>` → `RefObject<T | null>`, `useRef()` требует аргумент). В `AsideHeaderNext` — **0 ошибок**. Распределение: `Settings/collect-settings.ts` — 21, остальное по 1–3 в `ScrollableWithScrollbar`, старом `Item.tsx`, `Footer` (desktop/mobile), `MobileLogo`, `TopAlert`, `AllPagesListItem`, `FirstPanel`, старых сторис.

---

## 4. Предлагаемая архитектура

### 4.1 Дерево компонентов

```
AsideHeader.Root                      // состояние compact, размер, режим лейаута, CSS-переменные
├── AsideHeader.Alert                 // слот alert   — заменяет проп topAlert
├── AsideHeader.Background            // слот background — заменяет customBackground
├── AsideHeader.Logo                  // слот header  — заменяет проп logo
├── AsideHeader.Subheader             // слот header  — заменяет subheaderItems
│   └── AsideHeader.Item
├── AsideHeader.Menu                  // слот menu    — заменяет menuItems (+ Composite внутри)
│   ├── AsideHeader.Item
│   └── AsideHeader.MenuGroup         // (этап 3) заменяет menuGroups
├── AsideHeader.Footer                // слот footer  — заменяет renderFooter + FooterItem
│   └── AsideHeader.Item
├── AsideHeader.CollapseButton        // слот footer  — заменяет hideCollapseButton / collapseButtonWrapper
├── AsideHeader.Content               // слот content — заменяет renderContent
├── AsideHeader.Panel                 // слот panels  — заменяет panelItems
└── AsideHeader.Aside                 // только для layout="manual"
```

Namespace-объект собирается в [AsideHeaderNext.tsx](../src/components/AsideHeaderNext/AsideHeaderNext.tsx) через `Object.assign(Root, {...})`, поэтому `<AsideHeader>` и `<AsideHeader.Root>` — одно и то же.

### 4.2 Зоны ответственности (SRP)

| Компонент                       | Отвечает за                                                                        | Не знает про           |
| ------------------------------- | ---------------------------------------------------------------------------------- | ---------------------- |
| `Root`                          | compact (controlled/uncontrolled), `size`, `--gn-aside-header-size`, режим лейаута | пункты, попапы, панели |
| `Aside`                         | колонка навигации в `manual`                                                       | состояние              |
| `Logo`                          | лого + адаптация к compact                                                         | навигацию              |
| `Subheader` / `Menu` / `Footer` | размещение и дефолты для своих `Item`                                              | внешний вид пункта     |
| `Menu`                          | клавиатурная навигация (`Composite`), overflow                                     | что внутри пункта      |
| `Item`                          | одна строка навигации: иконка, заголовок, current/disabled, тултип, попап          | где он находится       |
| `CollapseButton`                | переключение compact                                                               | остальной лейаут       |
| `Content`                       | область контента                                                                   | навигацию              |
| `Panel`                         | drawer рядом с навигацией                                                          | что его открыло        |

### 4.3 Два режима лейаута

Главное возражение к «полному compound» — потеря гарантий раскладки. Решается флагом на `Root`:

```tsx
<AsideHeader.Root layout="slots">   {/* по умолчанию */}
<AsideHeader.Root layout="manual">
```

`**layout="slots"` (по умолчанию).** Каждый подкомпонент помечен слотом (`header` / `menu` / `footer` / `content` / `alert` / `background` / `panels`). `Root` раскладывает прямых детей по слотам, порядок в JSX не важен — Footer, написанный первым, всё равно окажется внизу. Ограничение: части должны быть **прямыми\*\* детьми `Root`.

`**layout="manual"`.\*\* Никакой магии: дети рендерятся как есть, лейаут собирает пользователь (обычно завернув навигацию в `AsideHeader.Aside`). Это замена сегодняшнего `PageLayout` / `PageLayoutAside` (сторис `AdvancedUsage`).

Важно: **дерево и пропы в обоих режимах одинаковые** — меняется только то, кто расставляет части по местам. Никакого раздвоения API.

### 4.4 Механика слотов

[internal/slots.ts](../src/components/AsideHeaderNext/internal/slots.ts):

```ts
const SLOT = Symbol('AsideHeaderNext.slot');

export function withSlot<C extends React.ElementType>(Component: C, slot: SlotName): C;
export function collectSlots(children): {
  slots: Record<SlotName, ReactNode[]>;
  unknown: ReactNode[];
};
```

- метка ставится на **тип компонента** (`Symbol`), не на строковый `displayName` → не ломается минификацией и не подделывается случайно;
- `collectSlots` игнорирует `null` / `undefined` / `false`, поэтому условный рендер (`{cond ? <Alert/> : null}`) работает;
- нераспознанные прямые дети складываются в `unknown` и в dev-режиме дают `console.error` с подсказкой про `layout="manual"` ([Root.tsx:71-77](../src/components/AsideHeaderNext/Root.tsx)) — это ровно та «магия с ограничением», о которой шла речь, но с явной диагностикой;
- один слот может принимать несколько компонентов: `Logo` и `Subheader` оба идут в `header`, `Footer` и `CollapseButton` — в `footer`.

### 4.5 Модель состояния

Все состояния — по паттерну controlled / uncontrolled, без «полуконтролируемых» гибридов:

| Состояние                   | Владелец                  | Пропы                                                           |
| --------------------------- | ------------------------- | --------------------------------------------------------------- |
| compact                     | `Root`                    | `compact` / `defaultCompact` / `onCompactChange`                |
| активный пункт (клавиатура) | `Composite` внутри `Menu` | `activeIndex` / `defaultActiveIndex` / `onActiveIndexChange`    |
| открытость попапа пункта    | `Item`                    | (этап 2) `open` / `defaultOpen` / `onOpenChange`                |
| открытость панели           | пользователь              | `Panel.open` / `Panel.onClose`                                  |
| свёрнутость группы          | `MenuGroup`               | (этап 3) `collapsed` / `defaultCollapsed` / `onCollapsedChange` |

Контексты — узкие ([LayoutContext.tsx](../src/components/AsideHeaderNext/LayoutContext.tsx)):

```ts
LayoutContext    = {compact, size, layout, setCompact}          // «где я и насколько я узкий»
ItemDefaults     = {place: 'header'|'menu'|'footer'|'popup', iconSize?}  // дефолты от контейнера
CompositeContext = {activeIndex, register, unregister, getIndex, …}      // только навигация
```

Именно `ItemDefaults` закрывает унификацию из §1.4: `Footer` просто провайдит `{place: 'footer', iconSize: 18}`, и отдельный компонент `FooterItem` больше не нужен.

### 4.6 API подкомпонентов

#### `Root`

```ts
interface RootProps {
  children?: React.ReactNode;
  className?: string;
  layout?: 'slots' | 'manual'; // default: 'slots'
  compact?: boolean;
  defaultCompact?: boolean;
  onCompactChange?: (compact: boolean) => void;
  ref?: React.Ref<HTMLDivElement>;
}
```

Выставляет `--gn-aside-header-size` (56px / 236px из [constants.ts](../src/components/constants.ts)).

#### `Item` — единый примитив

```ts
interface ItemProps {
  id: string;
  icon?: IconProps['data'];
  iconSize?: number; // иначе — из ItemDefaults, иначе 18
  children?: React.ReactNode; // заголовок (вместо пропа title)
  current?: boolean;
  disabled?: boolean;
  href?: string; // href → <a>, иначе <button>
  target?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  type?: 'item' | 'divider';
  rightAdornment?: React.ReactNode; // например тег «New»
  render?: RenderProp<ItemState>; // ← заменяет itemWrapper
  tooltipText?: React.ReactNode; // в compact фолбэк на заголовок
  items?: ItemProps[]; // collapsible / flyout
  popupTitle?: string;
  popupPlacement?: PopupPlacement; // контроль якоря
  popupOffset?: PopupProps['offset'];
  ref?: React.Ref<HTMLElement>;
}

interface ItemState {
  current: boolean;
  disabled: boolean;
  compact: boolean;
}
```

Сравнение с сегодняшним `AsideHeaderItem`: **17 пропов вместо ~35**, ноль deprecated, ноль `@internal`.

Внутри `Item` выбирает реализацию по `ItemDefaults.place`: в `menu` — регистрируется в `Composite` (roving tabindex), в остальных местах — обычный элемент ([Item.tsx:185-200](../src/components/AsideHeaderNext/Item.tsx)). Пользователю это не видно.

#### `Menu` / `Subheader` / `Footer`

```ts
interface MenuProps {
  children?: React.ReactNode;
  items?: ItemProps[]; // data-driven альтернатива композиции
  className?: string;
  'aria-label'?: string;
  ref?: React.Ref<HTMLDivElement>;
}
```

Наличие `items` — сознательная уступка: миграция с `menuItems={[...]}` становится однострочной, а composition-путь остаётся для тех, кому нужен контроль. Оба пути используют один и тот же `Item`.

#### `CollapseButton`, `Content`, `Alert`, `Background`, `Logo`

Все — тонкие обёртки над `useRenderElement` с `render` и своим `state`:

| Компонент              | `state`, доступный в `render` |
| ---------------------- | ----------------------------- |
| `CollapseButton`       | `{compact}`                   |
| `Content`              | `{size, compact}`             |
| `Logo`                 | `{compact}`                   |
| `Alert` / `Background` | `{}`                          |

#### `Panel`

```ts
interface PanelProps {
  id: string;
  open?: boolean;
  onClose?: () => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  keepMounted?: boolean;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}
```

Внутри — UIKit `Drawer`, спозиционированный рядом с навигацией (`left: size`, `top: var(--gn-top-alert-height)`), как в сегодняшнем [Panels.tsx](../src/components/AsideHeader/components/Panels.tsx). Разница: панели объявляются как JSX-дети, а не как массив `panelItems`, и состояние `open` принадлежит приложению — исчезает скрытая синхронизация `panelItems.some(x => x.open)` из `useAsideHeaderInnerContextValue`.

### 4.7 Попапы: два уровня — «готовое решение» и «принеси своё»

Требование: пользователь должен и получать работающий дефолт, и иметь возможность подставить свой попап, зная, как позиционировать его относительно скоупа.

**Уровень 1 — готовое решение.** `Item` c `items` сам строит флайаут с дефолтами, снятыми с сегодняшнего `ItemPopup` (`placement: ['right-start','right']`, `offset: {mainAxis: 14}`):

```tsx
<AsideHeader.Item id="projects" icon={FolderIcon} popupTitle="Projects" items={subItems}>
  Projects
</AsideHeader.Item>
```

**Уровень 2 — bring-your-own.** Магические константы становятся документированными дефолтами публичных пропов (`popupPlacement`, `popupOffset`), а на этапе 2 — полноценными сабчастями:

```tsx
<AsideHeader.Item id="projects" icon={FolderIcon}>
  <AsideHeader.Item.Trigger>Projects</AsideHeader.Item.Trigger>
  <AsideHeader.Item.Popup side="right" align="start" sideOffset={14} alignOffset={0}>
    <MyOwnPopupContent />
  </AsideHeader.Item.Popup>
</AsideHeader.Item>
```

Полная замена контента — через `render`, как и везде.

Дополнительно: collapsible-группа, overflow «More» и compact-флайаут сводятся к **одному** примитиву с разными дефолтами контейнера, а правило «не закрывать родителя, пока открыт вложенный» становится частью примитива вместо ручного счётчика `nestedOpenCountRef`.

---

## 5. Маппинг старого API на новый

| Было                                                                                                                                                     | Стало                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `compact` / `onChangeCompact`                                                                                                                            | `Root`: `compact` / `defaultCompact` / `onCompactChange`                            |
| `logo={{...}}`                                                                                                                                           | `<AsideHeader.Logo />`                                                              |
| `logo.wrapper`                                                                                                                                           | `Logo` + `render`                                                                   |
| `subheaderItems={[...]}`                                                                                                                                 | `<AsideHeader.Subheader items={…}>` или композиция `Item`                           |
| `menuItems={[...]}`                                                                                                                                      | `<AsideHeader.Menu items={…}>` или композиция `Item`                                |
| `renderFooter={({size, compact, asideRef}) => …}`                                                                                                        | `<AsideHeader.Footer>` + композиция                                                 |
| `FooterItem`                                                                                                                                             | `<AsideHeader.Item>` внутри `Footer`                                                |
| `renderContent`                                                                                                                                          | `<AsideHeader.Content>`                                                             |
| `hideCollapseButton`                                                                                                                                     | просто не рендерить `<AsideHeader.CollapseButton />`                                |
| `collapseButtonWrapper`                                                                                                                                  | `CollapseButton` + `render`                                                         |
| `MenuItem.itemWrapper`                                                                                                                                   | `Item` + `render`                                                                   |
| `MenuItem.title`                                                                                                                                         | `children`                                                                          |
| `MenuItem.popupVisible` / `popupRef` / `popupPlacement` / `popupOffset` / `popupKeepMounted` / `renderPopupContent` / `onOpenChangePopup` (7 deprecated) | `Item` + `items` / `popupPlacement` / `popupOffset`, далее `Item.Popup`             |
| `compositeBarMenuPopupItems` / `compositeBarMenuPopupTitle` (`@internal`)                                                                                | `Item.items` / `Item.popupTitle`                                                    |
| `topAlert={{...}}`                                                                                                                                       | `<AsideHeader.Alert>` (любая разметка)                                              |
| `customBackground` / `customBackgroundClassName`                                                                                                         | `<AsideHeader.Background>`                                                          |
| `panelItems={[...]}` + `onClosePanel`                                                                                                                    | `<AsideHeader.Panel open onClose>`                                                  |
| `PageLayout` / `PageLayoutAside`                                                                                                                         | `layout="manual"` + `<AsideHeader.Aside>`                                           |
| `menuGroups` + `collapsedMenuGroupIds` + `defaultCollapsedMenuGroupIds` + `onToggleMenuGroupCollapsed`                                                   | `<AsideHeader.MenuGroup collapsed / defaultCollapsed / onCollapsedChange>` (этап 3) |
| `menuOverflow` / `menuMoreTitle` / `onMenuMoreClick`                                                                                                     | пропы `Menu` (этап 3)                                                               |
| `editMenuProps` + `onMenuItemsChanged` + `onAllPagesClick`                                                                                               | отдельный компонент `AllPagesPanel` (этап 4)                                        |

---

## 6. Примеры «было / стало»

### 6.1 Футер

**Было** — рендер-колбэк, знание про `FooterItem` и про то, что `asideRef` нужен для якоря попапа:

```tsx
<AsideHeader
  compact={compact}
  onChangeCompact={setCompact}
  logo={{icon: logoIcon, text: 'My App'}}
  menuItems={menuItems}
  renderFooter={({compact, asideRef}) => (
    <>
      <FooterItem compact={compact} item={{id: 'support', title: 'Support', icon: SupportIcon}} />
      <FooterItem
        compact={compact}
        popupVisible={settingsOpen}
        popupRef={asideRef}
        renderPopupContent={() => <SettingsPopup />}
        item={{id: 'settings', title: 'Settings', icon: GearIcon}}
      />
    </>
  )}
/>
```

**Стало** — обычная композиция, без колбэков и без deprecated-пропов:

```tsx
<AsideHeader.Root compact={compact} onCompactChange={setCompact}>
  <AsideHeader.Logo icon={logoIcon} text="My App" />
  <AsideHeader.Menu items={menuItems} aria-label="Main navigation" />
  <AsideHeader.Footer>
    <AsideHeader.Item id="support" icon={SupportIcon}>
      Support
    </AsideHeader.Item>
    <AsideHeader.Item id="settings" icon={GearIcon} items={settingsItems} popupTitle="Settings">
      Settings
    </AsideHeader.Item>
  </AsideHeader.Footer>
  <AsideHeader.CollapseButton />
  <AsideHeader.Content>{page}</AsideHeader.Content>
</AsideHeader.Root>
```

### 6.2 Пункт как router-ссылка

**Было** — `itemWrapper` с трёхаргументной сигнатурой и неявной сменой корневого тега:

```tsx
const menuItems = [
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderIcon,
    itemWrapper: (params, makeItem, {compact, item, ref}) => (
      <Link to="/projects" ref={ref}>
        {makeItem(params)}
      </Link>
    ),
  },
];
```

**Стало** — стандартный `render`, тот же во всех подкомпонентах:

```tsx
<AsideHeader.Item id="projects" icon={FolderIcon} render={<Link to="/projects" />}>
  Projects
</AsideHeader.Item>
```

Либо функцией, если нужен доступ к состоянию:

```tsx
<AsideHeader.Item
  id="projects"
  icon={FolderIcon}
  render={(props, {current}) => <Link {...props} to="/projects" data-active={current} />}
>
  Projects
</AsideHeader.Item>
```

### 6.3 Обёртка кнопки сворачивания

**Было:** `collapseButtonWrapper={(defaultButton, {compact, onChangeCompact}) => …}`.

**Стало** ([сторис CollapseButtonWrapper](../src/components/AsideHeaderNext/__stories__/AsideHeaderNext.stories.tsx)):

```tsx
<AsideHeader.CollapseButton
  render={(props, {compact}) => (
    <>
      <button {...props} />
      {compact ? null : <Branding />}
    </>
  )}
/>
```

---

## 7. Совместимость и темизация

- **CSS-переменные.** Все `--gn-aside-header-*` работают без изменений: сторис `CustomTheme` перенесён один-в-один и красит новый компонент тем же блоком переменных. Значит существующие темы прикладных проектов применимы.
- **BEM-неймспейс.** Новые SCSS-модули используют тот же `createBlock` с неймспейсом `gn-` ([utils/cn.ts](../src/components/utils/cn.ts)), классы вида `.gn-aside-header-next*`. Внешние переопределения по классам придётся обновить — это ожидаемая часть breaking change.
- **Размеры и константы.** Переиспользуются существующие `ASIDE_HEADER_COMPACT_WIDTH` (56), `ASIDE_HEADER_EXPANDED_WIDTH` (236), `ASIDE_HEADER_ICON_SIZE` (18), `ITEM_HEIGHT` (40), `POPUP_REGULAR_ITEM_HEIGHT` (32).
- **UIKit.** `ActionTooltip`, `Popover`, `Drawer`, `Icon` переиспользуются как есть. Заменяется только `List` → свой `Composite`.
- **Старый компонент** остаётся в дереве нетронутым на время миграции; удаление — отдельным шагом мажора.

---

## 8. Статус прототипа

Реализовано в [src/components/AsideHeaderNext/](../src/components/AsideHeaderNext/), старый код не изменялся. Проходит `tsc --noEmit` (0 ошибок в новом коде), `eslint` (0 ошибок), `stylelint`, SCSS компилируется.

**Ядро:** `mergeProps`, `mergeRefs`, `useRenderElement`, `slots`, `Composite` + `useCompositeItem`, `LayoutContext` + `ItemDefaults`.

**Компоненты:** `Root` (оба режима лейаута), `Aside`, `Alert`, `Background`, `Logo`, `Subheader`, `Menu`, `Item` (включая `divider`, `rightAdornment`, тултипы, флайаут-попап с контролем позиционирования), `Footer`, `CollapseButton`, `Content`, `Panel`.

**Сторис** — портированы кейсы старого компонента для сравнения «один в один»: `Showcase`, `Compact`, `CustomTheme`, `CustomBackground`, `AdvancedUsage` (= `layout="manual"`), `HeaderAlert` / `HeaderAlertCentered` / `HeaderAlertCustom`, `LineClamp`, `CollapseButtonWrapper`, `MenuScrollbar`.

### Что осознанно не сделано

| Фича                                                     | Куда относится |
| -------------------------------------------------------- | -------------- |
| `Item.Trigger` / `Item.Popup` как сабчасти + вложенность | этап 2         |
| `MenuGroup` (группы, tree-connector, inline-раскрытие)   | этап 3         |
| Overflow «More» (`AutoSizer` + расчёт вместимости)       | этап 3         |
| `menuOverflow: 'scroll'` + `ScrollableWithScrollbar`     | этап 3         |
| `AllPagesPanel` + режим редактирования меню, сортировка  | этап 4         |
| `Fallback` (SSR-скелетон `AsideFallback`)                | этап 4         |
| `headerDecoration` (градиент + декоративный дивайдер)    | этап 4         |
| `HighlightedItem` / `bringForward`                       | этап 4         |
| `type: 'action'` (плавающая кнопка)                      | этап 4         |
| `multipleTooltip`                                        | этап 4         |
| i18n, unit- и visual-тесты, README                       | этап 5         |

---

## 9. План внедрения

Всё за фиче-флагом импорта (`AsideHeaderNext`), без влияния на текущих пользователей.

- **Этап 1 — ядро и вертикальный срез.** ✅ Сделано: ядро, слоты, `Composite`, базовые части, портированные сторис.
- **Этап 2 — попапы.** `Item.Trigger` / `Item.Popup` с полным набором пропов позиционирования (`side`, `align`, `sideOffset`, `alignOffset`, `anchor`, `strategy`, `flip`, `shift`, задержки), вложенные попапы как часть примитива.
- **Этап 3 — меню целиком.** `MenuGroup`, overflow «More», scroll-режим. Закрывает сторис `MenuGroups*` и `MenuScrollbar`.
- **Этап 4 — оставшиеся фичи.** `AllPagesPanel`, `Fallback`, `headerDecoration`, `bringForward`, `action`-пункты, `multipleTooltip`.
- **Этап 5 — качество и документация.** Unit-тесты (композиция, слоты, клавиатура, `render`), visual-снапшоты на портированных сторис для сравнения со старым компонентом, README + гайд миграции, при необходимости codemod (в репозитории уже есть инфраструктура [codemods/](../codemods/)).
- **Этап 6 — переключение.** Переименование `AsideHeaderNext` → `AsideHeader` в мажоре, старая реализация удаляется или временно остаётся как `AsideHeaderLegacy`.

---

## 10. Аргументы для мейнтейнера

1. **Это не «переизобретение», а закрытие уже принятого пункта роадмапа** «Unify subheaderItem, menuItem, footerItem API». Проверено по коду: три API рендерят один и тот же `Item`, различаясь только местом и режимом overflow.
2. **API уменьшается измеримо:** ~32 пропа `Root` → 7; ~35 полей `AsideHeaderItem` (7 deprecated, 2 `@internal`) → 17 без deprecated; 7 механизмов кастомизации → 1.
3. **Гарантии лейаута не теряются** — `layout="slots"` оставляет строгую раскладку и запрещает произвольных прямых детей (с dev-диагностикой). Свободная композиция — осознанный opt-in.
4. **Дерево и пропы в обоих режимах одинаковые**, поэтому мы не поддерживаем два разных API.
5. **Долг вокруг `List` закрывается**: уходит `activateItem(undefined as unknown as number)`, ручной расчёт высот, отключённые `virtualized`/`sortable`/`filterable`.
6. **Попапы становятся управляемыми**, что уже сейчас запрашивается пользователями: свой контент и контроль положения относительно скоупа. Магические `mainAxis: 14` / `crossAxis: -30` перестают быть тайной и становятся документированными дефолтами.
7. **Тестируемость**: каждую часть можно смонтировать отдельно; сейчас `Header`, `CompositeBar`, `CollapseButton` без `AsideHeaderInnerContextProvider` падают.
8. **Риск управляем**: новое живёт рядом со старым, за отдельным импортом; портированные сторис дают побайтовое визуальное сравнение перед переключением.

---

## 11. Риски

| Риск                                   | Оценка / митигация                                                                                                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breaking change для всех потребителей  | Согласовано. Митигация: гайд миграции + codemod (инфраструктура есть), возможен временный `AsideHeaderLegacy`                                                                                                                                 |
| React 19 как требование                | `peerDependencies` уже допускают `^19`. Но бамп `@types/react` вскрыл **38 ошибок типов в старом коде** (0 — в новом). Нужно решение: починить типы минимально (без изменения поведения), отложить или откатить бамп типов до полной миграции |
| `Composite` — свой код вместо готового | base-ui не экспортирует `internals/composite` публично, поэтому вариант «взять зависимостью» отпадает. Наш порт — ~210 строк, покрывается unit-тестами; альтернатива (остаться на `List`) сохраняет текущие костыли                           |
| Слот-магия непрозрачна при отладке     | dev-`console.error` на нераспознанных детях; `layout="manual"` как аварийный выход                                                                                                                                                            |
| Визуальные регрессии                   | Портированные сторис + существующая инфраструктура Playwright-снапшотов; сверка со старыми снапшотами до переключения                                                                                                                         |
| Объём работ                            | Разбит на 6 этапов, каждый самостоятельно поставляемый; этап 1 уже готов                                                                                                                                                                      |

---

## 12. Рассмотренные альтернативы

1. **Оставить как есть, точечно чистить пропы.** Не решает ни унификацию пунктов, ни непрозрачность попапов, ни зависимость от `List`. Каждая новая фича продолжит добавлять проп в перегруженный интерфейс.
2. **Compound как opt-in поверх старой реализации (адаптер).** Пробовали продумать: адаптер обязан протаскивать данные в старый «бог-контекст», значит внутренние проблемы остаются, а поддерживать надо два API. Отклонено, т.к. breaking change разрешён.
3. **Полный compound без режима слотов.** Максимальная гибкость, но теряются гарантии раскладки — основное возражение мейнтейнера. Отклонено в пользу двух режимов.
4. **Оставить `List`, а compound сделать только над разметкой.** Сохраняет ручной расчёт высот и `activateItem(undefined)`; клавиатурная навигация по вложенным группам остаётся хрупкой.

---

## 13. Открытые вопросы

1. **Имя флага режима:** `layout="slots" | "manual"` или булев `disableSlots`? (в прототипе — первое)
2. `**Composite`:\*\* оставляем внутренним (`internal/`) или выносим в публичный API пакета как переиспользуемый примитив?
3. **Data-driven `items` на `Menu` / `Subheader` / `Footer`:** оставляем навсегда (упрощает миграцию) или помечаем как переходный API?
4. **React 19 type fallout:** починить 38 ошибок в старом коде сейчас, отложить или откатить бамп `@types/react`?
5. **Судьба `AllPagesPanel` и режима редактирования меню:** остаётся частью `AsideHeader` или выделяется в самостоятельный компонент пакета?
6. **Нужен ли `AsideHeaderLegacy`** на один мажор или переключаемся сразу?
