<!--GITHUB_BLOCK-->

# AsideHeader

<!--/GITHUB_BLOCK-->

`AsideHeader` is provided a flexible and customizable navigation experience within your application.
Users can easily customize the appearance of the sidebar to match their branding colors also to add personalized links, icons that cater specifically to their application's functionality.

The component offers a robust solution for creating intuitive and visually appealing navigation systems, enhancing user experience while providing the flexibility to adapt to various use cases.

```ts
import {AsideHeader} from '@gravity-ui/navigation';
```

<!--GITHUB_BLOCK-->

## Appearance

<!--/GITHUB_BLOCK-->

### State

The component has two possible states: collapsed, expanded.
Уou can manage between states using `compact`, `onChangeCompact` props and also hide button with `hideCollapseButton`.

### Top decoration

Navigation highlights top section with Logo and Subheader items using `headerDecoration` props.

### Custom background

The component supports specific themization cases, e.g. image on background or splitting sections by color — using `customBackground`, `customBackgroundClassName` props.

## Sections

Navigation includes 3 parts: the top, the middle and the bottom. These sections are similar with a few variations of possibilities based on frequency user cases.
**Important note**: A user manages the state of the elements.

### The Top

The section usually contains general elements for all site pages and includes the logo and the elements below it. Clickable logo can be useful for a quick navigation to the home page, if necessary the element (e.g. search, catalogue) is placed under it.

The elements have access to tooltip, popup, drawers, it is enough to select the desired behavior when configuring this section.

### The Middle (menuItems)

The main section usually depends on context of the page — one of examples using navigation on the multipage sites.
The elements will collapse into three dots if there is no vertical space by default.

Navigation elements can be in one of two states: collapsed (isCollapsed), where only the icon is visible, and expanded. There is some space for customization of the entire item through a wrapper.

With additional configuration via `AllPages` users can further customize menu to their preference by hiding unnecessary items. This brings in a new state for items - pinned/hidden. If item is pinned, it will always be displayed in the section.

The `onMenuItemsChanged` callback is required for adding extra component `All Pages` which displays panel for editing the list of visible menu items.

**Important note**: A user manages a modified list of the menu items that they receive from the callback and provides the new state of items to `AsideHeader`.

### The Bottom

The Footer improves user experience by offering easy access to the elements and supplementary resources. It gives opportunity to connect with support add custom information to be sure that user will not get lost.

There can be both their own components inside, or also you can use `FooterItem`.

#### Highlighting element

Highlighting an element over modal windows can be useful when a user wants to report an error via a feedback form, and the form with bug is opened in a modal window.

In the `FooterItem` component, you can pass a `bringForward` prop, which renders the icon above modal windows. Additionally, you need to pass a function to `AsideHeader` that will notify about the opening of modal windows.

## Rendering Content

Right part near to AsideHeader is place for main page content.
When expanding and collapsing navigation, navigation `size` will be changed. This knowledge may be helpful, e.g. recalculating layout in some components.
CSS-variable `--gn-aside-header-size` contains actual navigation size.

See below about alternative path of rendering content.

### Rendering optimization

If your app content needs to be rendered faster than by passing it throw `AsideHeader` props,
you may need to switch usage of `AsideHeader` to advanced style with `PageLayout`.

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

## Properties

