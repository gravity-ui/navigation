# @gravity-ui/navigation &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/navigation)](https://www.npmjs.com/package/@gravity-ui/navigation) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/navigation/.github/workflows/ci.yml?branch=main&label=CI&logo=github)](https://github.com/gravity-ui/navigation/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.yandexcloud.dev/navigation/)

### Aside Header Navigation &middot; [Preview →](https://preview.yandexcloud.dev/navigation/)

![](docs/images/showcase.png)

## Install

```bash
npm install @gravity-ui/navigation
```

Ensure that peer dependencies are installed in your project

```bash
npm install --dev @gravity-ui/uikit@^3.0.2 @bem-react/classname@1.6.0 react@^16.0.0
```

## Components

- AsideHeader
- MobileHeader
- FooterItem
- MobileHeaderFooterItem
- Drawer
- DrawerItem
- PageLayout
- PageLayoutAside
- AsideFallback

## Optimization

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

## Imports

```ts
import {AsideHeader} from '@gravity-ui/navigation';
```

## CSS variables

Used for themization Navigation's components

### AsideHeader vars

| Name                                                      | Description                                                   |            Default             |
| :-------------------------------------------------------- | :------------------------------------------------------------ | :----------------------------: |
| `--gn-aside-header-decoration-collapsed-background-color` | Decoration color for collapsed navigation                     | `--g-color-base-warning-light` |
| `--gn-aside-header-decoration-expanded-background-color`  | Decoration color for expanded navigation                      | `--g-color-base-warning-light` |
| `--gn-aside-header-background-color`                      | Navigation background color                                   |  `--g-color-base-background`   |
| `--gn-aside-header-divider-horizontal-color`              | All horizontal divider line color                             |    `--g-color-line-generic`    |
| `--gn-aside-header-divider-vertical-color`                | Vertical divider line color between `AsideHeader` and content |    `--g-color-line-generic`    |
| `--gn-aside-header-item-background-color-hover`           |                                                               | `--g-color-base-simple-hover`  |
| `--gn-aside-header-item-current-background-color`         |                                                               |   `--g-color-base-selection`   |
| `--gn-aside-header-general-item-icon-color`               | Icon color for Subheader and Footer items                     |    `--g-color-text-primary`    |
| `--gn-aside-header-item-icon-color`                       | Icon color for CompositeBar items                             |     `--g-color-text-misc`      |
| `--gn-aside-header-item-text-color`                       |                                                               |    `--g-color-text-primary`    |
