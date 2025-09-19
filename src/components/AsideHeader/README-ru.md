<!--GITHUB_BLOCK-->

# AsideHeader

<!--/GITHUB_BLOCK-->

Компонент `AsideHeader` позволяет создать гибкий и настраиваемый интерфейс навигации в приложении.
Пользователи могут легко адаптировать внешний вид боковой панели под цвета своего бренда, а также добавлять уникальные ссылки и иконки, отражающие функциональность приложения.

Данный компонент предлагает надежное решение для создания интуитивно понятных и визуально привлекательных систем навигации, улучшая при этом пользовательский опыт и обеспечивая гибкость для адаптации к различным сценариям.

```ts
import {AsideHeader} from '@gravity-ui/navigation';
```

<!--GITHUB_BLOCK-->

## Внешний вид

<!--/GITHUB_BLOCK-->

### Состояние

Компонент имеет два состояния: свернутое и развернутое.
Управлять состоянием можно через свойства `compact` и `onChangeCompact`, а видимостью кнопки — через `hideCollapseButton`.

### Оформление верхнего блока

`AsideHeader` позволяет выделить верхний блок с элементами логотипа и подзаголовка с помощью свойства `headerDecoration`.

### Пользовательский фон

Компонент поддерживает различные варианты оформления, такие как добавление фонового изображения или разделение блоков по цвету. Для этого используются свойства `customBackground` и `customBackgroundClassName`.

## Блоки

Интерфейс навигации состоит из трех блоков: верхнего, среднего и нижнего. Эти блоки схожи, но могут различаться функциональностью в зависимости от частоты обращения к ним пользователей.
**Примечание**: состоянием элементов управляет пользователь.

### Верхний блок

Данный блок, как правило, включает логотип и другие элементы, расположенные под ним, которые присутствуют на всех страницах сайта. Для быстрого перехода на главную страницу можно использовать кликабельный логотип. При необходимости под логотипом можно разместить другие элементы, такие как поисковая строка и каталог.

### Средний блок (`menuItems`)

Данный блок является основным, а его содержимое может меняться в зависимости от текущей страницы. Один из примеров использования — навигация по многостраничным сайтам.
При нехватке вертикального пространства элементы автоматически сворачиваются в иконку с многоточием.

Элементы навигации могут находиться в двух состояниях: свернутом (`isCollapsed`), когда видна только иконка, и развернутом. Также можно настроить внешний вид всего элемента через обертку.

С помощью настроек `AllPages` пользователи могут закреплять нужные элементы и скрывать ненужные, задавая им состояние `pinned` (закреплено) и `hidden` (скрыто). Закрепленные элементы всегда остаются видимыми.

Для добавления компонента `All Pages`, отображающего панель редактирования списка видимых элементов, необходим обратный вызов `onMenuItemsChanged`.

**Примечание**: пользователь управляет списком элементов меню, полученным из обратного вызова, и передает новое состояние элементов в `AsideHeader`.

Элементы данного блока могут иметь множественную всплывающую подсказку.

### Нижний блок

Нижний блок (футер) повышает удобство пользователей, обеспечивая легкий доступ к элементам и вспомогательным ресурсам. Он позволяет связаться со службой поддержки и включает дополнительную информацию, чтобы пользователю было проще ориентироваться.

В футере можно использовать как собственные компоненты, так и `FooterItem`.

### Элементы

Элементы блока поддерживают тултипы, всплывающие окна и выдвижные боковые панели — для их применения необходимо задать соответствующие настройки.

#### Всплывающие окна (Popup)

⚠️ **Важно**: Встроенные поля попапов (`popupVisible`, `popupRef`, `popupPlacement`, `popupOffset`, `popupKeepMounted`, `renderPopupContent`, `onOpenChangePopup`) помечены как устаревшие и будут удалены в будущих версиях.

Для создания всплывающих окон теперь рекомендуется использовать свойство `itemWrapper`. Это дает больше гибкости и контроля над поведением элемента.

**Пример использования itemWrapper для создания попапа:**

```tsx
import {Popup} from '@gravity-ui/uikit';

const menuItems: AsideHeaderItem[] = [
  {
    id: 'item-with-popup',
    title: 'Элемент с попапом',
    icon: 'settings',
    itemWrapper: (params, makeItem, opts) => {
      const [popupOpen, setPopupOpen] = React.useState(false);
      const anchorRef = React.useRef<HTMLElement>(null);

      return (
        <>
          <div ref={anchorRef} onClick={() => setPopupOpen(!popupOpen)}>
            {makeItem(params)}
          </div>
          <Popup
            open={popupOpen}
            anchorRef={anchorRef}
            onOpenChange={setPopupOpen}
            placement="right-start"
          >
            <div style={{padding: '12px'}}>Содержимое попапа</div>
          </Popup>
        </>
      );
    },
  },
];
```

