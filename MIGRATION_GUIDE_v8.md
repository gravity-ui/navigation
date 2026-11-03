# Navigation v8 Migration Guide

This guide covers upgrading `@gravity-ui/navigation` from **7.x** to **8.x**. The props API of
navigation is the same as in 7.x: the major version is required by the move to
`@gravity-ui/uikit` 8. Most of the work is the uikit migration itself, described in the
[uikit Migration to v8](https://github.com/gravity-ui/uikit/blob/main/docs/migration-to-v8.md)
guide. This guide lists only what changes in navigation and around it.

Coming from 4.x, 5.x or 6.x: first follow [MIGRATION_GUIDE_v7.md](MIGRATION_GUIDE_v7.md), then
this guide.

- [1. Migration procedure (checklist)](#1-migration-procedure-checklist)
- [2. Dependencies](#2-dependencies)
- [3. TypeScript `moduleResolution`](#3-typescript-moduleresolution)
- [4. CSS classes and test selectors](#4-css-classes-and-test-selectors)
- [5. Behavior changes to re-verify](#5-behavior-changes-to-re-verify)
- [6. Visual changes](#6-visual-changes)
- [7. Verification](#7-verification)

---

## 1. Migration procedure (checklist)

1. **Record the baseline.** Run `typecheck`, `lint` and unit tests on the current revision.
2. **Upgrade React and React DOM to 18 or 19** if you are on 16 or 17.
3. **Upgrade `@gravity-ui/uikit` and `@gravity-ui/navigation` together** (section 2): navigation
   7.x does not work with uikit 8, and navigation 8 does not work with uikit 7. Apply the uikit
   guide to your own code.
4. **Check `moduleResolution`** in your `tsconfig.json` (section 3).
5. **Update styles and selectors** that target uikit classes inside navigation (section 4).
6. **Re-verify behavior** listed in section 5.
7. **Run verification** (section 7) and review the screenshots that changed (section 6).

---

## 2. Dependencies

```bash
npm install @gravity-ui/navigation@^8 @gravity-ui/uikit@^8
```

Peer dependencies of 8.x:

| Peer                   | Required range         | Notes                                   |
| :--------------------- | :--------------------- | :-------------------------------------- |
| `@gravity-ui/uikit`    | `^8.0.0`               | Raised from `^7.42.0`                   |
| `@gravity-ui/icons`    | `^2.2.0`               | unchanged                               |
| `@bem-react/classname` | `^1.6.0`               | unchanged                               |
| `react`, `react-dom`   | `^18.0.0 \|\| ^19.0.0` | React 16 and 17 are no longer supported |

Other dependency notes:

- Navigation renders the legacy `List`, `Menu` and `DropdownMenu` from `@gravity-ui/uikit/legacy`.
  That entry point needs `@hello-pangea/dnd`, `react-window` and `react-virtualized-auto-sizer`,
  which are optional peers of uikit 8. Navigation lists them in its own `dependencies`, so you do
  not have to install them for navigation. If your package manager does not hoist dependencies
  (for example, Yarn PnP) and the build reports one of these modules as missing, add it to your
  project dependencies.
- If a library in your dependency tree also depends on `@gravity-ui/navigation` or
  `@gravity-ui/uikit`, bump it as well, so that the lockfile resolves to a single 8.x copy of
  each package.
- A wrapper library must raise its own `peerDependencies` (and devDependencies) to
  `@gravity-ui/uikit@^8.0.0` and `react@^18.0.0 || ^19.0.0`.

---

## 3. TypeScript `moduleResolution`

The public types of navigation 8 import `@gravity-ui/uikit/legacy`:

- `FooterMenuItem` (the `menuItems` of `Footer` and `MobileFooter`) extends the legacy `MenuItemProps`;
- `HotkeysPanelProps` extends the legacy `ListProps`.

uikit exposes this entry point only through the `exports` field of its `package.json`, and
`"moduleResolution": "node"` (`node10`, the value in `@gravity-ui/tsconfig`) ignores `exports`. With
such a config, TypeScript cannot resolve the import inside the navigation declarations. With
`skipLibCheck: false` it reports TS2307. With `skipLibCheck: true` it reports nothing, and these
types silently become `any`.

Use `"moduleResolution": "bundler"` (with `"module": "esnext"` or `"preserve"`), `"node16"` or
`"nodenext"`. The same setting is required to import `@gravity-ui/uikit/legacy` in your own code.

---

## 4. CSS classes and test selectors

The CSS blocks of the uikit legacy components are renamed in uikit 8. The `g-list` and `g-menu`
blocks now belong to the new `List` and `Menu`, so old selectors still parse but no longer match
anything inside navigation:

| Where in navigation                                                                                                | 7.x class                               | 8.x class                                             |
| :----------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :---------------------------------------------------- |
| `AsideHeader` menu rows, group and "More" popups, All pages panel, `HotkeysPanel` list, `MobileHeader` burger menu | `g-list`, `g-list__item`, …             | `g-list-legacy`, `g-list-legacy__item`, …             |
| `Footer` and `MobileFooter` menu                                                                                   | `g-menu`, `g-menu__item`, …             | `g-menu-legacy`, `g-menu-legacy__item`, …             |
| `Footer` "More" button menu                                                                                        | `g-dropdown-menu`, `g-dropdown-menu__*` | `g-dropdown-menu-legacy`, `g-dropdown-menu-legacy__*` |

Find usages in SCSS overrides, Playwright/Testing Library selectors, screenshot masks and
`querySelector` calls (the `-legacy` classes are not matched):

```bash
grep -rnE "g-(list|menu|dropdown-menu)(__|_[a-z]|[^a-z_-]|$)" src
```

Prefer the `gn-*` classes and `qa` attributes of navigation over uikit classes where possible.

---

## 5. Behavior changes to re-verify

1. **`ModalItem`** (`MobileHeader` `burgerMenu.modalItem` and `MobileHeaderFooterItem`
   `modalItem`). The sheet is now controlled by `visible`. It closes only when you set
   `visible: false`, so `onClose` must do that (in 7.x the sheet also closed by itself). `onClose`
   is called when the user dismisses the sheet (swipe, tap outside, Escape), at the start of the
   closing animation. It is not called after the animation and not called when you close the sheet
   yourself.
2. **`HotkeysPanel` with `drawerProps={{hideVeil: true}}`.** Since uikit 7.48.1, `hideVeil` no longer
   disables closing on outside click: the panel closes on any click outside it. To keep it open,
   also pass `disableOutsideClick: true` in `drawerProps`.
3. **`topAlert`.** The uikit 8 `Alert` aligns the icon, text and close button by baseline, so a
   closable `TopAlert` is 4px taller and the icon is 1px higher. `--gn-top-alert-height` follows the
   real height. It is now also updated when the alert changes height after mount (for example,
   when its font loads), not only on mount and window resize. Check layouts that hardcode the
   alert height. `centered` keeps working.
4. **`ActionBar` with `Breadcrumbs`.** The legacy `Breadcrumbs` are removed in uikit 8. Migrate
   them with the uikit
   [Breadcrumbs migration guide](https://github.com/gravity-ui/uikit/blob/main/docs/migration-from-legacy-breadcrumbs.md).
   The new `Breadcrumbs` collapse to the available width. Inside `ActionBar`, keep
   `stretchContainer` on their `ActionBar.Group`: the item with the breadcrumbs then takes the free
   space of the group, and the breadcrumbs collapse when the bar narrows. In a group without
   `stretchContainer` they keep their full width. If even the collapsed breadcrumbs do not fit, the
   bar overflows instead of overlapping other items. Collapsing needs a bar as wide as its
   container: in a bar sized to its content (for example, inside `display: inline-block`),
   breadcrumbs that collapsed in a narrow window stay collapsed after it widens. `maxItems`
   collapses items even when they fit; set it only for a hard limit.

---

## 6. Visual changes

Expect these differences in screenshots and review them:

- `TopAlert` with a close button: 4px taller, the content below moves down (section 5).
- `Breadcrumbs`: new design (item color and weight, separator spacing).
- Quick access pin in compact group popups: 14px icon instead of 16px.
- Colors shift slightly because uikit 8 generates theme variables with `@gravity-ui/uikit-themer`.
  The variables are written as `rgb(r g b)` while `getComputedStyle` returns `rgb(r, g, b)`: do not
  compare the raw variable string with a computed color in tests.

---

## 7. Verification

```bash
npm ls @gravity-ui/navigation @gravity-ui/uikit   # exactly one 8.x copy of each
npm run typecheck
npm run lint
npm test
# visual regression: regenerate the screenshots listed in section 6 and review them
```

Done criteria:

- `typecheck` and `lint` pass with `moduleResolution` from section 3; unit tests pass.
- The `grep` from section 4 has no hits that target navigation markup.
- Section 5 items are re-checked in the app or in Storybook.
- Updated screenshots are reviewed by a human.
