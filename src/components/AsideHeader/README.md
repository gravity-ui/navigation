# AsideHeader

Including additional components like `FooterItem`, `Drawer`.

## Imports

```ts
import {AsideHeader} from '@gravity-ui/navigation';
```

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

| Name                      | Description                                    |                                           Type                                           | Default |
| :------------------------ | :--------------------------------------------- | :--------------------------------------------------------------------------------------: | :-----: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ref                       | `ref` to target popup anchor                   |                  `React.ForwardedRef<HTMLDivElement, AsideHeaderProps>`                  |         |
| logo                      |                                                | [Logo](https://github.com/gravity-ui/navigation/blob/main/src/components/Logo/Readme.md) |         |
| customBackground          | `AsideHeader`` background                      |                                    `React.ReactNode`                                     |         |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| customBackgroundClassName | Override default background container's styles |                                         `string`                                         |         |

### CSS API

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
