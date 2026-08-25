# RFC: перевод `AsideHeader` на compound components

- **Статус:** черновик, на обсуждение
- **Компонент:** `@gravity-ui/navigation` → `AsideHeader`
- **Прототип:** [src/components/AsideHeaderNext/](../src/components/AsideHeaderNext/) (реализован рядом со старым, старый код не тронут)
- **Тип изменения:** breaking change, мажорная версия
- **Референс подхода:** [base-ui](https://github.com/mui/base-ui/tree/master/packages/react) — `useRenderElement` + `render`-проп, `internals/composite`
- **Приложения:** [Приложение A — спецификация API](#приложение-a-спецификация-api) · [шпаргалка для презентации](./rfc-aside-header-pitch.md)

---

## 0. TL;DR

`AsideHeader` сегодня — один компонент с ~32 пропами верхнего уровня, «бог-контекстом», семью разными механизмами кастомизации и тремя почти идентичными видами пунктов (`subheaderItem` / `menuItem` / `footerItem`). Добавить фичу = изменить 5–7 файлов и добавить ещё один проп.

Предлагается разложить его на compound-компоненты в стиле base-ui:

```tsx
<AsideHeader.Root compact={compact} onCompactChange={setCompact} currentPath={pathname}>
  <AsideHeader.Logo href="/">
    <AsideHeader.Logo.Icon data={logoIcon} />
    <AsideHeader.Logo.Text>My App</AsideHeader.Logo.Text>
  </AsideHeader.Logo>

  <AsideHeader.Subheader>…</AsideHeader.Subheader>

  <AsideHeader.Menu aria-label="Main navigation">
    <AsideHeader.Item id="overview" icon={HouseIcon} render={<Link to="/overview" />}>
      Overview
    </AsideHeader.Item>
    <AsideHeader.GroupItem id="infra" icon={ServerIcon}>
      <AsideHeader.GroupItem.Trigger>Infrastructure</AsideHeader.GroupItem.Trigger>
      <AsideHeader.GroupItem.Content>…</AsideHeader.GroupItem.Content>
    </AsideHeader.GroupItem>
    <AsideHeader.Divider />
  </AsideHeader.Menu>

  <AsideHeader.Footer>
    <AsideHeader.Popup>
      <AsideHeader.Popup.Trigger icon={UserIcon}>Alex</AsideHeader.Popup.Trigger>
      <AsideHeader.Popup.Content>…</AsideHeader.Popup.Content>
    </AsideHeader.Popup>
  </AsideHeader.Footer>

  <AsideHeader.CollapseButton />
  <AsideHeader.Content>…</AsideHeader.Content>
</AsideHeader.Root>
```

Шесть ключевых решений:

1. **Один контейнер списка** `ItemList` вместо трёх обёрток. `Subheader` / `Menu` / `Footer` — его пресеты со слот-меткой и дефолтами. Список владеет клавиатурой, ARIA-ролями и overflow; пункт не знает, где он находится.
2. **Три разные сущности строки:** `Item` (лист), `GroupItem` (строка с детьми), `Divider` (разделитель) — вместо одного `Item` с полями `type: 'divider'` и `items`.
3. **Оверлеи — отдельные примитивы, а не пропы пункта.** `Popup` и `Panel` объявляются рядом со своим триггером, `Trigger` по умолчанию рендерится как `Item`, контент уезжает порталом. `Item` про оверлеи не знает вообще.
4. **Один** `render`**-проп** на каждом подкомпоненте вместо `renderContent` / `renderFooter` / `collapseButtonWrapper` / `itemWrapper` / `logo.wrapper` / `topAlert.render` / `renderPopupContent`.
5. **Вычисляемая активность** вместо булева `current`: подсвечен всегда ближайший _видимый_ узел пути — потомок, если группа раскрыта, и сама группа, если свёрнута.
6. **Два режима лейаута:** `layout="slots"` (строгая раскладка, порядок JSX не важен — «магия», но безопасная) и `layout="manual"` (свободная композиция). Дерево и пропы в обоих режимах одинаковые.

Плюс сквозной контракт лейаута (`Row` = `Leading` / `Body` / `Trailing`): у всех базовых частей заданы дефолты, поэтому в развёрнутом и свёрнутом рельсе они корректно выглядят из коробки, а кастомный контент получает то же поведение, положив себя в те же зоны.

---

## 1. Проблемы текущей реализации

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

Отдельно `AsideHeaderItem` (= `MenuItem` + расширения) имеет **~35 полей, из которых 7 помечены** `@deprecated` ([types.tsx:124-176](../src/components/AsideHeader/types.tsx)): `popupVisible`, `popupRef`, `popupPlacement`, `popupOffset`, `popupKeepMounted`, `renderPopupContent`, `onOpenChangePopup`. Плюс два поля с явной пометкой `@internal` (`compositeBarMenuPopupItems`, `compositeBarMenuPopupTitle`) — то есть внутренняя деталь протекла в публичный тип.

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

- `FooterItem` — обёртка над тем же `Item` с фиксированным `iconSize` и доп. классом; тип `FooterItemProps extends AsideHeaderItem`, т.е. полностью идентичен ([FooterItem.tsx](../src/components/AsideHeader/components/FooterItem/FooterItem.tsx));
- subheader-пункты рендерит **тот же** `CompositeBar` с `type="subheader"` и `items: AsideHeaderItem[]` ([Header.tsx:42-49](../src/components/AsideHeader/components/Header.tsx));
- menu-пункты — тот же `CompositeBar` с `type="menu"`, тот же `Item`, тот же тип (`ItemProps extends AsideHeaderItem`).

Различаются только **место размещения** и **режим overflow**.

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

Поэтому добавление одной фичи (например, `menuOverflow: 'scroll'`) потребовало правок в `types.tsx`, `CompositeBar.tsx`, `FirstPanel.tsx`, `grouping.ts`, `utils.ts`, `ScrollableWithScrollbar/` и новых пропов `collapsedMenuGroupIds` / `defaultCollapsedMenuGroupIds` / `onToggleMenuGroupCollapsed`.

---

## 2. Цели

1. Явная композиция вместо скрытых рендер-функций.
2. Один примитив `Item` вместо трёх API.
3. Одна точка кастомизации (`render`) с единой семантикой на всех подкомпонентах.
4. Узкие контексты вместо «бог-контекста»; каждый подкомпонент читает только то, что ему нужно.
5. Своя клавиатурная навигация (`Composite`) вместо `List` с отключёнными фичами.
6. Полный контроль позиционирования попапов относительно скоупа + возможность принести свою реализацию.
7. Сохранить существующую темизацию: все `--gn-aside-header-*` CSS-переменные продолжают работать.

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

#### `children` и `render`: правило приоритета

Отдельно фиксируем, что происходит с контентом, когда задан `render`. Компонент собирает дефолтный контент (иконка + заголовок + адорнменты) и кладёт его в `children` мёрдженных пропов. Дальше действует общее «later wins»:

| Что написал пользователь                                   | Что отрендерится                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| `render={<Link to="/x" />}` + `icon` + `children`          | `<Link>` с дефолтной строкой внутри                            |
| `render={<Link to="/x">Своё</Link>}`                       | `<Link>` со «Своё»; `children` пункта не используются          |
| `render={(props) => <Link {...props} to="/x" />}`          | `<Link>` с дефолтной строкой внутри                            |
| `render={(props) => <Link {...props} to="/x">Своё</Link>}` | `<Link>` со «Своё» (JSX-children перекрывают `props.children`) |

То есть «если у `render` есть свои children — они выигрывают» работает само собой, без специального кода: `children` — это обычный ключ в объекте пропов, никакого клонирования и проброса детей не происходит. `cloneElement(render, merged)` подставит дефолтный контент только если у элемента `render` своих детей нет.

Альтернатива — жёстко игнорировать `children` пункта при наличии `render` — рассматривалась и отклонена: она ломает самый частый однострочник (`render={<Link/>}` + `icon` + заголовок) и заставляет в каждом пункте-ссылке вручную пересобирать строку из `Row.Leading` / `Row.Body`. Если всё же захочется строгости, альтернатива формулируется одной строкой: не класть `children` в мёрдженные пропы, когда задан `render`.

### 3.2 `Composite` вместо UIKit `List`

Порт идеи [base-ui `internals/composite](https://github.com/mui/base-ui/tree/master/packages/react/src/internals/composite)`: roving tabindex, где активный пункт — единственная tab-остановка, навигация стрелками / `Home`/`End`, опциональный `loop`. В целевом API (§4.9) применяется внутри оверлеев, а не в самом рельсе.

Реализация: [internal/composite/](../src/components/AsideHeaderNext/internal/composite/) — `Composite` (~~150 строк) +~~ `useCompositeItem` ~~(~~60 строк). Что это даёт по сравнению с `List`:

- не нужно знать высоты пунктов заранее → уходит вся арифметика `getItemHeight` / `itemsHeight`;
- регистрация пунктов по DOM-порядку (`compareDocumentPosition`) → вложенные группы и произвольная разметка «просто работают»;
- нет `activateItem(undefined as unknown as number)`;
- контролируемый и неконтролируемый `activeIndex`.

### 3.3 React 19: `ref` как обычный проп

Прототип рассчитан на React 19, где `ref` — обычный проп и `forwardRef` не нужен. `peerDependencies` пакета **уже** допускают `^19` — потребовался только бамп dev-зависимостей до 19.2.

Плата (см. §10 «Риски»): бамп `@types/react` до 19 вскрыл **38 ошибок типов в старом коде** (React 19 сделал `RefObject<T>` → `RefObject<T | null>`, `useRef()` требует аргумент). В `AsideHeaderNext` — **0 ошибок**. Распределение: `Settings/collect-settings.ts` — 21, остальное по 1–3 в `ScrollableWithScrollbar`, старом `Item.tsx`, `Footer` (desktop/mobile), `MobileLogo`, `TopAlert`, `AllPagesListItem`, `FirstPanel`, старых сторис.

---

## 4. Предлагаемая архитектура

### 4.1 Дерево компонентов

```
AsideHeader.Root                      // compact, размер, режим лейаута, матчинг роутов, портал для панелей
├── AsideHeader.Alert                 // слот alert      — заменяет проп topAlert
├── AsideHeader.Background            // слот background — заменяет customBackground
├── AsideHeader.Logo                  // слот header     — заменяет проп logo
│   ├── AsideHeader.Logo.Icon
│   └── AsideHeader.Logo.Text
├── AsideHeader.Subheader             // слот header     — пресет ItemList, заменяет subheaderItems
├── AsideHeader.Menu                  // слот menu       — пресет ItemList, заменяет menuItems
├── AsideHeader.Footer                // слот footer     — пресет ItemList, заменяет renderFooter + FooterItem
│   ├── AsideHeader.Item              //                 — лист навигации, про оверлеи не знает
│   ├── AsideHeader.GroupItem         //   (этап 4)      — заменяет menuGroups
│   │   ├── AsideHeader.GroupItem.Trigger
│   │   └── AsideHeader.GroupItem.Content
│   ├── AsideHeader.Popup             //   (этап 3)      — заменяет renderPopupContent + popup*-пропы
│   │   ├── AsideHeader.Popup.Trigger //                 — по умолчанию рендерится как Item
│   │   └── AsideHeader.Popup.Content
│   ├── AsideHeader.Panel             //                 — заменяет panelItems
│   │   ├── AsideHeader.Panel.Trigger //                 — по умолчанию рендерится как Item
│   │   └── AsideHeader.Panel.Content //                 — портал в контейнер панелей на Root
│   └── AsideHeader.Divider           //                 — заменяет Item type="divider"
├── AsideHeader.CollapseButton        // слот footer     — заменяет hideCollapseButton / collapseButtonWrapper
├── AsideHeader.Content               // слот content    — заменяет renderContent
└── AsideHeader.Aside                 // только для layout="manual"

// Примитивы, доступные где угодно:
AsideHeader.ItemList                  // контейнер строк; Subheader/Menu/Footer — его пресеты
AsideHeader.Row (.Leading/.Body/.Trailing)   // контракт строки рельса
AsideHeader.WhenCompact / .WhenExpanded, useAsideHeaderCompact()
```

**`Popup` и `Panel` живут там, где стоит их триггер** — то есть внутри списка, а не в отдельном слоте. Наружу (в оверлей и в контейнер панелей рядом с рельсом) уезжает только контент, через портал. Это модель base-ui `Dialog` / `Popover`: `Root` объявляется рядом с триггером, `Portal` + `Positioner` рендерятся в другое место дерева.

Панель без триггера (открывается кнопкой из контента страницы) остаётся прямым ребёнком `Root` со слотом `panels` — тогда у неё просто нет `Panel.Trigger`.

Namespace-объект собирается в [AsideHeaderNext.tsx](../src/components/AsideHeaderNext/AsideHeaderNext.tsx) через `Object.assign(Root, {...})`, поэтому `<AsideHeader>` и `<AsideHeader.Root>` — одно и то же.

Полные сигнатуры всех частей — в [Приложении A](#приложение-a-спецификация-api).

### 4.2 Зоны ответственности (SRP)

| Компонент                       | Отвечает за                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `Root`                          | compact, `size`, `--gn-aside-header-size`, режим лейаута, матчинг роутов, портал для панелей |
| `Aside`                         | колонка навигации в `manual`                                                                 |
| `Row`                           | геометрия строки: 56px-полоса, тело, трейлинг; поведение зон в compact                       |
| `Logo`                          | лого + адаптация к compact                                                                   |
| `Subheader` / `Menu` / `Footer` | слот-метка + дефолты (`place`, `iconSize`)                                                   |
| `ItemList`                      | фокус-модель, ARIA-роли детей, overflow, скоуп активности                                    |
| `Item`                          | одна строка навигации: иконка, заголовок, активность, тултип                                 |
| `GroupItem`                     | раскрытие/сворачивание, выбор inline vs флайаут, агрегация активности потомков               |
| `Popup`                         | оверлей: позиционирование относительно рельса, задержки, вложенность                         |
| `Divider`                       | разделитель, пропускаемый клавиатурой                                                        |
| `CollapseButton`                | переключение compact                                                                         |
| `Content`                       | область контента                                                                             |
| `Panel`                         | drawer рядом с навигацией + портал контента в контейнер панелей                              |

### 4.3 Два режима лейаута

Главное возражение к «полному compound» — потеря гарантий раскладки. Решается флагом на `Root`:

```tsx
<AsideHeader.Root layout="slots">   {/* по умолчанию */}
<AsideHeader.Root layout="manual">
```

`**layout="slots"` (по умолчанию).** Каждый подкомпонент помечен слотом (`header` / `menu` / `footer` / `content` / `alert` / `background` / `panels`). `Root` раскладывает прямых детей по слотам, порядок в JSX не важен — Footer, написанный первым, всё равно окажется внизу. Ограничение: части должны быть **прямыми детьми `Root`.

`**layout="manual"`. Никакой магии: дети рендерятся как есть, лейаут собирает пользователь (обычно завернув навигацию в `AsideHeader.Aside`). Это замена сегодняшнего `PageLayout` / `PageLayoutAside` (сторис `AdvancedUsage`).

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

Все состояния — по паттерну controlled / uncontrolled:

| Состояние                   | Владелец    | Пропы                                                        |
| --------------------------- | ----------- | ------------------------------------------------------------ |
| compact                     | `Root`      | `compact` / `defaultCompact` / `onCompactChange`             |
| активный пункт (клавиатура) | `ItemList`  | `activeIndex` / `defaultActiveIndex` / `onActiveIndexChange` |
| открытость попапа           | `Popup`     | `open` / `defaultOpen` / `onOpenChange`                      |
| открытость панели           | `Panel`     | `open` / `defaultOpen` / `onOpenChange`                      |
| раскрытость группы          | `GroupItem` | `expanded` / `defaultExpanded` / `onExpandedChange`          |

Контексты — шесть узких вместо одного «бог-контекста» ([LayoutContext.tsx](../src/components/AsideHeaderNext/LayoutContext.tsx)):

```ts
LayoutContext      = {compact, size, layout, setCompact}                 // «где я и насколько я узкий»
NavigationContext  = {currentPath, matchStrategy, isCurrent(href)}       // матчинг роутов
ItemListContext    = {place, iconSize, role, keyboard}                   // дефолты от контейнера
CompositeContext   = {activeIndex, register, unregister, getIndex, …}    // клавиатура попапов; nullable
ActiveScopeContext = {reportActive(id, active), hasActiveDescendant}     // всплытие активности
OverlayContext     = {open, setOpen, triggerId, contentId, portalTarget} // локальный: от Popup/Panel к своему Trigger
```

Три важных следствия:

- `ItemListContext` закрывает унификацию из §1.4: `Footer` провайдит `{place: 'footer', iconSize: 18}`, и отдельный `FooterItem` не нужен.
- `CompositeContext` становится **nullable** (сейчас `useCompositeContext` бросает, [CompositeContext.ts:18-24](../src/components/AsideHeaderNext/internal/composite/CompositeContext.ts#L18-L24)). Благодаря этому `Item` перестаёт ветвиться на `place === 'menu'` ([Item.tsx:199](../src/components/AsideHeaderNext/Item.tsx#L199)): он регистрируется, если вокруг есть скоуп навигации, и рендерится обычной строкой, если нет. `place` остаётся только маркером для CSS.
- `OverlayContext` — **локальный** контекст от `Popup` / `Panel` к их собственному `Trigger`, а не глобальный реестр. В более ранней редакции RFC здесь был `PanelRegistryContext = {isOpen(id), register(id, open)}`: панели жили в слоте `panels`, триггеры — в меню, поэтому связать их можно было только по строковому `id` через реестр на `Root`. Как только `Panel` объявляется рядом со своим триггером (§4.1), реестр становится не нужен: `Panel.Trigger` читает `open` из ближайшего провайдера. Меньше кода, нет строковых связей, которые может разъехаться, и `aria-controls` получается из сгенерированных id, а не из пользовательских.

### 4.6 API подкомпонентов

Здесь — только ключевые решения и их обоснование. Полные сигнатуры, дефолты и таблицы поведения — в [Приложении A](#приложение-a-спецификация-api).

#### `Root`

7 пропов: `layout`, `compact` / `defaultCompact` / `onCompactChange`, `currentPath` / `matchStrategy`, `className`. Выставляет `--gn-aside-header-size` (56px / 236px из [constants.ts](../src/components/constants.ts)).

`currentPath` — опциональный сахар, снимающий самый частый бойлерплейт (`current: pathname.startsWith(href)` в каждом пункте); явный `current` на пункте всегда перебивает авто-матчинг.

#### `Row` — контракт лейаута для всех строк

```
┌──────────┬───────────────────────────┬──────────┐
│ Leading  │ Body                      │ Trailing │
│ 56px     │ 1fr, обрезается           │ auto     │
└──────────┴───────────────────────────┴──────────┘
   ▲ виден всегда   ▲ скрыт в compact    ▲ скрыт в compact
```

На `Row` построены `Item`, `GroupItem.Trigger`, `Logo`, `CollapseButton`. Он же экспортируется публично — чтобы кастомный контент получал корректное поведение в обоих состояниях рельса, положив себя в те же три зоны.

Три правила контракта:

1. **Скрытие в compact — только CSS, без размонтирования.** Иначе ломаются transition-ы, теряется фокус при сворачивании и расходится SSR-разметка. Сейчас `Logo` размонтирует текст ([Logo.tsx:53](../src/components/AsideHeaderNext/Logo.tsx#L53)), а `Item` прячет по CSS — это надо привести к одному.
2. `**min-height` живёт на `Row**`, а не на контенте: многострочное тело не ломает ритм рельса.
3. `**Leading` — единственная зона, гарантированно видимая в compact.\*\*

Когда CSS не хватает (в свёрнутом состоянии нужен _другой_ контент, а не тот же поуже) — `<AsideHeader.WhenCompact>` / `<AsideHeader.WhenExpanded>` / `useAsideHeaderCompact()`.

#### `Logo` — по частям

```tsx
<AsideHeader.Logo href="/">
  <AsideHeader.Logo.Icon data={logoIcon} />
  <AsideHeader.Logo.Text>My App</AsideHeader.Logo.Text>
</AsideHeader.Logo>
```

Шорткат `<AsideHeader.Logo icon={…} text="…" />` остаётся, но реализован **через** подчасти, а не параллельно им. `Logo.Icon` принимает `data` (UIKit `Icon`), `src` (картинка) или произвольные `children` — это закрывает `iconSrc` из старого [types.ts:84](../src/components/types.ts#L84). Тег по умолчанию: `a` при `href`, `button` при `onClick`, иначе `div` (сейчас всегда `button`, [Logo.tsx:35](../src/components/AsideHeaderNext/Logo.tsx#L35) — некликабельное лого не должно быть в tab-порядке).

#### `ItemList` — единственный контейнер строк

`Subheader` / `Menu` / `Footer` перестают быть отдельными реализациями и становятся пресетами:

```tsx
export const Menu = withSlot((p: ItemListProps) => <ItemList place="menu" {...p} />, 'menu');
export const Subheader = withSlot(
  (p: ItemListProps) => <ItemList place="header" {...p} />,
  'header',
);
export const Footer = withSlot(
  (p: ItemListProps) => <ItemList place="footer" iconSize={18} {...p} />,
  'footer',
);
```

Голый `ItemList` нужен там, где слотов нет: `layout="manual"`, внутри `Panel.Content`, внутри `GroupItem.Content`, внутри `Popup.Content`.

Что унификация чинит:

| Сейчас                                                                                                                                               | После                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
|                                                                                                                                                      |                                           |
| `Composite` только в `Menu`; в футере и сабхедере каждый пункт — отдельная tab-остановка                                                             | roving tabindex одинаково везде           |
| `role="menu"` без `menuitem` внутри — невалидный ARIA ([Composite.tsx:146](../src/components/AsideHeaderNext/internal/composite/Composite.tsx#L146)) | роль детей раздаёт список                 |
| `menuOverflow` / `menuMoreTitle` / `onMenuMoreClick` — пропы корня                                                                                   | пропы `ItemList`, работают в любом списке |

Наличие `items` — сознательная уступка: миграция с `menuItems={[...]}` остаётся однострочной, а composition-путь есть для тех, кому нужен контроль. Оба пути используют одни и те же `Item` / `GroupItem` / `Divider`.

Контракт содержимого: в списке ожидаются только `Item`, `GroupItem`, `Divider`. Нарушение — **dev-warning, но не фильтрация**: пользовательская обёртка вокруг `Item` не должна ломать рендер. Регистрация в клавиатурной навигации идёт по ref, а не по типу компонента.

#### `Item` / `GroupItem` / `Divider`

| Компонент   | Что это                                                             | Заменяет                                  |
| ----------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `Item`      | лист навигации: одна цель или действие                              | `menuItem`, `subheaderItem`, `footerItem` |
| `GroupItem` | строка списка, у которой есть дети                                  | `menuGroups` + 3 связанных пропа          |
| `Divider`   | `role="separator"`, пропускается клавиатурой (можно взять из uikit) | `Item type="divider"`                     |

Имя `GroupItem`, а не `Group`: это такой же элемент списка, как `Item`, — занимает строку, участвует в клавиатурной навигации, подсвечивается по тем же правилам.

У `Item` остаётся **12 пропов** против ~35 полей `AsideHeaderItem` (7 deprecated, 2 `@internal`). Из прототипа убраны: `type: 'divider'` → отдельный `Divider` (у разделителя нет ни `id`, ни `href`, ни поведения — ему нечего делать в типе пункта), `items` → `GroupItem`, `popupTitle` / `popupPlacement` / `popupOffset` → `Popup`.

**`Item` ничего не знает про оверлеи.** Ни про попап, ни про панель: у него нет ни `open`, ни `panel`, ни `popup*`-пропов. Строка навигации — это строка навигации. Всё, что связано с оверлеем, живёт в `Popup` / `Panel`, а их `Trigger` по умолчанию рендерится как `Item` (§4.7). Практическое следствие: `Item` можно смонтировать и протестировать без единого мока `Popover`/`Drawer`.

```tsx
<AsideHeader.GroupItem id="infra" defaultExpanded>
  <AsideHeader.GroupItem.Trigger icon={ServerIcon}>Infrastructure</AsideHeader.GroupItem.Trigger>
  <AsideHeader.GroupItem.Content>
    <AsideHeader.Item id="vm" href="/vm">
      VM
    </AsideHeader.Item>
    <AsideHeader.Item id="k8s" href="/k8s">
      Kubernetes
    </AsideHeader.Item>
  </AsideHeader.GroupItem.Content>
</AsideHeader.GroupItem>
```

| Рельс     | `compactBehavior` | Что видно                                        |
| --------- | ----------------- | ------------------------------------------------ |
| развёрнут | —                 | триггер + inline-раскрытие детей                 |
| свёрнут   | `flyout` (дефолт) | иконка группы; дети — во флайауте                |
| свёрнут   | `flat`            | триггер скрыт, дети — обычными иконками в рельсе |

**Один и тот же JSX детей в обоих режимах** — где их показать, решает `GroupItem`, а не потребитель. Это главное отличие от `menuGroups`, где режимы приходилось собирать вручную.

#### `CollapseButton`, `Content`, `Alert`, `Background`

Тонкие обёртки над `useRenderElement` с `render` и своим `state`:

| Компонент              | `state`, доступный в `render` |
| ---------------------- | ----------------------------- |
| `CollapseButton`       | `{compact}`                   |
| `Content`              | `{size, compact}`             |
| `Logo`                 | `{compact}`                   |
| `Alert` / `Background` | `{}`                          |

#### `Panel`

```tsx
<AsideHeader.Menu>
  <AsideHeader.Panel>
    <AsideHeader.Panel.Trigger icon={MagnifierIcon}>Search</AsideHeader.Panel.Trigger>
    <AsideHeader.Panel.Content>
      <SearchPanel />
    </AsideHeader.Panel.Content>
  </AsideHeader.Panel>
</AsideHeader.Menu>
```

`Panel.Trigger` по умолчанию рендерится как `Item` — то есть выглядит и ведёт себя как обычная строка рельса, но дополнительно получает `aria-expanded`, `aria-controls`, переключение открытости и подсветку при открытой панели. Переопределяется тем же `render`, что и везде.

`Panel.Content` — UIKit `Drawer`, спозиционированный рядом с навигацией (`left: size`, `top: var(--gn-top-alert-height)`), как в сегодняшнем [Panels.tsx](../src/components/AsideHeader/components/Panels.tsx). Рендерится порталом в контейнер панелей на `Root`, поэтому объявление рядом с триггером не мешает раскладке.

Разница со старым API: панели объявляются как JSX, а не как массив `panelItems`; состояние `open` принадлежит приложению (или самой панели в uncontrolled-режиме); исчезает скрытая синхронизация `panelItems.some(x => x.open)` из `useAsideHeaderInnerContextValue` и необходимость вручную связывать пункт меню с панелью.

### 4.7 Попапы: отдельный примитив, а не часть `Item`

Требование: пользователь должен и получать работающий дефолт, и иметь возможность подставить свой контент, зная, как попап позиционируется относительно рельса.

**Ключевое решение: `Item` про попапы не знает.** Попап — самостоятельный компонент `AsideHeader.Popup`: тонкая обёртка над UIKit `Popup`/`Popover`, которая знает про рельс (дефолтные отступы, сторону, поведение в compact, вложенность) и ничего не знает про навигацию.

```tsx
<AsideHeader.Popup>
  <AsideHeader.Popup.Trigger icon={UserIcon}>Alex</AsideHeader.Popup.Trigger>
  <AsideHeader.Popup.Content>
    <UserCard />
  </AsideHeader.Popup.Content>
</AsideHeader.Popup>
```

Три свойства, которые это даёт:

1. **`Popup.Trigger` по умолчанию рендерится как `Item`** — принимает те же пропы (`icon`, `children`, `rightAdornment`, `disabled`, `tooltipText`) и получает ту же строку рельса, плюс `aria-haspopup` / `aria-expanded` и подсветку при открытом попапе. Ничего специально описывать не нужно.
2. **Правильные отступы — из коробки.** Сегодняшние магические константы (`POPUP_MAIN_AXIS_OFFSET = 14`, `POPUP_CROSS_AXIS_OFFSET_WITH_TITLE = -30`, `placement: ['right-start','right']`, `enableSafePolygon`, `strategy: 'fixed'`) становятся дефолтами `Popup.Content` и перестают быть тайной. Compact и expanded учитываются автоматически.
3. **Правило «не закрывать родителя, пока открыт вложенный»** становится частью примитива: вложенный `Popup` регистрируется в родительском через свой контекст. Уходит ручной счётчик `nestedOpenCountRef` и ad-hoc [ItemPopupNestContext](../src/components/AsideHeader/components/CompositeBar/Item/ItemPopupNestContext.tsx).

**Кастомизация — теми же двумя рычагами, что и везде.** Позиционирование — пропами `Popup.Content` (`side`, `align`, `sideOffset`, `alignOffset`, `anchor`, `strategy`, `flip`, `shift`, задержки); полная замена разметки — через `render`.

**Один примитив на три сценария.** Флайаут свёрнутой группы, overflow «More» и попап отдельного пункта — это `Popup` с разным контентом:

| Сценарий        | Trigger                        | Content                    |
| --------------- | ------------------------------ | -------------------------- |
| попап пункта    | `Popup.Trigger` (= `Item`)     | произвольная разметка      |
| флайаут группы  | `GroupItem.Trigger`            | `ItemList` с детьми группы |
| overflow «More» | автоматический `Popup.Trigger` | `ItemList` с не влезшими   |

`GroupItem` и «More» построены **на** `Popup`, а не рядом с ним, — поэтому позиционирование, задержки и вложенность у них одинаковые по построению, а не по совпадению.

### 4.8 Модель активности

**Проблема.** Сейчас `current` — один булев проп, который потребитель считает сам и который напрямую красит пункт. Из-за этого нельзя выразить ни «пункт подсвечен, потому что открыта его панель», ни «группа подсвечена, потому что активен скрытый потомок».

**Решение — развести источники и результат.**

| Понятие               | Смысл                                   | Наружу                                |
| --------------------- | --------------------------------------- | ------------------------------------- |
| `current`             | пункт соответствует текущему URL        | `aria-current="page"`, `data-current` |
| `open`                | открыт оверлей, которым владеет триггер | `aria-expanded`, `data-open`          |
| `active`              | **визуальная подсветка** — вычисляется  | `data-active`                         |
| `hasActiveDescendant` | внутри группы есть активный потомок     | `data-has-active-descendant`          |

```ts
// Item — знает только про URL
const current = props.current ?? (props.href ? nav.isCurrent(props.href) : false);
const active = props.active ?? current;

// Popup.Trigger / Panel.Trigger — Item + открытость своего оверлея
const open = overlay.open; // из локального OverlayContext
const active = props.active ?? (current || open);

// GroupItem
const flyoutMode = compact && compactBehavior === 'flyout';
const childrenVisible = expanded && !flyoutMode;
const active = props.active ?? (flyoutOpen || (hasActiveDescendant && !childrenVisible));
```

**Правило одной строкой:** подсвечен всегда ближайший _видимый_ узел пути.

| Рельс     | Группа         | Активный потомок | Подсветка группы                      | Подсветка потомка     |
| --------- | -------------- | ---------------- | ------------------------------------- | --------------------- |
| развёрнут | свёрнута       | да               | **полная**                            | — (не виден)          |
| развёрнут | раскрыта       | да               | слабая (`data-has-active-descendant`) | **полная**            |
| свёрнут   | флайаут закрыт | да               | **полная**                            | — (не виден)          |
| свёрнут   | флайаут открыт | да               | **полная** + `data-open`              | **полная** (в попапе) |

Флайаут намеренно **не** считается «раскрытием на месте»: триггер остаётся якорем в рельсе, и снятие подсветки на время открытия попапа читалось бы как мигание.

**Четыре источника активности, все опциональные:** явный `current` на пункте; `Root.currentPath` + `href` + `matchStrategy`; открытый `Popup`; открытая `Panel`. Последние два не требуют от приложения ничего: триггер читает открытость из своего оверлея.

**Всплытие** — через `ActiveScopeContext` (`reportActive(id, active)` / `hasActiveDescendant`). Скоуп создаёт `GroupItem`, а также корневой `ItemList` — последнее нужно кнопке «More» при `overflow="more"`: если активный пункт уехал в overflow, подсвечивается «More». Реализация — внешний стор с подпиской (`useSyncExternalStore`), а не подъём состояния: отчёт одного пункта не должен перерендеривать весь список.

**Авто-раскрытие:** `expandOnActive` (по умолчанию `true`, только для uncontrolled) раскрывает группу, в которой после смены роута появился активный потомок. В controlled-режиме компонент не дёргает `onExpandedChange` без действия пользователя.

Что это даёт бесплатно: `aria-current`, `aria-expanded`, `aria-controls`, подсветка «More», авто-раскрытие группы при навигации, dev-warning при двух `current` в одном скоупе.

### 4.9 Клавиатура и ARIA

Здесь есть развилка, которую надо закрыть решением, а не дефолтом «как было»: **пункты рельса — это отдельные tab-остановки или один виджет со стрелками?**

Сегодня рельс наследует поведение UIKit `List`: roving tabindex, весь список — одна tab-остановка, движение стрелками.

**Предлагается: в рельсе — Tab, в оверлеях — стрелки.**

| Где                                              | Фокус-модель                                   | Роли                                                   |
| ------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| `Menu` / `Subheader` / `Footer`                  | Tab / Shift+Tab, каждый пункт — своя остановка | `nav` > `list` > `listitem` > `a` или `button`         |
| `GroupItem.Trigger` при inline-раскрытии         | обычная кнопка в Tab-порядке                   | `button` + `aria-expanded` (APG Disclosure Navigation) |
| `Popup.Content`, флайаут группы, overflow «More» | roving tabindex, стрелки, `Esc`                | `menu` > `menuitem`                                    |

Почему Tab в рельсе:

1. **Пункты рельса — ссылки.** Нативный порядок фокуса — то, что пользователь ожидает от навигации на любом сайте; учить ничему не надо.
2. **Roving прячет меню от Tab.** Пользователь, который табает, проскакивает весь рельс одним нажатием и без подсказки не узнает, что внутри есть стрелки.
3. **`role="tree"` / `menu` навязывает ссылкам семантику виджета приложения:** скринридер читает «дерево, элемент 3 из 12» вместо «ссылка». Для меню приложения это правильно, для навигации по сайту — нет.
4. **Проблема «слишком много tab-остановок» решается штатно** — landmark `<nav aria-label>` и skip-link, а не подменой модели фокуса.
5. **Меньше кода:** `Composite` остаётся только там, где он семантически уместен — внутри оверлеев.

Честный контраргумент: для существующих пользователей это поведенческий регресс (сейчас стрелки работают). Митигация — `keyboard="roving"` + `role="tree"` одним пропом на `ItemList`, для длинных иерархических меню.

Клавиши внутри оверлея: `↓`/`↑` по пунктам, `Home`/`End`, `Enter`/`Space` активация, `Esc` закрывает с возвратом фокуса на триггер, `→`/`←` вход во вложенный попап и выход из него.

---

## 5. Маппинг старого API на новый

| Было                                                                                                                                                     | Стало                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `compact` / `onChangeCompact`                                                                                                                            | `Root`: `compact` / `defaultCompact` / `onCompactChange`                                                  |
| `logo={{...}}`                                                                                                                                           | `<AsideHeader.Logo />` или `Logo.Icon` + `Logo.Text`                                                      |
| `logo.wrapper`                                                                                                                                           | `Logo` + `render`                                                                                         |
| `logo.iconSrc` / `logo.iconClassName` / `logo.textSize`                                                                                                  | пропы `Logo.Icon` / `Logo.Text`                                                                           |
| `subheaderItems={[...]}`                                                                                                                                 | `<AsideHeader.Subheader items={…}>` или композиция `Item`                                                 |
| `menuItems={[...]}`                                                                                                                                      | `<AsideHeader.Menu items={…}>` или композиция `Item`                                                      |
| `renderFooter={({size, compact, asideRef}) => …}`                                                                                                        | `<AsideHeader.Footer>` + композиция                                                                       |
| `FooterItem`                                                                                                                                             | `<AsideHeader.Item>` внутри `Footer`                                                                      |
| `renderContent`                                                                                                                                          | `<AsideHeader.Content>`                                                                                   |
| `hideCollapseButton`                                                                                                                                     | просто не рендерить `<AsideHeader.CollapseButton />`                                                      |
| `collapseButtonWrapper`                                                                                                                                  | `CollapseButton` + `render`                                                                               |
| `MenuItem.itemWrapper`                                                                                                                                   | `Item` + `render`                                                                                         |
| `MenuItem.title`                                                                                                                                         | `children`                                                                                                |
| `MenuItem.type: 'divider'`                                                                                                                               | `<AsideHeader.Divider />`                                                                                 |
| `MenuItem.current` (считается приложением)                                                                                                               | `current`, либо `Root.currentPath` + `href` + `matchStrategy`                                             |
| — (не выражалось)                                                                                                                                        | `Panel.Trigger` / `Popup.Trigger`: открытый оверлей подсвечивает свой триггер                             |
| `MenuItem.popupVisible` / `popupRef` / `popupPlacement` / `popupOffset` / `popupKeepMounted` / `renderPopupContent` / `onOpenChangePopup` (7 deprecated) | `Popup` + `Popup.Content`: `open` / `anchor` / `side` / `align` / `sideOffset` / `keepMounted` / `render` |
| `compositeBarMenuPopupItems` / `compositeBarMenuPopupTitle` (`@internal`)                                                                                | `GroupItem.items` / `GroupItem.popupTitle`                                                                |
| `topAlert={{...}}`                                                                                                                                       | `<AsideHeader.Alert>` (любая разметка)                                                                    |
| `customBackground` / `customBackgroundClassName`                                                                                                         | `<AsideHeader.Background>`                                                                                |
| `panelItems={[...]}` + `onClosePanel`                                                                                                                    | `<AsideHeader.Panel>` + `Panel.Trigger` + `Panel.Content`                                                 |
| `PageLayout` / `PageLayoutAside`                                                                                                                         | `layout="manual"` + `<AsideHeader.Aside>`                                                                 |
| `menuGroups` + `collapsedMenuGroupIds` + `defaultCollapsedMenuGroupIds` + `onToggleMenuGroupCollapsed`                                                   | `<AsideHeader.GroupItem expanded / defaultExpanded / onExpandedChange>` (этап 4)                          |
| `menuOverflow` / `menuMoreTitle` / `onMenuMoreClick`                                                                                                     | пропы `ItemList` — работают в любом списке (этап 4)                                                       |
| `editMenuProps` + `onMenuItemsChanged` + `onAllPagesClick`                                                                                               | отдельный компонент `AllPagesPanel` (этап 5)                                                              |

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

## 7. Статус прототипа

Реализовано в [src/components/AsideHeaderNext/](../src/components/AsideHeaderNext/), старый код не изменялся. Проходит `tsc --noEmit` (0 ошибок в новом коде), `eslint` (0 ошибок), `stylelint`, SCSS компилируется.

**Ядро:** `mergeProps`, `mergeRefs`, `useRenderElement`, `slots`, `Composite` + `useCompositeItem`, `LayoutContext` + `ItemDefaults`.

**Компоненты:** `Root` (оба режима лейаута), `Aside`, `Alert`, `Background`, `Logo`, `Subheader`, `Menu`, `Item` (включая `divider`, `rightAdornment`, тултипы, флайаут-попап с контролем позиционирования), `Footer`, `CollapseButton`, `Content`, `Panel`.

**Сторис** — портированы кейсы старого компонента для сравнения «один в один»: `Showcase`, `Compact`, `CustomTheme`, `CustomBackground`, `AdvancedUsage` (= `layout="manual"`), `HeaderAlert` / `HeaderAlertCentered` / `HeaderAlertCustom`, `LineClamp`, `CollapseButtonWrapper`, `MenuScrollbar`.

### Что осознанно не сделано

| Фича                                                     | Куда относится |
| -------------------------------------------------------- | -------------- |
| `ItemList` + nullable `CompositeContext` + `Divider`     | этап 2         |
| `Row` + разбор `Logo` на подчасти + render-гейты         | этап 2         |
| `Popup` (+ `Trigger` / `Content`) и вложенность оверлеев | этап 3         |
| `Panel.Trigger` / `Panel.Content` + портал контента      | этап 3         |
| `GroupItem` (группы, tree-connector, inline-раскрытие)   | этап 4         |
| Модель активности (`ActiveScope`, матчинг роутов)        | этап 4         |
| Overflow «More» (`AutoSizer` + расчёт вместимости)       | этап 4         |
| `overflow: 'scroll'` + `ScrollableWithScrollbar`         | этап 4         |
| `AllPagesPanel` + режим редактирования меню, сортировка  | этап 5         |
| `Fallback` (SSR-скелетон `AsideFallback`)                | этап 5         |
| `headerDecoration` (градиент + декоративный дивайдер)    | этап 5         |
| `HighlightedItem` / `bringForward`                       | этап 5         |
| `type: 'action'` (плавающая кнопка)                      | этап 5         |
| `multipleTooltip`                                        | этап 5         |
| i18n, unit- и visual-тесты, README                       | этап 6         |

---

## 8. План внедрения

Всё за фиче-флагом импорта (`AsideHeaderNext`), без влияния на текущих пользователей.

- **Этап 1 — ядро и вертикальный срез.** ✅ Сделано: ядро, слоты, `Composite`, базовые части, портированные сторис.
- **Этап 2 — унификация строк и списков.** `ItemList` + пресеты `Subheader`/`Menu`/`Footer`, nullable `CompositeContext`, `Divider`, контракт `Row`, разбор `Logo` на `Logo.Icon` / `Logo.Text`, render-гейты `WhenCompact` / `WhenExpanded`. Самый дешёвый и самый разблокирующий этап: снимает развилку по `place` в `Item` и чинит ARIA.
- **Этап 3 — оверлеи.** `Popup` (`Trigger` + `Content`) с полным набором пропов позиционирования (`side`, `align`, `sideOffset`, `alignOffset`, `anchor`, `strategy`, `flip`, `shift`, задержки), вложенные попапы как часть примитива; `Panel` переезжает на `Trigger` + `Content` с порталом.
- **Этап 4 — группы, активность, overflow.** `GroupItem`, модель активности (`ActiveScope`, `Root.currentPath`), overflow «More» и scroll-режим. Закрывает сторис `MenuGroups`\* и `MenuScrollbar`.
- **Этап 5 — оставшиеся фичи.** `AllPagesPanel`, `Fallback`, `headerDecoration`, `bringForward`, `action`-пункты, `multipleTooltip`.
- **Этап 6 — качество и документация.** Unit-тесты (композиция, слоты, клавиатура, `render`, правила активности), visual-снапшоты на портированных сторис для сравнения со старым компонентом, README + гайд миграции, при необходимости codemod (в репозитории уже есть инфраструктура [codemods/](../codemods/)).
- **Этап 7 — переключение.** Переименование `AsideHeaderNext` → `AsideHeader` в мажоре, старая реализация удаляется или временно остаётся как `AsideHeaderLegacy`.

---

## 9. Аргументы для мейнтейнера

1. **API уменьшается измеримо:** ~32 пропа `Root` → 7; ~35 полей `AsideHeaderItem` (7 deprecated, 2 `@internal`) → 13 без deprecated; 7 механизмов кастомизации → 1; 4 API «пункта навигации» → 1; 3 контекста (один — «всё сразу») → 6 узких.
2. **Гарантии лейаута не теряются** — `layout="slots"` оставляет строгую раскладку и запрещает произвольных прямых детей (с dev-диагностикой). Свободная композиция — осознанный opt-in.
3. **Долг вокруг** `List` **закрывается**: уходит `activateItem(undefined as unknown as number)`, ручной расчёт высот, отключённые `virtualized`/`sortable`/`filterable`.
4. **Попапы становятся управляемыми**: свой контент и контроль положения относительно скоупа. Магические `mainAxis: 14` / `crossAxis: -30` перестают быть тайной и становятся документированными дефолтами.
5. **Чинятся четыре текущих дефекта, а не только API:** невалидный ARIA (`role="menu"` без `menuitem`), отсутствие клавиатурной навигации в футере и сабхедере, непозиционируемые попапы, невозможность подсветить пункт по открытой панели.
6. **Тестируемость**: каждую часть можно смонтировать отдельно; сейчас `Header`, `CompositeBar`, `CollapseButton` без `AsideHeaderInnerContextProvider` падают.
7. **Риск управляем**: новое живёт рядом со старым, за отдельным импортом;

---

## 10. Риски

| Риск                                   | Оценка / митигация                                                                                                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breaking change для всех потребителей  | Согласовано. Митигация: гайд миграции + codemod (инфраструктура есть), возможен временный `AsideHeaderLegacy`                                                                                                                                 |
| React 19 как требование                | `peerDependencies` уже допускают `^19`. Но бамп `@types/react` вскрыл **38 ошибок типов в старом коде** (0 — в новом). Нужно решение: починить типы минимально (без изменения поведения), отложить или откатить бамп типов до полной миграции |
| `Composite` — свой код вместо готового | base-ui не экспортирует `internals/composite` публично, поэтому вариант «взять зависимостью» отпадает. Наш порт — ~210 строк, покрывается unit-тестами; альтернатива (остаться на `List`) сохраняет текущие костыли                           |
| Слот-магия непрозрачна при отладке     | dev-`console.error` на нераспознанных детях; `layout="manual"` как аварийный выход                                                                                                                                                            |

---

# Приложение A. Спецификация API

Справочная часть RFC: полные сигнатуры, дефолты и таблицы поведения каждой части. Концептуальные решения и их обоснование — в §4.

Общие соглашения действуют для всех частей и здесь не повторяются:

- семантика `render` и правило приоритета `children` — §3.1;
- правила мёрджа пропов — `on[A-Z]*` чейнятся, `className` склеиваются, `style` шэллоу-мёрджится, refs объединяются;
- каждое состояние — пара controlled / uncontrolled, §4.5;
- у каждой части есть `className`, `render`, `ref` — в таблицах ниже они не дублируются.

Для читаемости варианты union-типов ниже перечислены через `/`.

## A.1. data-атрибуты

Всё вычисленное состояние доступно двумя способами: в `render(props, state)` — для JS, и в `data-*` на DOM-узле — для CSS.

| Атрибут                      | Где                                           | Значение                               |
| ---------------------------- | --------------------------------------------- | -------------------------------------- |
| `data-compact`               | все части                                     | рельс свёрнут                          |
| `data-place`                 | `Row`, `Item`, `GroupItem`                    | `header` / `menu` / `footer` / `popup` |
| `data-current`               | `Item`                                        | пункт соответствует текущему URL       |
| `data-active`                | `Item`, `GroupItem`, триггеры оверлеев        | **визуальная подсветка** (§4.8)        |
| `data-open`                  | `Popup.Trigger`, `Panel.Trigger`, `GroupItem` | открыт оверлей                         |
| `data-expanded`              | `GroupItem`                                   | группа раскрыта inline                 |
| `data-has-active-descendant` | `GroupItem`, `ItemList`                       | внутри есть активный потомок           |
| `data-disabled`              | `Item`, `GroupItem`                           |                                        |
| `data-highlighted`           | пункты внутри оверлея                         | текущая остановка roving tabindex      |

```css
/* точки расширения для потребителя */
.my-aside [data-active] {
  background: var(--my-accent);
}
.my-aside [data-has-active-descendant]:not([data-active]) {
  color: var(--my-accent);
}
.my-aside [data-compact] [data-place='footer'] {
}
```

## A.2. `Root`

| Проп              | Тип                                                       | Дефолт     |
| ----------------- | --------------------------------------------------------- | ---------- |
| `layout`          | `'slots'` / `'manual'`                                    | `'slots'`  |
| `compact`         | `boolean`                                                 |            |
| `defaultCompact`  | `boolean`                                                 | `false`    |
| `onCompactChange` | `(compact: boolean) => void`                              |            |
| `currentPath`     | `string`                                                  |            |
| `matchStrategy`   | `'exact'` / `'prefix'` / `(href, currentPath) => boolean` | `'prefix'` |
| `qa`              | `string`                                                  |            |

Выставляет `--gn-aside-header-size`, предоставляет контейнер-портал для `Panel.Content`. Не знает про пункты, оверлеи и их содержимое.

## A.3. `Row`

```
┌──────────┬───────────────────────────┬──────────┐
│ Leading  │ Body                      │ Trailing │
│ 56px     │ 1fr, обрезается           │ auto     │
└──────────┴───────────────────────────┴──────────┘
   ▲ виден всегда   ▲ скрыт в compact    ▲ скрыт в compact
```

```tsx
<AsideHeader.Row interactive>
  <AsideHeader.Row.Leading>
    <Icon data={FolderIcon} size={18} />
  </AsideHeader.Row.Leading>
  <AsideHeader.Row.Body>Projects</AsideHeader.Row.Body>
  <AsideHeader.Row.Trailing>
    <Label theme="info">New</Label>
  </AsideHeader.Row.Trailing>
</AsideHeader.Row>
```

| Проп          | Тип                                            | Дефолт               | Описание                               |
| ------------- | ---------------------------------------------- | -------------------- | -------------------------------------- |
| `interactive` | `boolean`                                      | `false`              | hover/active-стили и `cursor: pointer` |
| `place`       | `'header'` / `'menu'` / `'footer'` / `'popup'` | из `ItemListContext` | влияет только на `data-place`          |

`state` в `render`: `{compact, place}`. Зоны опциональны и позиционно независимы — порядок в JSX не важен.

Render-гейты для случаев, когда в свёрнутом состоянии нужен _другой_ контент, а не тот же поуже:

```tsx
<AsideHeader.WhenExpanded><OrgSwitcher /></AsideHeader.WhenExpanded>
<AsideHeader.WhenCompact><OrgAvatar /></AsideHeader.WhenCompact>
const compact = useAsideHeaderCompact();
```

## A.4. `Logo`

| Проп         | Тип                 | Дефолт | Описание                               |
| ------------ | ------------------- | ------ | -------------------------------------- |
| `icon`       | `IconProps['data']` |        | шорткат для `Logo.Icon`                |
| `iconSrc`    | `string`            |        | картинка вместо SVG                    |
| `text`       | `React.ReactNode`   |        | шорткат для `Logo.Text`                |
| `href`       | `string`            |        | рендерит `<a>`                         |
| `target`     | `string`            |        |                                        |
| `onClick`    | `(e) => void`       |        | рендерит `<button>`                    |
| `children`   | `ReactNode`         |        | подчасти или произвольный контент      |
| `aria-label` | `string`            |        | обязателен, если текст скрыт в compact |

Тег по умолчанию: `a` при `href`, `button` при `onClick`, иначе `div`. `state`: `{compact}`.

**`Logo.Icon`** — `data` (UIKit `Icon`) / `src` (картинка) / `children` (произвольный узел), `size` (дефолт `24`). Занимает `Row.Leading`.

**`Logo.Text`** — `children`. Занимает `Row.Body`, в compact скрывается по CSS.

## A.5. `ItemList`

| Проп                  | Тип                                                | Дефолт       |
| --------------------- | -------------------------------------------------- | ------------ |
| `items`               | `Array<ItemProps / GroupItemProps / DividerProps>` |              |
| `place`               | `'header'` / `'menu'` / `'footer'` / `'popup'`     |              |
| `iconSize`            | `number`                                           | `18`         |
| `orientation`         | `'vertical'` / `'horizontal'`                      | `'vertical'` |
| `overflow`            | `'visible'` / `'scroll'` / `'more'`                | `'visible'`  |
| `moreTitle`           | `React.ReactNode`                                  |              |
| `onMoreClick`         | `() => void`                                       |              |
| `keyboard`            | `'tab'` / `'roving'`                               | `'tab'`      |
| `loop`                | `boolean`                                          | `true`       |
| `activeIndex`         | `number`                                           |              |
| `defaultActiveIndex`  | `number`                                           | `0`          |
| `onActiveIndexChange` | `(index: number) => void`                          |              |
| `scope`               | `'new'` / `'inherit'`                              | авто         |
| `role`                | `'list'` / `'tree'` / `'menu'` / `'none'`          | `'list'`     |
| `aria-label`          | `string`                                           |              |

`state`: `{compact, place, overflowing}`.

`loop`, `activeIndex` и `scope` имеют смысл только при `keyboard="roving"` — то есть внутри оверлеев и в явно включённом tree-режиме (§4.9).

Авто-правило для `scope`:

| Ситуация                               | Скоуп                                    |
| -------------------------------------- | ---------------------------------------- |
| корневой список (`Menu`, `Footer`, …)  | `new`                                    |
| `GroupItem.Content` в inline-раскрытии | `inherit` — навигация едет сквозь группу |
| `GroupItem.Content` во флайауте        | `new` — фокус физически уходит в попап   |
| `ItemList` внутри `Popup.Content`      | `new`                                    |

## A.6. `Item`

| Проп              | Тип                 | Дефолт                         | Описание                            |
| ----------------- | ------------------- | ------------------------------ | ----------------------------------- |
| `id`              | `string`            | —                              | обязателен                          |
| `icon`            | `IconProps['data']` |                                |                                     |
| `iconSize`        | `number`            | из списка, иначе `18`          |                                     |
| `children`        | `ReactNode`         |                                | заголовок                           |
| `rightAdornment`  | `ReactNode`         |                                | например тег «New»; скрыт в compact |
| `href` / `target` | `string`            |                                | `href` → `<a>`, иначе `<button>`    |
| `onClick`         | `(e) => void`       |                                |                                     |
| `current`         | `boolean`           | из `Root.currentPath` + `href` |                                     |
| `active`          | `boolean`           | `= current`                    | жёсткий override подсветки          |
| `disabled`        | `boolean`           |                                |                                     |
| `tooltipText`     | `ReactNode`         | заголовок в compact            |                                     |
| `qa`              | `string`            |                                |                                     |

`state`: `{current, active, disabled, compact, place, highlighted}`.

**У `Item` нет пропов оверлея.** Ни `open`, ни `panel`, ни `popup*`: строка навигации не знает ни про попапы, ни про панели. Всё это живёт в `Popup` / `Panel`, чьи триггеры рендерятся как `Item` (§4.7).

## A.7. `Popup`

```tsx
<AsideHeader.Popup>
  <AsideHeader.Popup.Trigger icon={UserIcon}>Alex</AsideHeader.Popup.Trigger>
  <AsideHeader.Popup.Content>
    <UserCard />
  </AsideHeader.Popup.Content>
</AsideHeader.Popup>
```

`Popup` — обёртка над UIKit `Popup`/`Popover`, знающая про рельс. Владеет открытостью и связью триггера с контентом.

| Проп           | Тип                       | Дефолт                                       |
| -------------- | ------------------------- | -------------------------------------------- |
| `open`         | `boolean`                 |                                              |
| `defaultOpen`  | `boolean`                 | `false`                                      |
| `onOpenChange` | `(open: boolean) => void` |                                              |
| `trigger`      | `'hover'` / `'click'`     | `'hover'` в compact, `'click'` в развёрнутом |
| `disabled`     | `boolean`                 | `false`                                      |

**`Popup.Trigger`** принимает те же пропы, что `Item`, и по умолчанию рендерится им же. Дополнительно получает `aria-haspopup`, `aria-expanded`, `aria-controls`, `data-open` и подсветку при открытом попапе.

**`Popup.Content`** — дефолты сняты с сегодняшнего `ItemPopup` и задокументированы:

| Проп                       | Тип                                         | Дефолт    | Комментарий                                                           |
| -------------------------- | ------------------------------------------- | --------- | --------------------------------------------------------------------- |
| `side`                     | `'top'` / `'right'` / `'bottom'` / `'left'` | `'right'` |                                                                       |
| `align`                    | `'start'` / `'center'` / `'end'`            | `'start'` |                                                                       |
| `sideOffset`               | `number`                                    | `14`      | бывшая `POPUP_MAIN_AXIS_OFFSET`                                       |
| `alignOffset`              | `number`                                    | `0`       | бывшая `POPUP_CROSS_AXIS_OFFSET_*`; смещение под заголовок делает CSS |
| `anchor`                   | `Element` / `RefObject` / `() => Element`   | триггер   | якорь можно вынести на весь рельс                                     |
| `strategy`                 | `'absolute'` / `'fixed'`                    | `'fixed'` |                                                                       |
| `flip` / `shift`           | `boolean`                                   | `true`    |                                                                       |
| `openDelay` / `closeDelay` | `number`                                    | `100`     | бывшая `DEFAULT_POPUP_DELAY`                                          |
| `safePolygon`              | `boolean`                                   | `true`    | бывший `enableSafePolygon`                                            |
| `keepMounted`              | `boolean`                                   | `false`   |                                                                       |
| `title`                    | `ReactNode`                                 |           | заголовок над контентом                                               |

Внутри `Popup.Content` фокус-модель — roving tabindex со стрелками и `Esc` (§4.9). Правило «не закрывать родителя, пока открыт вложенный» — часть примитива: вложенный `Popup` регистрируется в родительском через свой контекст, вместо ручного счётчика `nestedOpenCountRef` и ad-hoc [ItemPopupNestContext](../src/components/AsideHeader/components/CompositeBar/Item/ItemPopupNestContext.tsx).

## A.8. `GroupItem`

| Проп               | Тип                               | Дефолт      | Описание                            |
| ------------------ | --------------------------------- | ----------- | ----------------------------------- |
| `id`               | `string`                          | —           |                                     |
| `icon` / `title`   | `IconProps['data']` / `ReactNode` |             | шорткаты вместо `GroupItem.Trigger` |
| `items`            | `Array<ItemProps / DividerProps>` |             | шорткат вместо `GroupItem.Content`  |
| `expanded`         | `boolean`                         |             |                                     |
| `defaultExpanded`  | `boolean`                         | `false`     |                                     |
| `onExpandedChange` | `(expanded: boolean) => void`     |             |                                     |
| `expandOnActive`   | `boolean`                         | `true`      | только uncontrolled                 |
| `compactBehavior`  | `'flyout'` / `'flat'`             | `'flyout'`  |                                     |
| `popupTitle`       | `ReactNode`                       |             |                                     |
| `active`           | `boolean`                         | вычисляется | override подсветки                  |
| `disabled`         | `boolean`                         |             |                                     |

`state`: `{expanded, active, hasActiveDescendant, open, compact, disabled}`.

**`GroupItem.Trigger`** — `icon`, `iconSize`, `children`, `rightAdornment`; кнопка с `aria-expanded` в развёрнутом рельсе, триггер `Popup` в свёрнутом. **`GroupItem.Content`** — вложенный `ItemList`; принимает те же пропы.

Реализован на `Popup` + `ItemList`, а не рядом с ними: во флайаут-режиме это буквально `Popup` с `ItemList` внутри.

## A.9. `Divider`

Без обязательных пропов. `role="separator"`, в фокус-порядок не попадает, в roving-режиме пропускается. `state`: `{compact}`.

## A.10. `CollapseButton`

| Проп            | Тип      | Описание                          |
| --------------- | -------- | --------------------------------- |
| `collapseTitle` | `string` | подпись/тултип в развёрнутом виде |
| `expandTitle`   | `string` | подпись/тултип в свёрнутом виде   |

`state`: `{compact}`. `hideCollapseButton` не нужен — просто не рендерим компонент.

## A.11. `Content`, `Alert`, `Background`, `Aside`

| Компонент    | Пропы сверх общих    | `state`           | Заменяет                                         |
| ------------ | -------------------- | ----------------- | ------------------------------------------------ |
| `Content`    | `children`           | `{size, compact}` | `renderContent`                                  |
| `Alert`      | `children`, `height` | `{}`              | `topAlert` + `topAlert.render`                   |
| `Background` | `children`           | `{}`              | `customBackground` / `customBackgroundClassName` |
| `Aside`      | `children`           | `{compact, size}` | `PageLayoutAside`                                |

`Alert.height` — SSR-оценка высоты, чтобы не было прыжка при гидрации; выставляет `--gn-top-alert-height`.

## A.12. `Panel`

```tsx
<AsideHeader.Panel>
  <AsideHeader.Panel.Trigger icon={MagnifierIcon}>Search</AsideHeader.Panel.Trigger>
  <AsideHeader.Panel.Content>
    <SearchPanel />
  </AsideHeader.Panel.Content>
</AsideHeader.Panel>
```

| Проп           | Тип                       | Дефолт  |
| -------------- | ------------------------- | ------- |
| `open`         | `boolean`                 |         |
| `defaultOpen`  | `boolean`                 | `false` |
| `onOpenChange` | `(open: boolean) => void` |         |

**`Panel.Trigger`** — те же пропы, что у `Item`, по умолчанию им же и рендерится; получает `aria-expanded`, `aria-controls`, `data-open` и подсветку при открытой панели.

**`Panel.Content`**:

| Проп               | Тип                                         | Дефолт   |
| ------------------ | ------------------------------------------- | -------- |
| `placement`        | `'left'` / `'right'` / `'top'` / `'bottom'` | `'left'` |
| `keepMounted`      | `boolean`                                   | `false`  |
| `contentClassName` | `string`                                    |          |

Рендерится порталом в контейнер панелей на `Root` (`left: size`, `top: var(--gn-top-alert-height)`), поэтому `Panel` можно объявлять рядом с триггером внутри списка.

Панель без триггера (открывается из контента страницы) — прямой ребёнок `Root` со слотом `panels`, `open` контролируется приложением.

## A.13. Полный пример

```tsx
import {AsideHeader} from '@gravity-ui/navigation';
import {Link, useLocation} from 'react-router-dom';

function App({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();
  const [compact, setCompact] = React.useState(false);

  return (
    <AsideHeader.Root
      compact={compact}
      onCompactChange={setCompact}
      currentPath={pathname}
      matchStrategy="prefix"
    >
      <AsideHeader.Alert height={40}>
        <MaintenanceBanner />
      </AsideHeader.Alert>

      <AsideHeader.Logo render={<Link to="/" />}>
        <AsideHeader.Logo.Icon data={logoIcon} />
        <AsideHeader.Logo.Text>Acme Cloud</AsideHeader.Logo.Text>
      </AsideHeader.Logo>

      <AsideHeader.Subheader>
        <AsideHeader.Panel>
          <AsideHeader.Panel.Trigger icon={MagnifierIcon}>Search</AsideHeader.Panel.Trigger>
          <AsideHeader.Panel.Content>
            <SearchPanel />
          </AsideHeader.Panel.Content>
        </AsideHeader.Panel>
      </AsideHeader.Subheader>

      <AsideHeader.Menu aria-label="Main navigation" overflow="scroll">
        <AsideHeader.Item id="overview" icon={HouseIcon} render={<Link to="/overview" />}>
          Overview
        </AsideHeader.Item>

        <AsideHeader.GroupItem id="infra" icon={ServerIcon} defaultExpanded>
          <AsideHeader.GroupItem.Trigger>Infrastructure</AsideHeader.GroupItem.Trigger>
          <AsideHeader.GroupItem.Content>
            <AsideHeader.Item id="vm" render={<Link to="/infra/vm" />}>
              VM
            </AsideHeader.Item>
            <AsideHeader.Item id="k8s" render={<Link to="/infra/k8s" />}>
              Kubernetes
            </AsideHeader.Item>
          </AsideHeader.GroupItem.Content>
        </AsideHeader.GroupItem>

        <AsideHeader.Divider />

        <AsideHeader.Item
          id="billing"
          icon={CreditCardIcon}
          render={<Link to="/billing" />}
          rightAdornment={<Label theme="info">New</Label>}
        >
          Billing
        </AsideHeader.Item>
      </AsideHeader.Menu>

      <AsideHeader.Footer>
        <AsideHeader.Item
          id="support"
          icon={SupportIcon}
          href="https://support.acme.dev"
          target="_blank"
        >
          Support
        </AsideHeader.Item>

        <AsideHeader.Popup>
          <AsideHeader.Popup.Trigger icon={UserIcon}>Alex</AsideHeader.Popup.Trigger>
          <AsideHeader.Popup.Content align="end">
            <UserCard />
          </AsideHeader.Popup.Content>
        </AsideHeader.Popup>
      </AsideHeader.Footer>

      <AsideHeader.CollapseButton />

      <AsideHeader.Content>{children}</AsideHeader.Content>
    </AsideHeader.Root>
  );
}
```