#### Выделение элемента

Выделение элемента поверх модальных окон может быть полезным, если пользователь хочет отправить сообщение об ошибке через форму обратной связи, открываемую в модальном окне.

В компоненте `FooterItem` и в конфигурации элементов `menuItems`, `subheaderItems` можно передать свойство `bringForward`, которое отображает иконку поверх модальных окон. Кроме того, в `AsideHeader` необходимо передать функцию, которая будет уведомлять об открытии модальных окон.

## Рендеринг контента

Область справа от `AsideHeader` отведена под основной контент страницы.
При разворачивании и сворачивании элемента навигации его размер (значение `size`) будет меняться. Это нужно учитывать, например, для корректировки макета компонентов.
CSS-переменная `--gn-aside-header-size` содержит актуальный размер элемента навигации.

Ниже представлено описание альтернативного метода рендеринга контента.

### Оптимизация рендеринга

Если контент вашего приложения необходимо рендерить быстрее, чем это позволяют свойства `AsideHeader`, можно перейти на использование `PageLayout` с расширенными настройками.

<!--GITHUB_BLOCK-->

```diff
--- Main.tsx
+++ Main.tsx
-import {AsideHeader} from './AsideHeader'
+import {PageLayout, AsideFallback} from '@gravity-ui/navigation';
+const Aside = React.lazy(() =>
+    import('./Aside').then(({Aside}) => ({ default: Aside }))
+);

-    <AsideHeader renderContent={renderContent} {...restProps} />
+    <PageLayout>
+        <Suspense fallback={<AsideFallback />}>
+           <Aside />
+        </Suspense>
+
+        <PageLayout.Content>
+            <ContentExample />
+        </PageLayout.Content>
+    </PageLayout>
--- Aside.tsx
+++ Aside.tsx
-import {AsideHeader} from '@gravity-ui/navigation';
+import {PageLayoutAside} from '@gravity-ui/navigation';

export const Aside: FC = () => {
    return (
-        <AsideHeader {...props}>
+        <PageLayoutAside {...props}/>
    );
};
```

<!--/GITHUB_BLOCK-->

## Свойства

