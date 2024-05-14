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
- Logo
- MobileLogo
- Footer
- MobileFooter

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

## CSS API AsideHeader

Used for themization Navigation's components

| Name                                                      | Description                                                   |
| :-------------------------------------------------------- | :------------------------------------------------------------ |
| `--gn-aside-header-decoration-collapsed-background-color` | Decoration color for collapsed navigation                     |
| `--gn-aside-header-decoration-expanded-background-color`  | Decoration color for expanded navigation                      |
| `--gn-aside-header-background-color`                      | Navigation background color                                   |
| `--gn-aside-header-divider-horizontal-color`              | All horizontal divider line color                             |
| `--gn-aside-header-divider-vertical-color`                | Vertical divider line color between `AsideHeader` and content |
| `--gn-aside-top-panel-height`                             | **Read only**.`AsideHeader` top alert height                  |
| Item                                                      |
| `--gn-aside-header-general-item-icon-color`               | Icon color for Subheader and Footer items                     |
| `--gn-aside-header-item-icon-color`                       | Icon color for CompositeBar items                             |
| `--gn-aside-header-item-text-color`                       |                                                               |
| `--gn-aside-header-item-background-color-hover`           |                                                               |
| Current Item                                              |
| `--gn-aside-header-item-current-background-color`         |                                                               |
| `--gn-aside-header-item-current-icon-color`               |                                                               |
| `--gn-aside-header-item-current-text-color`               |                                                               |
| `--gn-aside-header-item-current-background-color-hover`   |                                                               |