| Name                      | Description                                                                          |                                                       Type                                                       |          Default          |
| :------------------------ | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------: | :-----------------------: |
| className                 | HTML `class` attribute of the Logo                                                   |                                                     `string`                                                     |                           |
| collapseTitle             | `CollapseButton` title for collapsing navigation                                     |                                                     `string`                                                     | `"Свернуть"` `"Collapse"` |
| compact                   | Navigation visual state                                                              |                                                    `boolean`                                                     |          `false`          |
| customBackground          | `AsideHeader` background                                                             |                                                `React.ReactNode`                                                 |                           |
| customBackgroundClassName | Override default background container's styles                                       |                                                     `string`                                                     |                           |
| expandTitle               | `CollapseButton` title for expanding navigation                                      |                                                     `string`                                                     | `"Развернуть"` `"Expand"` |
| headerDecoration          | Color background of the top section with logo and subheader items                    |                                                    `boolean`                                                     |          `false`          |
| hideCollapseButton        | Hiding `CollapseButton`. Use `compact` prop for setting default navigation state     |                                                    `boolean`                                                     |          `false`          |
| logo                      | Logo container includes icon, title, handling clicks                                 |         [`Logo`](https://github.com/gravity-ui/navigation/blob/main/src/components/Logo/Readme.md#logo)          |                           |
| menuItems                 | Items in the navigation middle section                                               |                                                `Array<MenuItem>`                                                 |           `[]`            |
| menuMoreTitle             | Additional element title of menuItems if elements don't fit                          |                                                     `string`                                                     |     `"Ещё"` `"More"`      |
| multipleTooltip           | Show the multiple tooltip by hovering elements of menuItems in collapsed state       |                                                    `boolean`                                                     |          `false`          |
| onChangeCompact           | Callback will be called when changing navigation visual state                        |                                          `(compact: boolean) => void;`                                           |                           |
| onClosePanel              | Callback will be called when closing panel. You can add panels via `PanelItems` prop |                                                  `() => void;`                                                   |                           |
| onMenuItemsChanged        | Callback will be called when updating list of the menuItems in `AllPagesPanel`       |                                        `(items: Array<MenuItem>) => void`                                        |                           |
| onMenuMoreClick           | Callback will be called when some items don't fit and "more" button is clicked       |                                                  `() => void;`                                                   |                           |
| onAllPagesClick           | Callback will be called when "All pages" button is clicked                           |                                                  `() => void;`                                                   |                           |
| openModalSubscriber       | Function notifies `AsideHeader` about Modals visibility changes                      |                                       `( (open: boolean) => void) => void`                                       |                           |
| panelItems                | Items for `Drawer` component. Used for show additional information over main content | [`Array<DrawerItem>`](https://github.com/gravity-ui/navigation/tree/main/src/components/Drawer#draweritem-props) |           `[]`            |
| renderContent             | Function rendering the main content at the right of the `AsideHeader`                |                                   `(data: {size: number}) => React.ReactNode`                                    |                           |
| renderFooter              | Function rendering the navigation bottom section                                     |                                   `(data: {size: number}) => React.ReactNode`                                    |                           |
| ref                       | `ref` to target popup anchor                                                         |                              `React.ForwardedRef<HTMLDivElement, AsideHeaderProps>`                              |                           |
| subheaderItems            | Items in the navigation top section under Logo                                       |                    `Array<{item: MenuItem; enableTooltip?: boolean; bringForward?: boolean}>`                    |           `[]`            |
| topAlert                  | The container above the navigation based on the uikit `Alert` component              |                                                    `TopAlert`                                                    |                           |
| qa                        | The value to be passed to `data-qa` attribute of the `AsideHeader` container         |                                                     `string`                                                     |                           |

### `MenuItem`

| Name               | Description                                                                                             |                                                                  Type                                                                   |           Default           |
| :----------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------: |
| afterMoreButton    | The menu item will be placed in the end, even item don't fit                                            |                                                                `boolean`                                                                |                             |
| category           | The category to which the menu item belongs. Need for grouping in the display/editing mode of all pages |                                                                `string`                                                                 | `"Остальное"` `"All other"` |
| current            | The current/selected item                                                                               |                                                                `boolean`                                                                |           `false`           |
| hidden             | Visibility item in the menu                                                                             |                                                                `boolean`                                                                |           `false`           |
| icon               | Menu icon based on the uikit `Icon` component                                                           |                   [`IconProps['data']`](https://github.com/gravity-ui/uikit/tree/main/src/components/Icon#properties)                   |                             |
| iconSize           | Menu icon size                                                                                          |                                                            `number` `string`                                                            |            `18`             |
| iconQa             | The value to be passed to `data-qa` attribute of the `Icon` container                                   |                                                                `string`                                                                 |                             |
| id                 | The menu item id                                                                                        |                                                                `string`                                                                 |                             |
| itemWrapper        | The menu item wrapper                                                                                   | [`ItemWrapper`](https://github.com/gravity-ui/navigation/blob/b8367cf343fc20304bc3c8d9a337d9f7d803a9b3/src/components/types.ts#L32-L41) |                             |
| link               | HTML href attribute                                                                                     |                                                                `string`                                                                 |                             |
| onItemClick        | Callback will be called when clicking on the item                                                       |                   `(item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void`                   |                             |
| onItemClickCapture | Callback will be called when clicking on the item                                                       |                                                ` (event: React.SyntheticEvent) => void`                                                 |                             |
| order              | Determine the display order in the navigation                                                           |                                                                `number`                                                                 |                             |
| pinned             | The parameter restricts hiding menu item in the `AllPagesPanel`                                         |                                                                `boolean`                                                                |           `false`           |
| rightAdornment     | Customize right side of the menu item                                                                   |                                                            `React.ReactNode`                                                            |                             |
| title              | The menu item title                                                                                     |                                                            `React.ReactNode`                                                            |                             |
| tooltipText        | Tooltip content                                                                                         |                                                            `React.ReactNode`                                                            |                             |
| type               | The menu item type changes appearance: `"regular"`, `"action"`, `"divider"`                             |                                                                `string`                                                                 |         `"regular"`         |
| qa                 | The value to be passed to `data-qa` attribute                                                           |                                                                `string`                                                                 |                             |

### `TopAlert`

Top Alert can be useful for displaying important information that users need to know. This alert is often appeared in all pages like call to action or warning.

You can customize the inner content, make alert closeable if necessary. For reading top alert height see value from CSS variable `--gn-top-alert-height`.

| Name            | Description                                                             |                                                Type                                                |   Default    |
| :-------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------: | :----------: |
| actions         | Array of buttons or full custom components                              |  [`AlertActions`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)   |              |
| centered        | Centering all content                                                   |                                             `boolean`                                              |   `false`    |
| align           | Determines how content inside the Alert component is vertically aligned |      [`AlertAlign`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#align)      | `"baseline"` |
| closable        | Show close button and make possible to pass `onCloseTopAlert` prop      |                                             `boolean`                                              |   `false`    |
| dense           | Add top, bottom paddings to `TopAlert` container                        |                                             `boolean`                                              |   `false`    |
| icon            | Override default icon                                                   |    [`AlertIcon`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)    |              |
| message         | Message of the alert                                                    | [`AlertMessage`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-message) |              |
| onCloseTopAlert | Callback will be called when clicking on the close button               |                                            `() => void`                                            |              |
| title           | Title of the alert                                                      |   [`AlertTitle`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-title)   |              |
| theme           | Alert appearance                                                        |      [`AlertTheme`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#theme)      | `"warning"`  |
| view            | Enable/disable background color of the alert                            |       [`AlertView`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#view)       |  `"filled"`  |

## CSS API

| Name                                                      | Description                                                               |
| :-------------------------------------------------------- | :------------------------------------------------------------------------ |
| `--gn-aside-header-decoration-collapsed-background-color` | Decoration color for collapsed navigation                                 |
| `--gn-aside-header-decoration-expanded-background-color`  | Decoration color for expanded navigation                                  |
| `--gn-aside-header-background-color`                      | Navigation background color                                               |
| `--gn-aside-header-collapsed-background-color`            | Collapsed navigation background color                                     |
| `--gn-aside-header-expanded-background-color`             | Expanded navigation background color                                      |
| `--gn-aside-header-divider-horizontal-color`              | All horizontal divider line color                                         |
| `--gn-aside-header-divider-vertical-color`                | Vertical divider line color between `AsideHeader` and content             |
| `--gn-top-alert-height`                                   | **Read only**.`AsideHeader` top alert height                              |
| `--gn-aside-header-padding-top`                           | Navigation top padding. May be helpful when logo and subheader items hide |
| Item                                                      |                                                                           |
| `--gn-aside-header-general-item-icon-color`               | Icon color for Subheader and Footer items                                 |
| `--gn-aside-header-item-icon-color`                       | Icon color for CompositeBar items                                         |
| `--gn-aside-header-item-text-color`                       | Text item color                                                           |
| `--gn-aside-header-item-background-color-hover`           | Text color on hover                                                       |
| Current Item                                              |                                                                           |
| `--gn-aside-header-item-current-background-color`         | Current item's background color                                           |
| `--gn-aside-header-item-current-icon-color`               | Current item's icon color                                                 |
| `--gn-aside-header-item-current-text-color`               | Current item's text color                                                 |
| `--gn-aside-header-item-current-background-color-hover`   | Current item's icon color on hover                                        |
| `--gn-aside-header-item-collapsed-radius`                 | Item border radius for collapsed navigation                               |
| `--gn-aside-header-item-expanded-radius`                  | Item border radius for expanded navigation                                |
| z-indexes                                                 |                                                                           |
| `--gn-aside-header-z-index`                               | Aside header z-index                                                      |
| `--gn-aside-header-panel-z-index`                         | Aside header panel (Drawer component) z-index                             |
| `--gn-aside-header-pane-top-z-index`                      | Top pane z-index                                                          |
| `--gn-aside-header-content-z-index`                       | Content (right part) z-index                                              |