| Имя                       | Описание                                                                                                         |                                                              Тип                                                              |   Значение по умолчанию   |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------: | :-----------------------: |
| className                 | HTML-атрибут `class` для логотипа.                                                                               |                                                           `string`                                                            |                           |
| collapseButtonWrapper     | Обертка для `CollapseButton`, позволяющая кастомизировать вид дефолтной кнопки.                                  | `(defaultButton: React.ReactNode, data: {compact: boolean; onChangeCompact?: (compact: boolean) => void}) => React.ReactNode` |                           |
| collapseTitle             | Заголовок `CollapseButton` для сворачивания элемента навигации.                                                  |                                                           `string`                                                            | `"Свернуть"` `"Collapse"` |
| compact                   | Визуальное состояние элемента навигации.                                                                         |                                                           `boolean`                                                           |          `false`          |
| customBackground          | Фон `AsideHeader`.                                                                                               |                                                       `React.ReactNode`                                                       |                           |
| customBackgroundClassName | Переопределяет стили контейнера фона по умолчанию.                                                               |                                                           `string`                                                            |                           |
| expandTitle               | Заголовок `CollapseButton` для разворачивания элемента навигации.                                                |                                                           `string`                                                            | `"Развернуть"` `"Expand"` |
| headerDecoration          | Цвет фона верхнего блока с элементами логотипа и подзаголовка.                                                   |                                                           `boolean`                                                           |          `false`          |
| hideCollapseButton        | Скрывает `CollapseButton`. Для установки дефолтного состояния элемента навигации используйте свойство `compact`. |                                                           `boolean`                                                           |          `false`          |
| logo                      | Контейнер логотипа, включающий иконку с заголовком и обрабатывающий клики.                                       |                                              [`Logo`](./../Logo/Readme.md#logo)                                               |                           |
| menuItems                 | Элементы в среднем блоке навигации.                                                                              |                                                   `Array<AsideHeaderItem>`                                                    |           `[]`            |
| menuMoreTitle             | Дополнительный заголовок для `menuItems`, если элементы не помещаются.                                           |                                                           `string`                                                            |     `"Ещё"` `"More"`      |
| multipleTooltip           | Отображает несколько тултипов при наведении на элементы меню (`menuItems`) в свернутом состоянии.                |                                                           `boolean`                                                           |          `false`          |
| onChangeCompact           | Обратный вызов, срабатывающий при изменении визуального состояния элемента навигации.                            |                                                 `(compact: boolean) => void;`                                                 |                           |
| onClosePanel              | Обратный вызов, срабатывающий при закрытии панели. Панели можно добавлять через свойство `PanelItems`.           |                                                         `() => void;`                                                         |                           |
| onMenuItemsChanged        | Обратный вызов, срабатывающий при изменении списка `menuItems` в `AllPagesPanel`.                                |                                           `(items: Array<AsideHeaderItem>) => void`                                           |                           |
| onMenuMoreClick           | Обратный вызов, срабатывающий при нажатии кнопки **More** («Еще»), если часть элементов скрыта.                  |                                                         `() => void;`                                                         |                           |
| onAllPagesClick           | Обратный вызов, срабатывающий при нажатии кнопки **All pages** («Все станицы»).                                  |                                                         `() => void;`                                                         |                           |
| openModalSubscriber       | Функция для уведомления `AsideHeader` об изменении состояния видимости модальных окон.                           |                                             `( (open: boolean) => void) => void`                                              |                           |
| panelItems                | Элементы компонента `Drawer`. Используется для отображения дополнительной информации поверх основного контента.  |                                 [`Array<DrawerItem>`](./../Drawer/README.md#draweritem-props)                                 |           `[]`            |
| renderContent             | Функция рендеринга основного контента справа от `AsideHeader`.                                                   |                                          `(data: {size: number}) => React.ReactNode`                                          |                           |
| renderFooter              | Функция рендеринга нижнего блока навигации.                                                                      |                                          `(data: {size: number}) => React.ReactNode`                                          |                           |
| ref                       | Ссылка на якорь целевого всплывающего окна.                                                                      |                                    `React.ForwardedRef<HTMLDivElement, AsideHeaderProps>`                                     |                           |
| subheaderItems            | Элементы, расположенные под логотипом в верхнем блоке навигации.                                                 |                                                   ` Array<AsideHeaderItem>`                                                   |           `[]`            |
| topAlert                  | Контейнер над элементом навигации на основе компонента `Alert` из фреймворка UIKit.                              |                                                          `TopAlert`                                                           |                           |
| qa                        | Значение, которое будет передано в атрибут `data-qa` контейнера `AsideHeader`.                                   |                                                           `string`                                                            |                           |

### `AsideHeaderItem`

| Имя                    | Описание                                                                                                                                                                                            |                                                                         Тип                                                                          |      Значение по умолчанию      |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------: |
| afterMoreButton        | Элемент будет всегда отображаться в конце списка, даже если не помещается.                                                                                                                          |                                                                      `boolean`                                                                       |                                 |
| category               | Категория, к которой относится элемент меню. Используется для группировки в режиме отображения или редактирования всех страниц.                                                                     |                                                                       `string`                                                                       |   `"Остальное"` `"All other"`   |
| current                | Текущий (выбранный) элемент.                                                                                                                                                                        |                                                                      `boolean`                                                                       |             `false`             |
| hidden                 | Видимость элемента в меню.                                                                                                                                                                          |                                                                      `boolean`                                                                       |             `false`             |
| icon                   | Иконка меню на основе компонента `Icon` из фреймворка UIKit.                                                                                                                                        |                         [`IconProps['data']`](https://github.com/gravity-ui/uikit/tree/main/src/components/Icon#properties)                          |                                 |
| iconSize               | Размер иконки меню.                                                                                                                                                                                 |                                                                  `number` `string`                                                                   |              `18`               |
| iconQa                 | Значение, которое будет передано в атрибут `data-qa` контейнера `Icon`.                                                                                                                             |                                                                       `string`                                                                       |                                 |
| id                     | Идентификатор элемента меню.                                                                                                                                                                        |                                                                       `string`                                                                       |                                 |
| itemWrapper            | Обертка элемента меню.                                                                                                                                                                              |       [`ItemWrapper`](https://github.com/gravity-ui/navigation/blob/b8367cf343fc20304bc3c8d9a337d9f7d803a9b3/src/components/types.ts#L32-L41)        |                                 |
| href                   | HTML-атрибут `href`.                                                                                                                                                                                |                                                                       `string`                                                                       |                                 |
| onItemClick            | Обратный вызов, срабатывающий при клике по элементу. Параметр `collapsed` указывает на состояние: `false` для обычных элементов, `true` для элементов в свернутом попапе или клике на кнопку "еще". |                         `(item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void`                          |                                 |
| onItemClickCapture     | Обратный вызов, срабатывающий при клике по элементу.                                                                                                                                                |                                                       ` (event: React.SyntheticEvent) => void`                                                       |                                 |
| order                  | Определяет порядок отображения в элементе навигации.                                                                                                                                                |                                                                       `number`                                                                       |                                 |
| pinned                 | Запрещает скрытие элемента меню в `AllPagesPanel`.                                                                                                                                                  |                                                                      `boolean`                                                                       |             `false`             |
| rightAdornment         | Настраивает правую часть элемента меню.                                                                                                                                                             |                                                                  `React.ReactNode`                                                                   |                                 |
| title                  | Заголовок элемента меню.                                                                                                                                                                            |                                                                  `React.ReactNode`                                                                   |                                 |
| tooltipText            | Содержимое тултипа.                                                                                                                                                                                 |                                                                  `React.ReactNode`                                                                   |                                 |
| type                   | Тип элемента меню, определяющий его внешний вид: `"regular"`, `"action"` или `"divider"`.                                                                                                           |                                                                       `string`                                                                       |           `"regular"`           |
| qa                     | Значение, которое будет передано в атрибут `data-qa`.                                                                                                                                               |                                                                       `string`                                                                       |                                 |
| enableTooltip          | Отображать ли подсказку.                                                                                                                                                                            |                                                                `boolean \| undefined`                                                                |             `true`              |
| bringForward           | Отображать ли иконку поверх модальных окон.                                                                                                                                                         |                                                                `boolean \| undefined`                                                                |                                 |
| compact                | Флаг, отвечающий за отображение элемента меню в компактном формате.                                                                                                                                 |                                                                `boolean \| undefined`                                                                |                                 |
| ~~popupVisible~~       | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Флаг, отвечающий за отображение всплывающего окна.                                                                        |                                                                `boolean \| undefined`                                                                |             `false`             |
| ~~popupRef~~           | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Ссылка на якорный элемент для всплывающего окна.                                                                          |                                                            `React.RefObject<HTMLElement>`                                                            |                                 |
| ~~popupPlacement~~     | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Расположение всплывающего окна относительно компонента привязки.                                                          |  [`PopupProps['placement']`](https://github.com/gravity-ui/uikit/blob/7748aaeec8dc7414487f7c06c899f16b275b25ef/src/components/Popup/Popup.tsx#L69)   |                                 |
| ~~popupOffset~~        | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Смещение всплывающего окна относительно компонента привязки.                                                              |    [`PopupProps['offset']`](https://github.com/gravity-ui/uikit/blob/7748aaeec8dc7414487f7c06c899f16b275b25ef/src/components/Popup/Popup.tsx#L71)    | `{mainAxis: 8, crossAxis: -20}` |
| ~~popupKeepMounted~~   | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Всплывающее окно не будет удалено из DOM при скрытии.                                                                     |                                                                `boolean \| undefined`                                                                |             `false`             |
| ~~renderPopupContent~~ | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Функция отвечает за отрисовку контента во всплывающем окне.                                                               |                                                        `(() => React.ReactNode) \| undefined`                                                        |                                 |
| ~~onOpenChangePopup~~  | ⚠️ **Устарело**: Используйте `itemWrapper` для создания всплывающих окон. Обратный вызов для изменения состояния popupVisible, например, при отклонении.                                            | [`PopupProps['onOpenChange']`](https://github.com/gravity-ui/uikit/blob/7748aaeec8dc7414487f7c06c899f16b275b25ef/src/components/Popup/Popup.tsx#L61) |                                 |

### `TopAlert`

`Top Alert` используется для отображения важной информации, которую необходимо донести до пользователя. Такой алерт обычно отображается на всех страницах в виде призыва к действию или предупреждения.

Содержимое алерта можно настроить и при необходимости добавить функцию закрытия алерта. Высота `Top Alert` содержится в CSS-переменной `--gn-aside-top-panel-height`.

| Имя             | Описание                                                                       |                                                Тип                                                 | Значение по умолчанию |
| :-------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------: | :-------------------: |
| actions         | Массив кнопок или пользовательских компонентов.                                |  [`AlertActions`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)   |                       |
| centered        | Выравнивает все содержимое по центру.                                          |                                             `boolean`                                              |        `false`        |
| align           | Управляет вертикальным выравниванием содержимого внутри компонента `Alert`.    |      [`AlertAlign`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#align)      |     `"baseline"`      |
| closable        | Показывает кнопку закрытия и обеспечивает передачу свойства `onCloseTopAlert`. |                                             `boolean`                                              |        `false`        |
| dense           | Добавляет отступы сверху и снизу в контейнер `TopAlert`.                       |                                             `boolean`                                              |        `false`        |
| icon            | Переопределяет иконку по умолчанию.                                            |    [`AlertIcon`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)    |                       |
| message         | Содержимое сообщения алерта.                                                   | [`AlertMessage`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-message) |                       |
| onCloseTopAlert | Обратный вызов, срабатывающий при нажатии на кнопку закрытия.                  |                                            `() => void`                                            |                       |
| title           | Заголовок алерта.                                                              |   [`AlertTitle`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-title)   |                       |
| theme           | Внешний вид алерта.                                                            |      [`AlertTheme`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#theme)      |      `"warning"`      |
| view            | Включает или отключает цвет фона окна алерта.                                  |       [`AlertView`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#view)       |      `"filled"`       |

## API CSS

| Имя                                                       | Описание                                                                                          |     Значение по умолчанию      |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :----------------------------: |
| `--gn-aside-header-decoration-collapsed-background-color` | Цвет оформления элемента навигации в свернутом состоянии.                                         | `--g-color-base-warning-light` |
| `--gn-aside-header-decoration-expanded-background-color`  | Цвет оформления элемента навигации в развернутом состоянии.                                       | `--g-color-base-warning-light` |
| `--gn-aside-header-background-color`                      | Цвет основного фона элемента навигации.                                                           |  `--g-color-base-background`   |
| `--gn-aside-header-collapsed-background-color`            | Цвет фона элемента навигации в свернутом состоянии.                                               |  `--g-color-base-background`   |
| `--gn-aside-header-expanded-background-color`             | Цвет фона элемента навигации в развернутом состоянии.                                             |  `--g-color-base-background`   |
| `--gn-aside-header-divider-horizontal-color`              | Цвет всех горизонтальных разделителей.                                                            |    `--g-color-line-generic`    |
| `--gn-aside-header-divider-vertical-color`                | Цвет вертикального разделителя между `AsideHeader` и содержимым.                                  |    `--g-color-line-generic`    |
| `--gn-aside-top-panel-height`                             | Высота верхнего алерта `AsideHeader` (**только для чтения**).                                     |              0 px              |
| `--gn-aside-header-padding-top`                           | Отступ сверху для элемента навигации. Используется при скрытии элементов логотипа и подзаголовка. |                                |
| Элемент                                                   |                                                                                                   |                                |
| `--gn-aside-header-general-item-icon-color`               | Цвет иконок для элементов подзаголовка и футера.                                                  |    `--g-color-text-primary`    |
| `--gn-aside-header-item-icon-color`                       | Цвет иконок для элементов `CompositeBar`.                                                         |     `--g-color-text-misc`      |
| `--gn-aside-header-item-text-color`                       | Цвет текста элементов.                                                                            |    `--g-color-text-primary`    |
| `--gn-aside-header-item-background-color-hover`           | Цвет текста при ховере.                                                                           | `--g-color-base-simple-hover`  |
| Выбранный элемент                                         |                                                                                                   |                                |
| `--gn-aside-header-item-current-background-color`         | Цвет фона выбранного элемента.                                                                    |   `--g-color-base-selection`   |
| `--gn-aside-header-item-current-icon-color`               | Цвет иконки выбранного элемента.                                                                  |                                |
| `--gn-aside-header-item-current-text-color`               | Цвет текста выбранного элемента.                                                                  |    `--g-color-text-primary`    |
| `--gn-aside-header-item-current-background-color-hover`   | Цвет иконки выбранного элемента при ховере.                                                       |                                |
| `--gn-aside-header-item-collapsed-radius`                 | Радиус скругления углов элемента навигации в свернутом состоянии.                                 |              7 px              |
| `--gn-aside-header-item-expanded-radius`                  | Радиус скругления углов элемента навигации в развернутом состоянии.                               |                                |
| Наложение элементов (CSS-свойство `z-index`)              |                                                                                                   |                                |
| `--gn-aside-header-z-index`                               | `z-index` для `AsideHeader`.                                                                      |              100               |
| `--gn-aside-header-panel-z-index`                         | `z-index` для выдвижной панели `AsideHeader` (компонент `Drawer`).                                |               98               |
| `--gn-aside-header-pane-top-z-index`                      | `z-index` для верхней панели.                                                                     |               98               |
| `--gn-aside-header-content-z-index`                       | `z-index` для содержимого (область справа).                                                       |               95               |
