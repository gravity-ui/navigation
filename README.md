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

| Name                                          | Description                                                      |            Default             |
| :-------------------------------------------- | :--------------------------------------------------------------- | :----------------------------: |
| `--gn-color-accent-collapsed`                 | Decoration color for collapsed navigation                        | `--g-color-base-warning-light` |
| `--gn-color-accent-expanded`                  | Decoration color for expanded navigation                         | `--g-color-base-warning-light` |
| `--gn-color-background`                       | Navigation background color                                      |  `--g-color-base-background`   |
| `--gn-color-line-horizontal`                  | Divider line color for withDecoration and expanded `AsideHeader` |    `--g-color-line-generic`    |
| `--gn-color-line-vertical`                    | Vertical color divider between `AsideHeader` and content         |    `--g-color-line-generic`    |
| `--gn-color-item-background-hover`            |                                                                  | `--g-color-base-simple-hover`  |
| `--gn-color-item-background-selected`         |                                                                  |   `--g-color-base-selection`   |
| `--gn-color-item-icon-general`                |                                                                  |    `--g-color-text-primary`    |
| `--gn-color-item-icon`                        |                                                                  |     `--g-color-text-misc`      |
| `--gn-color-item-text`                        |                                                                  |    `--g-color-text-primary`    |
| `--gn-aside-header-item-icon-background-size` | Background size used when `AsideHeader` is compact               |             `38px`             |
