# AsideHeader

Including additional components like `FooterItem`, `Drawer`.

## Imports

```ts
import {AsideHeader} from '@gravity-ui/navigation';
```

## Rendering Content

`WIP`

## Rendering Footer

`WIP`

## Rendering optimization

If your app content needs to be rendered faster than by passing it throw `AsideHeader` props,
you may need to switch usage of `AsideHeader` to advanced style with `PageLayout` like this:

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

## Properties

| Name                      | Description                                                                          |                             Type                              |         Default         |
| :------------------------ | :----------------------------------------------------------------------------------- | :-----------------------------------------------------------: | :---------------------: |
| className                 | HTML `class` attribute of the Logo                                                   |                           `string`                            |                         |
| collapseTitle             | `CollapseButton` title for collapsing navigation                                     |                           `string`                            | `"Свернуть" "Collapse"` |
| compact                   | Navigation visual state                                                              |                           `boolean`                           |         `false`         |
| customBackground          | `AsideHeader` background                                                             |                       `React.ReactNode`                       |                         |
| customBackgroundClassName | Override default background container's styles                                       |                           `string`                            |                         |
| expandTitle               | `CollapseButton` title for expanding navigation                                      |                           `string`                            | `"Развернуть" "Expand"` |
| headerDecoration          | Color background of the top section with logo and subheader items                    |                           `boolean`                           |                         |
| hideCollapseButton        | Hiding `CollapseButton`. Use `compact` prop for setting default navigation state     |                           `boolean`                           |         `false`         |
| logo                      | Logo container includes icon, title, handling clicks                                 |              [`Logo`](./../Logo/Readme.md#logo)               |                         |
| menuItems                 | Items in the navigation middle section                                               |                       `Array<MenuItem>`                       |          `[]`           |
| menuMoreTitle             | Additional element title of menuItems if elements don't fit                          |                           `string`                            |     `"Ещё" "More"`      |
| multipleTooltip           | Show multiple tooltip by hovering elements of menuItems                              |                           `boolean`                           |         `false`         |
| onChangeCompact           | Callback will be called when changing navigation visual state                        |                 `(compact: boolean) => void;`                 |                         |
| onClosePanel              | Callback will be called when closing panel. You can add panels via `panelItems` prop |                         `() => void;`                         |                         |
| onMenuItemsChanged        | Callback will be called when updating list of the menuItems in AllPagesPanel         |              `(items: Array<MenuItem>) => void`               |                         |
| openModalSubscriber       | Function notifies `AsideHeader` about Modals visibility changes. (Example wip)       |             `( (open: boolean) => void) => void`              |                         |
| panelItems                | Items for `Drawer` component. Used for show additional information over main content | Array<[`DrawerItem`](./../Drawer/README.md#draweritem-props)> |          `[]`           |
| renderContent             | Function rendering main content at right of the `AsideHeader`                        |          `(data: {size: number}) => React.ReactNode`          |                         |
| renderFooter              | Function rendering navigation bottom section                                         |          `(data: {size: number}) => React.ReactNode`          |                         |
| ref                       | `ref` to target popup anchor                                                         |    `React.ForwardedRef<HTMLDivElement, AsideHeaderProps>`     |                         |
| subheaderItems            | Items in the navigation top section under Logo                                       |                    `Array<SubheaderItem>`                     |          `[]`           |
| topAlert                  | Container above the navigation based on uikit `Alert` component                      |                          `TopAlert`                           |                         |
| qa                        | The value to be passed to `data-qa` attribute of the `AsideHeader` container         |                           `string`                            |                         |

### `MenuItem`

`WIP`

### `SubheaderItem`

`WIP`

### `TopAlert`

`WIP`

| Name            | Description |                                                Type                                                | Default |
| :-------------- | :---------- | :------------------------------------------------------------------------------------------------: | :-----: |
| actions         |             |  [`AlertActions`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)   |         |
| centered        |             |                                             `boolean`                                              |         |
| closable        |             |                                             `boolean`                                              |         |
| dense           |             |                                             `boolean`                                              |         |
| icon            |             |    [`AlertIcon`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#properties)    |         |
| message         |             | [`AlertMessage`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-message) |         |
| onCloseTopAlert |             |                                            `() => void`                                            |         |
| title           |             |   [`AlertTitle`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#alert-title)   |         |
| theme           |             |      [`AlertTheme`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#theme)      |         |
| view            |             |       [`AlertView`](https://github.com/gravity-ui/uikit/tree/main/src/components/Alert#view)       |         |

## CSS API

| Name                                                      | Description                                                   |            Default             |
| :-------------------------------------------------------- | :------------------------------------------------------------ | :----------------------------: |
| `--gn-aside-header-decoration-collapsed-background-color` | Decoration color for collapsed navigation                     | `--g-color-base-warning-light` |
| `--gn-aside-header-decoration-expanded-background-color`  | Decoration color for expanded navigation                      | `--g-color-base-warning-light` |
| `--gn-aside-header-background-color`                      | Navigation background color                                   |  `--g-color-base-background`   |
| `--gn-aside-header-divider-horizontal-color`              | All horizontal divider line color                             |    `--g-color-line-generic`    |
| `--gn-aside-header-divider-vertical-color`                | Vertical divider line color between `AsideHeader` and content |    `--g-color-line-generic`    |
| `--gn-aside-top-panel-height`                             | **Read only**.`AsideHeader` top alert height                  |              0px               |
| Item                                                      |                                                               |                                |
| `--gn-aside-header-general-item-icon-color`               | Icon color for Subheader and Footer items                     |    `--g-color-text-primary`    |
| `--gn-aside-header-item-icon-color`                       | Icon color for CompositeBar items                             |     `--g-color-text-misc`      |
| `--gn-aside-header-item-text-color`                       |                                                               |    `--g-color-text-primary`    |
| `--gn-aside-header-item-background-color-hover`           |                                                               | `--g-color-base-simple-hover`  |
| Current Item                                              |                                                               |                                |
| `--gn-aside-header-item-current-background-color`         |                                                               |   `--g-color-base-selection`   |
| `--gn-aside-header-item-current-icon-color`               |                                                               |                                |
| `--gn-aside-header-item-current-text-color`               |                                                               |    `--g-color-text-primary`    |
| `--gn-aside-header-item-current-background-color-hover`   |                                                               |                                |
| z-indexes                                                 |                                                               |                                |
| `--gn-aside-header-z-index`                               | Aside header z-index                                          |              100               |
| `--gn-aside-header-panel-z-index`                         | Aside header panel (Drawer component) z-index                 |               98               |
| `--gn-aside-header-pane-top-z-index`                      | Top pane z-index                                              |               98               |
| `--gn-aside-header-content-z-index`                       | Content (right part) z-index                                  |               95               |
