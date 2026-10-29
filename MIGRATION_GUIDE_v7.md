# Navigation v7 Migration Guide

This guide covers upgrading `@gravity-ui/navigation` to **7.x** from **4.x**, **5.x** (both
published 5.x releases) and **6.x**. It is written as a step-by-step instruction that an engineer
or an AI agent can follow verbatim. Every breaking change lists the old API, the new API and how
to find usages.

- [0. Which version are you on?](#0-which-version-are-you-on)
- [1. Migration procedure (checklist)](#1-migration-procedure-checklist)
- [2. Dependencies](#2-dependencies)
- [3. Migrating from 5.0.0 (the `pinned` API)](#3-migrating-from-500-the-pinned-api)
- [4. Migrating from 5.0.1 or 4.x to 6.x API](#4-migrating-from-501-or-4x-to-6x-api)
- [5. Migrating from 6.x to 7](#5-migrating-from-6x-to-7)
- [6. DOM, CSS classes and test selectors](#6-dom-css-classes-and-test-selectors)
- [7. CSS variables](#7-css-variables)
- [8. Behavior changes to re-verify](#8-behavior-changes-to-re-verify)
- [9. Wrapper libraries](#9-wrapper-libraries)
- [10. Verification](#10-verification)
- [Appendix A. New optional APIs in 6.x–7.x](#appendix-a-new-optional-apis-in-6x7x)

---

## 0. Which version are you on?

The two published 5.x releases have **different APIs**:

| Version   | Published  | Branch lineage                                                      | API                                                                                     |
| :-------- | :--------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| **5.0.0** | 2026-02-27 | `feat!: release v5` (#581) + its release commit, directly on 4.0.11 | `pinned` / `onChangePinned` / `isExpanded`, hover-to-expand, `FooterBar`, zone CSS vars |
| **5.0.1** | 2026-06-15 | 4.x line (after 4.0.17), tagged `stable-v5`                         | Same as 4.0.17: `compact` / `onChangeCompact`, `multipleTooltip` still present          |
| **6.x**   | 2026-06-10 | 5.0.0 lineage, but restores the 4.x state API                       | `compact` / `onChangeCompact`, `multipleTooltip` removed, menu groups, `menuOverflow`   |
| **7.x**   | 2026-09-23 | 6.x                                                                 | Same props API as 6.x; new collapse button, auto two-line titles, density, quick access |

Detect the installed variant:

```bash
# installed version
node -p "require('@gravity-ui/navigation/package.json').version"

# 5.0.0 ("pinned" API) exposes these names in its type definitions; 5.0.1/4.x/6.x/7.x do not
grep -rlE "onChangePinned|useAsideHeaderContextOptional|FooterLayoutContext" node_modules/@gravity-ui/navigation/build/esm/components/AsideHeader/ && echo "5.0.0 pinned API"
```

Detect which APIs **your code** uses (run from your project root):

```bash
# 5.0.0-only API (props, callbacks, exports, MenuGroup fields; hideVeil/container on HotkeysPanel also existed in 4.0.11)
grep -rnE "\bonChangePinned\b|\binitPinned\b|\bpinned=\{|\bisExpanded\b|\bisPinned\b|\brenderFooterAfter\b|\bisCompactMode\b|useAsideHeaderContextOptional|FooterLayoutContext|useFooterLayout|SetCollapseBlocker|setCollapseBlocker|MenuItemsWithGroups|GroupedMenuItem|defaultMenuGroups|\bcollapsible\b|collapsedByDefault|\bhideVeil\b|'pinned'|--gn-aside-(top|main|bottom)-|gn-footer-bar" src
# removed in 6.0.0 (all lineages)
grep -rnE "multipleTooltip|gn-multiple-tooltip" src
# 7.0.0 layout changes
grep -rnE "collapseButtonWrapper|hideCollapseButton|hideCompactChevron|gn-collapse-button|titleLines" src
```

Review the hits: names such as `onChangePinnedServices` or `<PinButton pinned={...}>` belong to your
own code, and `'pinned'` inside `Omit<AsideHeaderProps, 'pinned'>` is a stale key that TypeScript
never reports (see section 9).

Pick your path:

| Installed | Read sections                                                                                                                  |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------- |
| 5.0.0     | 1, 2, **3**, 5, 6, 7, 8, 10 (section 4 is already included in 3)                                                               |
| 5.0.1     | 1, 2, **4**, 5, 6, 7, 8, 10                                                                                                    |
| 4.x       | 1, 2, **4**, 5, 6, 7, 8, 10 (same as 5.0.1; on 4.0.0–4.0.1 or 4.0.11 also read the "inside the 4.x line" bullets of section 4) |
| 6.x       | 1, 2, **5**, 6, 7, 8, 10                                                                                                       |

---

## 1. Migration procedure (checklist)

Work through the list in order. Each step is safe to run with the previous ones complete.

1. **Record the baseline.** Run `typecheck`, `lint` and unit tests on the current revision so that
   pre-existing failures are not attributed to the migration.
2. **Bump dependencies** (section 2) and reinstall. Make sure only one copy of
   `@gravity-ui/navigation` ends up in the lockfile.
3. **Apply the API changes** for your path (section 3, 4 or 5). Fix every TypeScript error that
   mentions a removed or renamed prop before touching styles.
4. **Update styles and selectors** (sections 6 and 7): CSS variables, `gn-*` class names used in
   SCSS overrides, Playwright/Testing Library selectors and screenshot masks.
5. **Re-verify behavior** listed in section 8 in Storybook or in the app (collapse button, footer
   row height, popups, title wrapping, hotkeys panel offset).
6. **Run verification** (section 10): `typecheck`, `lint`, unit tests, then visual tests and
   regenerate screenshots that changed because of the new layout.
7. **Review the diff.** Compare against the "done" criteria in section 10.

---

## 2. Dependencies

```bash
npm install @gravity-ui/navigation@^7
```

Peer dependencies of 7.x:

| Peer                   | Required range                                   | Notes                                                         |
| :--------------------- | :----------------------------------------------- | :------------------------------------------------------------ |
| `@gravity-ui/uikit`    | `^7.42.0`                                        | Raised from `^7.2.0` in 6.1.0. Upgrade uikit first if needed. |
| `@gravity-ui/icons`    | `^2.2.0`                                         | unchanged                                                     |
| `@bem-react/classname` | `^1.6.0`                                         | unchanged                                                     |
| `react`, `react-dom`   | `^16.0.0 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0` | unchanged                                                     |

Other dependency notes:

- The `navigation-codemod` CLI was removed in 7.1.2 (it never worked from the published package).
  There is no codemod for v7; apply the renames below manually or with your own search/replace.
- 7.1.2 runtime dependencies are `lodash`, `react-virtualized-auto-sizer` and `tslib` (7.0.0–7.1.1
  also listed `commander` and `jscodeshift`). `react-transition-group` was a dependency of 5.0.0
  only; if your project listed it just for navigation (check with
  `grep -rn react-transition-group src`), you may drop it.
- If a library in your dependency tree (for example a wrapper package) also depends on
  `@gravity-ui/navigation`, bump both so that the lockfile resolves to a single 7.x copy. Two
  copies produce duplicated styles and incompatible context objects.
- A wrapper library must raise its own `peerDependencies` (and devDependencies) for
  `@gravity-ui/uikit` to at least `^7.42.0`; otherwise its consumers install an uikit that the
  bundled navigation rejects.

---

## 3. Migrating from 5.0.0 (the `pinned` API)

6.0.0 **reverted** the 5.0.0 state API back to the 4.x shape and removed the 5.0.0-only features.
7.x keeps the 6.x props API. Everything in this section applies if you are on 5.0.0; the
`multipleTooltip` removal from section 4 is already included because 5.0.0 had removed it too.

### 3.1 Props and callbacks (rename + inversion)

Rule of thumb: every `pinned`/`isExpanded` boolean becomes `compact` with the **opposite** value.

| 5.0.0 API                                                                                                                                                  | 7.x API                                                                                                   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AsideHeader`/`PageLayout` `pinned: boolean`                                                                                                               | `compact: boolean`                                                                                        | **Inverted**: `pinned={p}` → `compact={!p}`. `compact` is **required** on `AsideHeaderProps` and `PageLayoutProps`; wrapper types written as `Omit<AsideHeaderProps, 'pinned'>` must omit `'compact'` (and `'onChangeCompact'`) instead when the wrapper owns the state (section 9).                                                                                                                                       |
| `AsideHeader`/`PageLayoutAside`/`PageLayout` `onChangePinned`                                                                                              | `onChangeCompact` on `AsideHeader` or `PageLayoutAside`                                                   | Inverted value. `PageLayout` no longer accepts the callback; it only takes `compact`.                                                                                                                                                                                                                                                                                                                                      |
| `PageLayout`/`AsideHeader` `isCompactMode`                                                                                                                 | `menuDensity="compact"`                                                                                   | Closest equivalent, dimensions differ (see Appendix A). Remove `isCompactMode` from `renderFooter` data.                                                                                                                                                                                                                                                                                                                   |
| `renderFooter({size, isExpanded, isPinned, asideRef, isCompactMode})`                                                                                      | `renderFooter({size, compact, asideRef})`                                                                 | Returns `React.ReactNode`. An array is still a valid node and still renders, but it no longer activates `FooterBar`: in 5.0.0 an array of 2+ elements was wrapped in `FooterBar` (horizontal layout when pinned, overflow after 5 items, `renderFooterAfter` slot); in 7.x the result is rendered as-is, so the items become vertical rows. Array-returning code compiles unchanged, so verify the footer visually.        |
| `renderFooterAfter`                                                                                                                                        | removed                                                                                                   | In 5.0.0 it rendered after the footer items inside the footer container. Render that content last in `renderFooter`.                                                                                                                                                                                                                                                                                                       |
| `collapseButtonWrapper(button, {isExpanded, onChangePinned})`                                                                                              | `collapseButtonWrapper(button, {compact, onChangeCompact})`                                               | See also section 5: the wrapper decorates only the edge control in 7.x.                                                                                                                                                                                                                                                                                                                                                    |
| `AsideHeaderItem.isExpanded` (on `FooterItem` etc.)                                                                                                        | `AsideHeaderItem.compact`                                                                                 | Inverted. **Pass `compact={compact}` explicitly** to every `FooterItem` in `renderFooter`: 5.0.0 `FooterItem` fell back to the context's `isExpanded`, while 7.x `FooterItem` reads only `menuDensity` from context, so `<FooterItem id title icon />` without `compact` renders as an expanded row inside a compact aside.                                                                                                |
| `FooterItem.layout`                                                                                                                                        | removed                                                                                                   | Footer items are always vertical rows. `FooterBar` and `FooterLayoutContext` are removed.                                                                                                                                                                                                                                                                                                                                  |
| `MenuItem.onItemClick(item, collapsed, event, {setCollapseBlocker})`                                                                                       | `onItemClick(item, collapsed, event)`                                                                     | Drop the 4th parameter.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `MenuItem.itemWrapper(p, makeItem, {isExpanded, item, ref, setCollapseBlocker})`                                                                           | `itemWrapper(p, makeItem, {collapsed, compact, item, ref})`                                               | `compact` = the sidebar is compact (`!isExpanded`). `collapsed` is always `false` in 6.x/7.x (4.x passed `true` for rows inside the "More" popup). Rows inside composite-bar popups ("More", groups, the compact label popover) and in the All pages panel call the wrapper with `compact: false`, so the flags cannot tell a popup row from a row in the expanded bar; the wrapper output must look right in both places. |
| `LogoProps.wrapper(node, isExpanded)`                                                                                                                      | `wrapper(node, compact)`                                                                                  | Inverted second argument.                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Logo` component props `isExpanded`, `placement`, `isCompactMode`                                                                                          | `compact`                                                                                                 | `placement` and `isCompactMode` removed. The default icon size is always 24px (5.0.0 used 32px when `isCompactMode={false}` was passed); set `logo.iconSize: 32` to keep it.                                                                                                                                                                                                                                               |
| `MobileLogoProps.isExpanded`                                                                                                                               | `MobileLogoProps.compact`                                                                                 | Inverted.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `MobileHeader` `burgerMenu.renderFooter({size, isExpanded})`                                                                                               | `renderFooter({size, isCompact})`                                                                         | Inverted.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `MenuGroup.collapsible`, `collapsedByDefault`, `collapsed`                                                                                                 | `AsideHeader` props `collapsedMenuGroupIds`, `defaultCollapsedMenuGroupIds`, `onToggleMenuGroupCollapsed` | Collapse state moved from the group object to the component (map keyed by `MenuGroup.id`). Inline expand/collapse exists only with `menuOverflow="scroll"`.                                                                                                                                                                                                                                                                |
| `AsideHeader.defaultMenuGroups`                                                                                                                            | removed                                                                                                   | It was the groups snapshot for "Reset to default" in All pages (5.0.0 called `onMenuGroupsChanged(defaultMenuGroups)` after `onMenuItemsChanged(defaultMenuItems)`); unrelated to collapse state. The 7.x reset restores `defaultMenuItems` only. Keep your own snapshot and restore it in `editMenuProps.onResetSettingsToDefault`, which fires before `onMenuItemsChanged` (and only when `onMenuItemsChanged` is set).  |
| `HotkeysPanel` `container`, `hideVeil`                                                                                                                     | `drawerProps={{container, hideVeil}}`                                                                     | Also new: `disableNavigationOffset`. The panel is `position: fixed` and offset by the aside width.                                                                                                                                                                                                                                                                                                                         |
| `useAsideHeaderContext()` → `{pinned, size, isExpanded, onChangePinned, onExpand, onFold, setCollapseBlocker}`                                             | `{compact, size, compactTransition?, menuDensity?}`                                                       | No expand/fold callbacks: the sidebar no longer expands on hover.                                                                                                                                                                                                                                                                                                                                                          |
| `useAsideHeaderContextOptional()`                                                                                                                          | `useAsideHeaderContext()`                                                                                 | 6.x/7.x context has a default value (`{compact: false, size: 0}`; 7.x adds `compactTransition: true, menuDensity: 'default'`), so the hook never throws. 5.0.0 threw outside the provider.                                                                                                                                                                                                                                 |
| `AsideHeaderContextProvider value={{pinned, size, isExpanded}}`                                                                                            | `value={{compact, size}}`                                                                                 | Used in tests/stories that render `FooterItem` outside `AsideHeader`.                                                                                                                                                                                                                                                                                                                                                      |
| Exports `SetCollapseBlocker`, `MenuItemsWithGroups`, `FooterLayoutContext`, `useFooterLayout`, `FooterLayoutContextValue`, `useAsideHeaderContextOptional` | removed                                                                                                   | Delete imports. The internal `GroupedMenuItem` interface (member of the `MenuItemsWithGroups` union) is gone as well.                                                                                                                                                                                                                                                                                                      |
| `MenuItem` props `pinned`, `afterMoreButton`, `order`, `category` (removed in 5.0.0)                                                                       | restored in 6.x/7.x                                                                                       | Re-add `pinned: true` (or `afterMoreButton: true`) to items that must never collapse into "More"; `pinned` has no effect on All pages. To stop users from hiding an item in All pages keep using `preventUserRemoving: true`, which 5.0.0 never removed (the 7.x README wrongly attributes this to `pinned`).                                                                                                              |

### 3.2 Code examples

**Controlled state**

```tsx
// 5.0.0
const [pinned, setPinned] = React.useState(true);
<AsideHeader pinned={pinned} onChangePinned={setPinned} />;

// 7.x
const [compact, setCompact] = React.useState(false);
<AsideHeader compact={compact} onChangeCompact={setCompact} />;
```

**Advanced layout**

```tsx
// 5.0.0
<PageLayout pinned={pinned} onChangePinned={setPinned} isCompactMode>
  <PageLayoutAside {...props} />
  <PageLayout.Content>{children}</PageLayout.Content>
</PageLayout>

// 7.x — the callback lives on PageLayoutAside, density on PageLayout
<PageLayout compact={compact} menuDensity="compact">
  <PageLayoutAside {...props} onChangeCompact={setCompact} />
  <PageLayout.Content>{children}</PageLayout.Content>
</PageLayout>
```

**Footer**

```tsx
// 5.0.0
renderFooter={({isExpanded, asideRef}) => [
  <FooterItem key="a" id="a" title="A" icon={A} isExpanded={isExpanded} />,
  <FooterItem key="b" id="b" title="B" icon={B} isExpanded={isExpanded} />,
]}
renderFooterAfter={() => <UserMenu />}

// 7.x
renderFooter={({compact, asideRef}) => (
  <React.Fragment>
    <FooterItem id="a" title="A" icon={A} compact={compact} />
    <FooterItem id="b" title="B" icon={B} compact={compact} />
    <UserMenu />
  </React.Fragment>
)}
```

**Item wrapper and click handler**

```tsx
// 5.0.0
itemWrapper: (params, makeItem, {isExpanded, setCollapseBlocker}) =>
  isExpanded ? <Accent>{makeItem(params)}</Accent> : makeItem(params),
onItemClick: (item, collapsed, event, {setCollapseBlocker}) => { ... },

// 7.x: `collapsed` is always false. Popup rows ("More", groups, compact label popover)
// and All pages rows also arrive with compact: false, so the decorated branch renders there too.
itemWrapper: (params, makeItem, {compact}) =>
  compact ? makeItem(params) : <Accent>{makeItem(params)}</Accent>,
onItemClick: (item, collapsed, event) => { ... },
```

Since 6.0.0, when an item has `itemWrapper` and no `href`, `makeItem` creates a
`<div role="button">` that is not focusable by default (even if the wrapper returns
`makeItem(params)` unchanged); since 7.1.x opt it into keyboard access with
`menuItemAriaProps={{tabIndex: 0}}`; items with `href` stay `<a>`; see section 8, item 11, before
keeping a decorative wrapper.

**Menu groups**

```tsx
// 5.0.0
menuGroups={[{id: 'g', title: 'Group', icon: Folder, collapsible: true, collapsedByDefault: true}]}

// 7.x, uncontrolled: the component keeps the collapsed state, the callback is optional
menuOverflow="scroll" // required for inline expand/collapse of groups
menuGroups={[{id: 'g', title: 'Group', icon: Folder}]}
defaultCollapsedMenuGroupIds={{g: true}}

// 7.x, controlled: the map you pass is the source of truth, so the callback must update it
const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({g: true});
menuOverflow="scroll"
menuGroups={[{id: 'g', title: 'Group', icon: Folder}]}
collapsedMenuGroupIds={collapsed}
onToggleMenuGroupCollapsed={(groupId) => setCollapsed((s) => ({...s, [groupId]: !s[groupId]}))}
```

**Reset to default (All pages)**

```tsx
// 5.0.0: the built-in reset restored both items and groups
defaultMenuItems={items}
defaultMenuGroups={groups}
onMenuItemsChanged={setItems}
onMenuGroupsChanged={setGroups}

// 7.x: the reset restores defaultMenuItems only; restore the groups yourself
const defaultGroups = React.useRef(groups).current;
defaultMenuItems={items}
onMenuItemsChanged={setItems}
onMenuGroupsChanged={setGroups}
editMenuProps={{onResetSettingsToDefault: () => setGroups(defaultGroups)}}
```

**Hotkeys panel**

```tsx
// 5.0.0
<HotkeysPanel open={open} hotkeys={hotkeys} hideVeil container={node} />

// 7.x
<HotkeysPanel open={open} hotkeys={hotkeys} drawerProps={{hideVeil: true, container: node}} />
```

### 3.3 Behavior removed with 5.0.0

- **Hover-to-expand is gone.** In 5.0.0 an unpinned sidebar expanded while the pointer was inside
  it; the visual state (`isExpanded`) could differ from the user preference (`pinned`). In 6.x/7.x
  there is one state, `compact`, and it only changes through `onChangeCompact`. Remove any code
  that reacted to `onExpand`/`onFold` or to `gn-aside-header__content_expanded-by-hover`.
- **Collapse blockers are gone.** `setCollapseBlocker` existed to keep a hovered sidebar open while
  a popup was shown. It is not needed any more.
- **Horizontal footer (`FooterBar`) is gone.** Footer items are vertical rows in both states.
- **`MobileHeader` panels render in a portal** (4.0.14 on the 4.x line, 6.0.0 on the 5.0.0 line).
  Selectors like `.my-root [class*="gn-mobile-header__panels"]` must not rely on DOM nesting.
- **Base geometry changed.** 5.0.0 used an expanded width of 240px, 56px collapsed (40px with
  `isCompactMode`), 36px rows (28px in compact mode) and 16px icons. 7.x default density is
  236px/56px, 40px rows, 18px icons; `menuDensity="compact"` is 220px/44px, 32px rows, 16px icons.
  Code that reads `size` / `--gn-aside-header-size` or screenshots will change.
- **`panelItems` drawers** (6.0.0 ported the 4.0.15 fixes): the veil no longer covers `topAlert`
  (each panel gets inline `top: var(--gn-top-alert-height, 0px)`), and a consumer `style` on a
  panel item is merged with the computed `left`/`top` instead of being overwritten. The built-in
  All pages drawer uses `size: 'auto'`.

### 3.4 CSS variables introduced in 5.0.0 and removed in 6.0.0

The zone-based variables do not exist in 6.x/7.x. Map them back to the classic variables:

| 5.0.0 variable (removed)                                                                                                                                                         | 7.x replacement                                                                                                                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--gn-aside-top-item-icon-color`, `--gn-aside-bottom-item-icon-color`                                                                                                            | `--gn-aside-header-general-item-icon-color` (subheader + footer icons) or `--gn-aside-header-item-icon-color`                                                                                                                                                                         |
| `--gn-aside-top-item-current-icon-color`, `--gn-aside-bottom-item-current-icon-color`                                                                                            | `--gn-aside-header-item-current-icon-color`                                                                                                                                                                                                                                           |
| `--gn-aside-top-item-text-color`, `--gn-aside-bottom-item-text-color`                                                                                                            | `--gn-aside-header-item-text-color`                                                                                                                                                                                                                                                   |
| `--gn-aside-top-item-current-text-color`, `--gn-aside-bottom-item-current-text-color`                                                                                            | `--gn-aside-header-item-current-text-color`                                                                                                                                                                                                                                           |
| `--gn-aside-top-item-background-color-hover`, `--gn-aside-bottom-item-background-color-hover`, `--gn-aside-main-group-item-background-color-hover`                               | `--gn-aside-header-item-background-color-hover`                                                                                                                                                                                                                                       |
| `--gn-aside-top-item-current-background-color(-hover)`, `--gn-aside-bottom-item-current-background-color(-hover)`, `--gn-aside-main-group-item-current-background-color(-hover)` | `--gn-aside-header-item-current-background-color(-hover)`                                                                                                                                                                                                                             |
| `--gn-aside-top-item-background-color`, `--gn-aside-main-group-item-background-color`, `--gn-aside-main-background-color`, `--gn-aside-bottom-background-color`                  | no per-zone background; use `--gn-aside-header-background-color`, `--gn-aside-header-collapsed-background-color`, `--gn-aside-header-expanded-background-color`                                                                                                                       |
| `--gn-aside-top-decoration-background-color`                                                                                                                                     | `--gn-aside-header-decoration-collapsed-background-color`, `--gn-aside-header-decoration-expanded-background-color`                                                                                                                                                                   |
| `--gn-aside-top-divider-color`, `--gn-aside-bottom-divider-color`                                                                                                                | `--gn-aside-header-divider-horizontal-color`                                                                                                                                                                                                                                          |
| `--gn-aside-main-group-border-color`, `--gn-aside-main-group-border-color-hover`                                                                                                 | `--gn-aside-header-menu-group-tree-line-color`, `--gn-aside-header-menu-group-tree-line-active-color` (7.x tree connectors)                                                                                                                                                           |
| `--gn-aside-bottom-shadow-color`                                                                                                                                                 | survived through 6.x (scroll shadow of `menuOverflow="scroll"`), removed in 7.0.0; the scroll-edge shadow is now hardcoded, no replacement                                                                                                                                            |
| `--gn-aside-scrollbar-handle-color-hover`                                                                                                                                        | removed; `--gn-aside-scrollbar-handle-color`, `--gn-aside-scrollbar-track-color` remain (default handle color changed from `--g-color-line-generic-solid` to `--g-color-base-simple-hover` in 6.0.0); `--gn-aside-scrollbar-width`, `--gn-aside-scrollbar-thumb-width` added in 6.0.0 |
| `--gn-aside-top-panel-height`                                                                                                                                                    | `--gn-top-alert-height` (read-only). The old name was a dead `0px` declaration on `.g-root` in 4.x–6.6.0, removed in 6.6.1; it never carried the alert height                                                                                                                         |
| `--gn-drawer-z-index`                                                                                                                                                            | removed; use `--gn-aside-header-panel-z-index` for `panelItems` drawers                                                                                                                                                                                                               |

Variables that 5.0.0 lacked and 7.x has again: `--gn-aside-header-item-icon-background-size`,
`--gn-aside-header-pane-top-z-index`.

### 3.5 CSS class names that existed only in 5.0.0

| 5.0.0 class                                                                                                                                                                                                                                       | 7.x                                                                 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------ |
| `gn-aside-header_collapsed`                                                                                                                                                                                                                       | `gn-aside-header_compact`                                           |
| `gn-aside-header__content_expanded-by-hover`                                                                                                                                                                                                      | removed                                                             |
| `gn-footer-bar`, `gn-footer-bar__*`                                                                                                                                                                                                               | removed (`gn-aside-header__footer` keeps vertical `gn-footer-item`) |
| `gn-footer-item_collapsed`, `gn-footer-item_layout_*`, `gn-footer-item_footer-bar`                                                                                                                                                                | `gn-footer-item_compact`                                            |
| `gn-logo__logo_collapsed`, `gn-logo__logo_placement_*`                                                                                                                                                                                            | `gn-logo__logo`; the title is simply not rendered when compact      |
| `gn-collapse-button_collapsed` (5.0.0 rendered a uikit `Button`)                                                                                                                                                                                  | `gn-collapse-button_compact` on a plain `<button>`                  |
| `gn-composite-bar-item_collapsed`                                                                                                                                                                                                                 | `gn-composite-bar-item_compact`                                     |
| `gn-logo__logo-enter*`, `gn-logo__logo-exit*`, `gn-composite-bar-item__transition-title-*` (react-transition-group classes)                                                                                                                       | removed; no transition classes on titles                            |
| `gn-composite-bar-item__visibility-button`, `gn-composite-bar__menu-item_collapsed`, `gn-composite-bar__menu-group-item`, `gn-composite-bar__group-item`, `gn-composite-bar__root-menu-item_collapsed`, `gn-scrollable-with-scrollbar__scrollbar` | removed (5.0.0 group/edit-mode internals)                           |
| `gn-mobile-header` root without modifier                                                                                                                                                                                                          | `gn-mobile-header_compact` is always present (as in 4.x)            |

---

## 4. Migrating from 5.0.1 or 4.x to 6.x API

5.0.1 is API-identical to 4.0.17. Breaking changes between that line and 6.0.0 at the props level:

- **`multipleTooltip` removed** from `AsideHeader` and `PageLayoutAside`, together with the
  `MultipleTooltip` component, its context and the `gn-multiple-tooltip*` classes. Delete the prop
  and any SCSS that targets `gn-multiple-tooltip`. There is no aggregated-labels replacement.
- **`tooltipText` is no longer rendered.** The field is still declared on `MenuItem` (and still
  listed in the README), but nothing reads it: the compact label popover and `FooterItem` always
  show the item's `title`. In 4.x / 5.0.1 the compact `ActionTooltip` and `MultipleTooltip`
  rendered `tooltipText || title`. Items whose `tooltipText` differs from `title` (a title plus a
  `<Hotkey>` hint, a longer description, a `FooterItem` that passed only `tooltipText`) lose that
  content: move it into `title`, or render your own tooltip via `itemWrapper`. `enableTooltip`
  still works: `enableTooltip={false}` suppresses the compact label popover; it is also forced off
  for `type: 'action'` items, for rows inside a submenu popup and (7.x) for the footer row that
  hosts the collapse button.

Two renames happened **inside the 4.x line** and are not part of the 6.0.0 diff. They only matter if
you are still on one of these patch versions:

- **4.0.0–4.0.1 → 4.0.2** (`PanelItemProps` became uikit `DrawerProps & {id}`):
  `panelItems[].visible` → `open` and `panelItems[].content` → `children` on `AsideHeader` /
  `PageLayoutAside`; `MobileHeader` `panelItems[].content` → `children` (it controls `open`
  itself); `HotkeysPanel` `visible` → `open`. Detect with
  `grep -rnE "<HotkeysPanel[^>]*\bvisible\b|panelItems" src` and check the item objects.
- **4.0.11 → 4.0.12** (`HotkeysPanel`): `container` / `hideVeil`, which existed only in 4.0.11
  (and in 5.0.0, which was cut from it), became `drawerProps={{container, hideVeil}}`; 4.0.12 also
  added `disableNavigationOffset` and made the panel `position: fixed`, offset by the aside width
  (see the `HotkeysPanel` row in 3.1 and the example in 3.2). 4.0.0–4.0.10 never had these props.

Everything else in 6.x is additive (menu groups, `menuOverflow`, `menuItemAriaProps`,
`aboveMenuContent`, `FooterItem.regularSize`, Settings aria/tabs options), but several **visual
and DOM** changes shipped in 6.0.0 affect consumers that override styles or write screenshot tests:

| Area                          | 4.x / 5.0.1                                                                                                                                             | 6.x / 7.x                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Footer row height             | `40px`, icon background `38px`                                                                                                                          | 6.x: fixed `32px`, icon background `32px`; `FooterItem regularSize` (6.5.0+) restores `40px`/`38px`. 7.x: `min-height` follows `menuDensity` (`40px` default, `32px` compact) and rows grow with two-line titles; `regularSize` gives exactly the menu-row geometry (`40px`, `38px` icon background).                                                                                                                                                                                                                              |
| "More"/group popups           | `gn-composite-bar-item__collapse-items-popup-content`, `__collapse-item`, `__collapse-item-icon`                                                        | `gn-composite-bar-item__popup-content`, `__popup-item`, `__popup-title`; popup rows are regular `Item` rows (`32px`), icons use `__icon`. Popups render through a portal (uikit `Popup`), so CSS variables set on the aside root do not reach them: set them on `.g-root` or on `[class*="gn-composite-bar-item__popup-content"]`. Overrides of `.g-list__item_selected` inside the old popup are dead; selection uses `--gn-aside-header-item-current-background-color`.                                                          |
| Peer `@gravity-ui/uikit`      | `^7.2.0`                                                                                                                                                | `^7.42.0` (since 6.1.0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `--gn-aside-top-panel-height` | present but unused                                                                                                                                      | removed in 6.6.1; use `--gn-top-alert-height`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Expanded row geometry         | full-width rows, no default radius, 56px icon column                                                                                                    | 6.0.0: rows get `margin-inline: 8px` (`gn-aside-header__menu-item`), a default `8px` radius (`--gn-aside-header-item-expanded-radius`), a 40px icon column and an 8px title gap; dividers and the footer are inset the same way. Hover/current highlights are 16px narrower.                                                                                                                                                                                                                                                       |
| Compact tooltip               | uikit `ActionTooltip`, class `gn-composite-bar-item__icon-tooltip`, shown for every item type                                                           | 6.0.0: the uikit `ActionTooltip` is replaced by a uikit `Popover` (`gn-composite-bar-item__icon-popover`) that renders the item as a clickable popup row in the normal theme and shows `title` (not `tooltipText`); `type: 'action'` items get no compact tooltip; `__icon-tooltip` is no longer rendered. 7.0.0: the single-item popover becomes a dark label (`gn-composite-bar-item__icon-popover_single-label`, wrapped in `g-root_theme_dark`, placement `right` instead of `right-start`), still a clickable row.            |
| Legacy popup offset           | `renderPopupContent` popups on menu and footer items opened with the default `popupOffset = {mainAxis: 8, crossAxis: -20}` (5.0.0 had the same default) | 6.0.0: default is `{mainAxis: 14}`: the popup sits 6px further from the row and its bottom edge aligns with the row instead of 20px above it. The `popupPlacement` default (`['right-end']`) and the anchor (the item row, or `popupRef` when given) are unchanged. Nothing to do if you pass `popupOffset` explicitly; otherwise re-check screenshots of these popups, or pass `popupOffset={{mainAxis: 8, crossAxis: -20}}` to keep the old position. Not listed in the CHANGELOG; the 7.1.2 README still shows the old default. |
| Popup opening                 | "More" opened on click only                                                                                                                             | 6.0.0: "More" and group popups also open on hover (100ms delay in 6.x, 0ms and no fade in 7.x); `onMenuMoreClick` still fires on click only. Clicks inside popups call `stopPropagation()`, so document-level click listeners do not see them.                                                                                                                                                                                                                                                                                     |
| Action items inside "More"    | kept the action (floating button) styling, rows were 28px                                                                                               | 6.1.2: `type: 'action'` items that overflow into the popup render as regular 32px rows (`data-type="regular"`).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `HotkeysPanel`                | 4.0.17 focused the filter input on open (`initialFocus`)                                                                                                | 6.x/7.x dropped that fix (the 5.0.0 line never had it): the uikit `Drawer` focuses its container, so "open panel, start typing" may not work. 6.3.1 wraps the content in `gn-hotkeys-panel__drawer-content` and moves the bottom padding to `__list::after`.                                                                                                                                                                                                                                                                       |
| `Settings` mobile tabs        | legacy `Tabs` (`g-tabs-legacy*`)                                                                                                                        | 6.0.0: `TabList`/`Tab` (`g-tab-list`, `g-tab`), page content wrapped in `TabPanel` (`g-tab-panel`). Styles and tests on the legacy classes are dead.                                                                                                                                                                                                                                                                                                                                                                               |
| Page `Footer` menu items      | `min-width: 0`                                                                                                                                          | 6.4.1: `min-width: 28px`, so items collapse into "more" earlier in narrow containers.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Then continue with section 5 for the 7.0.0 changes.

---

## 5. Migrating from 6.x to 7

7.0.0 **did not remove or rename any prop**. The breaking changes are in `AsideHeader` layout and
behavior; they affect custom styling, custom footer content and tests.

| Change                                    | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Collapse button moved**                 | It is no longer a full-width bar at the bottom. It sits at the aside edge beside the last visible `FooterItem` (or on a blank bottom row without footer items). In the compact state it is hidden and revealed on aside hover, button hover or keyboard focus (always visible on `(hover: none)` devices): a 20px pill overhanging the edge in 7.0.x, a 20px tab attached outside the edge since 7.1.0. The control is no longer inside `gn-aside-header__aside`; its layer is a sibling rendered right after the aside inside `__pane-container`. Update screenshot masks and selectors: use `[data-gn-aside-collapse-slot] button[aria-controls]` (see section 6).                                                                                                                                         |
| **Collapse layer and custom top offsets** | The layer `[data-gn-aside-collapse-layer]` is a sibling of `gn-aside-header__aside` and repeats its geometry: `position: sticky`, `top` and `max-height` from `--gn-top-alert-height`, and `margin-top: var(--gn-top-alert-height, 0)`. Apps with their own fixed header often set `--gn-top-alert-height` to the header height and cancel `margin-top` on `[class*="gn-aside-header__aside"]`; that override does not reach the layer, so the button ends up one header height below its footer row. Add the same correction for the layer: `[data-gn-aside-collapse-layer] { margin-top: 0; }` next to the aside rule. Apply it only where the aside rule exists: with the built-in `topAlert` spacing the default `margin-top` is correct. Check the button position before and after scrolling the page. |
| **`hideCollapseButton`**                  | Now removes the control, its reserved 24px space in the anchor row and the blank bottom row. Nothing to change unless you relied on the old divider line.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **`collapseButtonWrapper`**               | Decorates only the edge control. Any full-width content you rendered through the wrapper must move into `renderFooter`. Returning custom content without `defaultButton` still works, but it is laid out as the edge control: a 24px slot beside the anchor row in the expanded state and a 20px tab in the compact state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Automatic two-line titles**             | In the expanded sidebar long titles wrap to a second line and increase the row height. Rows are no longer a fixed `40px`. Remove custom `line-clamp`/`white-space` hacks on `gn-composite-bar-item__title` and re-check layouts that assumed fixed row height. Compact rows and popup rows stay single-line. Remove `titleLines` if you used a 7.0.0 prerelease.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Tooltip suppression**                   | In the compact state the built-in tooltip of the selected footer row (the one hosting the collapse button) is suppressed even with `enableTooltip`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **`MenuGroup.hideCompactChevron`**        | Deprecated no-op; the compact sidebar never renders a chevron on the group anchor. Delete the flag at your convenience.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Chevrons in the expanded sidebar**      | Rows that open a popup ("More", group headers in `collapse` layout) and inline group headers render `gn-composite-bar-item__chevron` (the class exists since 6.0.0; 7.x renders it only in the expanded sidebar). Hide it with `[class*="gn-composite-bar-item__chevron"]:not([class*="_interactive"]) { display: none; }` if the design does not want it; the `_interactive` modifier is the clickable chevron of inline group headers (`menuOverflow="scroll"`) and must stay visible.                                                                                                                                                                                                                                                                                                                     |
| **`PageLayoutAside` placement**           | `PageLayoutAside` must be a direct flex child of `PageLayout`. React components, fragments, providers and `Suspense` are fine; a DOM wrapper needs `display: contents`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Transitions**                           | Width, item positions and the current-item highlight animate; `[data-gn-aside-animating]` is set on the aside root meanwhile. Visual tests should wait for it to disappear or set `compactTransition={false}`; `prefers-reduced-motion` disables animation. Composite-bar popups ("More", groups, compact labels) now appear instantly: no fade and a 0ms hover delay (100ms in 6.x).                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Footer anchor row width**               | The `FooterItem` that anchors the button is `calc(100% - 24px)` wide in the expanded state (`[data-gn-collapse-anchor]`; `calc(100% - 44px)` for `type: 'action'`). Without an anchor a blank `gn-aside-header__collapse-fallback[data-gn-collapse-fallback]` row is rendered. Custom footer rows that are not `FooterItem` keep full width.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Aside clips its content**               | 7.0.0 sets `overflow: hidden` on `gn-aside-header__aside` and `__aside-content`. Badges, decorations or custom footer content positioned outside the aside box are clipped.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Removed 6.x internals**                 | `gn-scrollable-with-scrollbar_bottom-shadow` is replaced by `_shadow-start`/`_shadow-end` and `__scroll-divider` (`_start`/`_end`/`_visible`); `--gn-aside-bottom-shadow-color` is gone. The SVG tree hook `gn-composite-bar__menu-group-nested-tree-svg*` is still rendered in 7.0.0 and 7.1.0; 7.1.1 replaces it with the CSS hook `gn-composite-bar__menu-group-nested-hook` (the vertical spine was already CSS; `--gn-aside-header-menu-group-tree-line-*` colors are unchanged, `-width` is new in 7.0.0). Selectors on `nested-tree-svg` stop matching only on 7.1.1+.                                                                                                                                                                                                                                |
| **All pages panel**                       | Clicking a non-current item closes the panel before the item action runs; the current item keeps it open. While the panel is open, consumer `current` items and group rows are muted (`data-gn-aside-current-suppressed`), data unchanged. Clicking a group anchor that has its own action closes its hover popup.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

Example of the wrapper change:

```tsx
// 6.x: wrapper used to add a full-width block under the button
collapseButtonWrapper={(button, {compact}) => (
  <>
    {button}
    <PromoBlock compact={compact} />
  </>
)}

// 7.x
collapseButtonWrapper={(button) => <span className="collapse-decoration">{button}</span>}
renderFooter={({compact}) => (
  <>
    <PromoBlock compact={compact} />
    <FooterItem id="account" title="Account" icon={Person} compact={compact} />
  </>
)}
```

---

## 6. DOM, CSS classes and test selectors

Class names are generated with the `gn-` prefix (CSS modules add a hash suffix, so match with
`[class*="gn-..."]`). The table lists selectors commonly used by consumers and their status in 7.x.

| Selector                                                                                                                      | 4.x/5.0.1 | 5.0.0 | 7.x | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------- | :-------: | :---: | :-: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gn-aside-header__aside`, `__aside-content`, `__header`, `__footer`, `__pane-container`, `__content`, `__menu-items`          |     ✓     |   ✓   |  ✓  | unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `gn-aside-header_compact`                                                                                                     |     ✓     |   –   |  ✓  | 5.0.0 used `gn-aside-header_collapsed`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `gn-composite-bar-item`, `__icon`, `__icon-place`, `__title`, `__title-text`, `__title-adornment`, `_current`, `_type_action` |     ✓     |   ✓   |  ✓  | unchanged. Rows with `itemWrapper` and no `href` are `<div role="button">` since 6.0.0 (always `<button>`/`<a>` in 4.x/5.0.x), so tag selectors like `button[class*="gn-composite-bar-item"]` miss them. The div has no `tabindex`; see section 8, item 11                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `gn-composite-bar-item__chevron`                                                                                              |     –     |   –   |  ✓  | since 6.0.0 (`_interactive` since 6.5.0); 7.x renders it only in the expanded sidebar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `gn-composite-bar-item__surface`                                                                                              |     –     |   –   |  ✓  | since 7.0.0: `<span aria-hidden data-gn-aside-part="surface">`, the first child of every `regular`/`action` row (not of rows inside the "More"/group popups), paints the hover/current/action background. Up to 6.6.1 the expanded-row background was `background-color` on the row element itself and the compact one was the `gn-composite-bar-item__btn-icon::before` pseudo-element; both are gone (`__btn-icon` remains only as a plain wrapper in the compact state), so SCSS that overrode them has no effect. Override `--gn-aside-header-item-background-color-hover`, `--gn-aside-header-item-current-background-color(-hover)`, `--gn-aside-header-item-action-color(-hover)` instead; the shape comes from `--gn-aside-header-item-expanded-radius`, `--gn-aside-header-item-collapsed-radius`, `--gn-aside-header-item-icon-background-size`. The `box-shadow` and focus ring of `_type_action` rows also live on `__surface`. Match it with `[data-gn-aside-part="surface"]`, not the hashed class |
| `gn-composite-bar-item__icon-tooltip`                                                                                         |     ✓     |   –   |  –  | compact tooltip; since 6.0.0 it is `gn-composite-bar-item__icon-popover` (shows `title`); the dark `_single-label` variant exists only since 7.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `gn-aside-header__header::after` (divider), no footer divider                                                                 |     ✓     |   ✓   |  –  | 7.x renders real elements: `gn-aside-header__header-bottom-divider[data-gn-aside-divider="header"]` and `gn-aside-header__footer-divider[data-gn-aside-divider="footer"]`; `::after { content: none }` overrides are dead                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `gn-aside-header__unified-menu-scroll`, `__unified-menu-content`, `__menu-item`, `__collapse-fallback`                        |     –     |   –   |  ✓  | 7.x wrappers between `__aside-content` and the menu, the inset row class and the blank anchor row; child-combinator rules such as `__aside-content > [class*="gn-composite-bar"]` break                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `gn-hotkeys-panel__drawer-content`                                                                                            |     –     |   –   |  ✓  | since 6.3.1; `__drawer-item > *` selectors and padding overrides need re-checking                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Settings mobile tabs `g-tabs-legacy*`                                                                                         |     ✓     |   ✓   |  –  | `g-tab-list`, `g-tab`, `g-tab-panel` since 6.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `gn-composite-bar-item__collapse-items-popup-content`, `__collapse-item`, `__collapse-item-icon`                              |     ✓     |   –   |  –  | use `gn-composite-bar-item__popup-content`, `__popup-item`, `__popup-title`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `gn-multiple-tooltip`, `gn-multiple-tooltip__item`                                                                            |     ✓     |   –   |  –  | removed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `gn-collapse-button`                                                                                                          |     ✓     |   ✓   |  ✓  | still the `<button>`; in 7.x it is wrapped by `gn-collapse-button__layer` and `__slot`. `[class*="gn-collapse-button"]` now also matches the 20px layer strip, so narrow the selector.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `gn-collapse-button_compact`                                                                                                  |     ✓     |   –   |  ✓  | 5.0.0 used `gn-collapse-button_collapsed` on a uikit `Button`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `gn-footer-item`                                                                                                              |     ✓     |   ✓   |  ✓  | unchanged; emitted both hashed and unhashed on every line (see below). 7.x adds the unhashed `gn-footer-item_regular-size` (`FooterItem` prop `regularSize`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `gn-footer-item_compact`                                                                                                      |     ✓     |   –   |  ✓  | 5.0.0 used `gn-footer-item_collapsed`, `_layout_*`, `_footer-bar`. Hashed since 7.0.0; in 4.x/5.0.1/6.x it was emitted as a raw token (`FooterItem.module.scss` did not define it), so plain `.gn-footer-item_compact` selectors stop matching in 7.x: use `[class*="gn-footer-item_compact"]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `gn-footer-bar*`                                                                                                              |     –     |   ✓   |  –  | removed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `gn-drawer`, `gn-drawer__veil`, `gn-drawer__item-transition-*`                                                                |     –     |   –   |  –  | 3.x classes; since 4.0.0 panels are the uikit `Drawer`: `g-drawer` is the overlay root and paints the veil itself (`background-color: var(--g-color-sfx-veil)`; `hideVeil` adds `g-drawer_hide-veil`), `g-drawer__item` is the panel. There is no `g-drawer__veil` element (uikit 7.42.0+), so do not rename `gn-drawer__veil` to it: delete such rules, or restyle the `g-drawer` root, which is portaled. Stale rules in SCSS are not reported by any linter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `gn-all-pages-panel`                                                                                                          |     ✓     |   ✓   |  ✓  | unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| "More" row                                                                                                                    |     ✓     |   ✓   |  ✓  | an ordinary `gn-composite-bar-item` with id `collapse-item-id`; in 7.x target it with `[data-gn-composite-bar-item-id="collapse-item-id"]` (there is no `__more-button` class in the aside)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `gn-mobile-header__panels`, `gn-mobile-header__burger-menu`, `gn-burger-composite-bar__item-title`, `gn-settings_view_mobile` |     ✓     |   ✓   |  ✓  | unchanged, but mobile panels are portaled since 4.0.14 (6.0.0 on the 5.0.0 line)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Built class names look like `Item-module__gn-composite-bar-item__icon___Ab1cD`
(`[name]__[local]___[hash]`), so `[class*="gn-composite-bar-item__icon"]` also matches
`__icon-place` and `__icon-popover`. Append the hash separator to match exactly one element:
`[class*="gn-composite-bar-item__icon___"]`. Only two components also emit an unhashed class next
to the hashed one (`block()` without CSS modules): `FooterItem` adds `gn-footer-item` (plus
`gn-footer-item_regular-size`), and the portal copy of the highlighted row adds
`gn-composite-bar-highlighted-item`. Plain `.gn-footer-item` selectors therefore do match. Every
`gn-composite-bar-item*` class (the row itself, `_compact`, `_current`, `__icon`, ...) and
`gn-footer-item_compact` are hashed and need `[class*="..."]`.

Stable data attributes in 7.x (prefer them in tests over hashed class names):

| Attribute                                             | Element                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-gn-aside-panel]`                               | the aside root (`gn-aside-header__aside`) and the fallback aside                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `[data-gn-aside-collapse-layer]`                      | layer outside the aside edge that hosts the collapse button (20px strip since 7.1.0, zero-width in 7.0.x)                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `[data-gn-aside-collapse-slot] button[aria-controls]` | the collapse button itself: `aria-controls` points at the aside `id`, `aria-expanded` is `true` when expanded and `false` when compact. Use the descendant combinator, not `> button`: the result of `collapseButtonWrapper` is rendered inside the slot, so a wrapper element (the `<span>` in the section 5 example) makes `> button` match nothing, and a Playwright mask that matches nothing fails silently. Works only while the wrapper keeps `defaultButton`; a fully custom control has no `aria-controls` unless you add it, so give it its own locator |
| `[data-gn-aside-part="surface"]`                      | background surface of a menu/footer row (`"icon"` and `"title"` mark the icon and title cells of the same row)                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `[data-gn-collapse-anchor]`                           | the footer row that anchors the collapse button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `[data-gn-collapse-fallback]`                         | blank bottom row used as anchor when no `FooterItem` qualifies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `[data-gn-aside-divider="header"]`                    | the header divider (also rendered by `AsideFallback`, so two matches while the fallback is mounted)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `[data-gn-aside-divider="footer"]`                    | the footer divider. Other values of this attribute: `quick-access`, `scroll-start`, `scroll-end`, `item/<id>`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `[data-gn-composite-bar-item-id="<id>"]`              | menu row for a given `AsideHeaderItem.id`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `[data-gn-aside-group="<groupId>"]`                   | inline group container                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `[data-gn-aside-animating]`                           | present on the aside root while a compact transition runs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `[data-gn-aside-scrollport]`                          | scroll container shared by quick access and the menu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Screenshot masks: a mask built from `[class*="gn-collapse-button"]` now covers a full-height 20px
strip to the right of the aside. Replace it with `[data-gn-aside-collapse-slot] button[aria-controls]`.

Masks of the whole aside can still cover the button in the expanded state, but miss the
protruding compact tab on hover/focus. CSS rules hiding aside descendants no longer hide the
sibling button. Search tests for masks on `gn-aside-header__aside`,
`addStyleTag` rules such as `[class*="gn-aside-header__aside"] * { visibility: hidden }` and
screenshots taken with the default mask disabled. Add
`[data-gn-aside-collapse-slot] button[aria-controls]` to such masks and hiding rules: in the
expanded state the button sits over the aside's anchor row but stays visible through
`visibility: hidden` on aside descendants, and in the compact state on hover/focus the tab extends
outside the aside's bounding box.

Clicking the collapse button in Playwright: `[data-gn-aside-collapse-slot] button[aria-controls]`
matches the button in both states, also when `collapseButtonWrapper` wraps `defaultButton` in
extra DOM; a control that replaces `defaultButton` entirely needs its own locator. The compact tab is
`[data-gn-aside-collapse-slot] button[aria-expanded="false"]` (it also carries the
`gn-collapse-button_compact` class). In the compact state
the tab is translated behind the aside edge inside a clipped layer and slides out on hover over
`[data-gn-aside-panel]` or on keyboard focus, so `hover()` the aside first, or `focus()` the
button and press `Enter`.

SCSS that targeted the old full-width button to tune its top border (for example
`[class*="gn-collapse-button"] { --gn-aside-header-divider-horizontal-color: transparent }`)
has no effect in 7.x: the tab outline comes from `--gn-aside-header-collapse-button-border-color`
(default: the vertical divider color). Delete or rewrite such rules.

---

## 7. CSS variables

Public variables of 4.x are all present in 7.x, except `--gn-aside-top-panel-height` (removed in
6.6.1, use `--gn-top-alert-height`). The 5.0.0 zone variables are mapped in section 3.4;
`--gn-aside-bottom-shadow-color` (5.0.0–6.6.1) is gone in 7.0.0.

`--gn-aside-header-item-expanded-radius` changed semantics: 4.x never defined it (square corners
unless you set it); 6.x declared `8px` on the component itself, which shadowed a value set on
`.g-root`; 7.x reads it with a fallback (`8px`, `6px` for compact density), so `.g-root`
overrides work again.

New public variables in 5.x–7.x (all optional; `--gn-aside-scrollbar-handle-color` and
`--gn-aside-scrollbar-track-color` since 5.0.0 (absent in 5.0.1), `--gn-aside-scrollbar-width`,
`--gn-aside-scrollbar-thumb-width` and the tree-line colors since 6.0.0, chevron padding since
6.5.0, the rest since 7.0.0):

| Variable                                                                                                                                  | Purpose                                                                               |
| :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `--gn-aside-header-collapse-button-border-color`                                                                                          | hairline border of the compact collapse tab (7.0.0)                                   |
| `--gn-aside-header-menu-group-tree-line-color`                                                                                            | tree connectors of nested groups                                                      |
| `--gn-aside-header-menu-group-tree-line-active-color`                                                                                     | tree connectors of the active branch                                                  |
| `--gn-aside-header-menu-group-tree-line-width`                                                                                            | connector width, default `1px`                                                        |
| `--gn-aside-header-floating-surface-box-shadow`                                                                                           | popups shadow                                                                         |
| `--gn-aside-header-item-chevron-padding-right`                                                                                            | chevron box padding                                                                   |
| `--gn-aside-scrollbar-handle-color`, `--gn-aside-scrollbar-track-color`, `--gn-aside-scrollbar-width`, `--gn-aside-scrollbar-thumb-width` | custom scrollbar of `menuOverflow="scroll"` (handle/track colors 5.0.0, widths 6.0.0) |

Variables prefixed with `--_--gn-` (for example `--_--gn-aside-header-density-*`,
`--_--gn-aside-width-transition`, `--_--gn-logo-height`) are private: the component sets them for
`menuDensity` and transitions. Do not override them.

---

## 8. Behavior changes to re-verify

After the code compiles, check these in Storybook or in the app:

1. Collapse/expand works from the new edge button in both states; keyboard focus reveals the tab
   in the compact state.
2. Footer rows: height (7.x default density: `40px` min-height; `32px` with
   `menuDensity="compact"`; `regularSize` matches menu rows exactly), the anchor row keeps its own
   action, popups anchored to `asideRef` still open.
3. Long menu titles wrap to two lines; nothing overlaps; fixed-height assumptions removed.
4. "More" popup and group popups open on hover as well as on click (6.0.0+) and close after a click
   on a non-current row; 7.0.0 also closes the All pages panel and group-anchor popups after a
   navigation click.
5. `HotkeysPanel` opens offset by the aside width (`position: fixed`); pass
   `disableNavigationOffset` or the existing `leftOffset`/`topOffset` if your layout differs. If
   you come from 4.0.17+/5.0.1, check that typing right after opening still filters: the
   `initialFocus` fix is absent in 6.x/7.x.
6. `MobileHeader` panels render through a portal; overlays and z-index still correct.
7. The All pages panel closes before the item action runs; `current` highlights are muted while the
   panel is open.
8. Theme overrides still apply (section 7), especially hover/current colors in the footer.
9. If `menuDensity`, `enableQuickAccess`, `menuGroups` or `menuOverflow="scroll"` are adopted,
   verify them separately; they are opt-in.
10. Popups rendered through the legacy `renderPopupContent` without an explicit `popupOffset` open
    at a different position (default changed from `{mainAxis: 8, crossAxis: -20}` to
    `{mainAxis: 14}` in 6.0.0, section 4); check that they do not overlap the aside edge or
    neighbouring content.
11. Keyboard access of `itemWrapper` rows. Since 6.0.0 a menu or footer row that has `itemWrapper`
    and no `href` renders as `<div role="button">` without `tabindex`, so by default it is skipped
    by Tab; in 4.x/5.0.x the same row was a native `<button>`. The library assumes the wrapper
    itself is the interactive element (a router `<Link>`/`<a href>`, which is why the row is no
    longer a nested button). Wrappers that only swap the icon (`makeItem({...params, icon})`), add a
    decorative `<div>`, or render a `Popup` next to `makeItem(params)` (the README popup example)
    lose keyboard access. Fix: if the icon is SVG data, drop `itemWrapper` and pass `icon`. For
    navigation, wrap `makeItem(params)` in `<a href>`/`<Link>`. Otherwise, since 7.1.x opt the row
    into keyboard access with `menuItemAriaProps={{tabIndex: 0}}`: it then exposes a `tabindex` and
    activates on Enter/Space itself (`role="button"` by default). On older versions
    `menuItemAriaProps` accepts only `aria-*`/`role`, so instead wrap `makeItem(params)` in a
    focusable element: `<div tabIndex={0} onKeyDown={...}>` that forwards Enter/Space to
    `opts.ref.current?.click()`.

---

## 9. Wrapper libraries

If your package re-exports or wraps `@gravity-ui/navigation` (custom `AsideHeader` with extra props,
own `PageLayout`, contexts, stories):

**Choose the state API of the wrapper.** Either option passes typecheck; pick one and state it in
the wrapper changelog.

- _Switch to `compact`_: rename the wrapper props/contexts/hooks (`pinned` → `compact`,
  `onChangePinned` → `onChangeCompact`, `usePinned` → `useCompact`, `AsidePinnedContext` →
  `AsideCompactContext`) and forward them as they are. This is what `@yandex-data-ui/navigation`
  17.0.0 did. Consumers of the wrapper get the same breaking change as upstream.
- _Keep `pinned`_ and map at the boundary. Upstream never sees `pinned`:

  ```tsx
  // wrapper PageLayout: owns pinned/onChangePinned, hands compact to upstream
  <AsidePinnedContextProvider value={{pinned, onChangePinned}}>
    <PageLayout compact={!pinned} {...rest} />
  </AsidePinnedContextProvider>

  // wrapper PageLayoutAside: upstream accepts the callback only here
  const {pinned, onChangePinned} = useAsidePinnedContext();
  <PageLayoutAside {...rest} onChangeCompact={(compact) => onChangePinned(!compact)} />

  // collapseButtonWrapper adapter
  collapseButtonWrapper={(button, {compact, onChangeCompact}) =>
    userWrapper(button, {isExpanded: !compact, onChangePinned: (p) => onChangeCompact?.(!p)})
  }
  ```

**Types.**

- `compact` is required on `AsideHeaderProps`/`PageLayoutProps`. Every wrapper type built as
  `Omit<AsideHeaderProps, 'pinned' | ...>` keeps compiling with the stale `'pinned'` key and starts
  requiring `compact` from wrapper consumers. Replace the stale keys: omit `'compact'` and
  `'onChangeCompact'` when the wrapper owns that state, and list the removed upstream props
  (`isCompactMode`, `renderFooterAfter`, `multipleTooltip`) as wrapper-declared props if you keep
  them.
- Upstream `PageLayoutAside` props are `Omit<AsideHeaderProps, 'compact' | 'compactTransition' |
'size' | 'menuDensity'>`: those three live on `PageLayout`. A wrapper that builds one props object
  for both `AsideHeader` and `PageLayoutAside` must strip them before passing to `PageLayoutAside`.
- Types that extended `MenuItem` for footer/menu rows should extend `AsideHeaderItem` when they
  need `compact`, `enableTooltip`, `bringForward`, `quickAccess` or the legacy popup props
  (`popupVisible`, `popupRef`, `popupPlacement`, `popupOffset`, `popupKeepMounted`,
  `renderPopupContent`, `onOpenChangePopup`). Props that are not in `AsideHeaderItem` are silently
  ignored when the item object is built with spreads.
- Silent-drop trap: wrapper types derived from upstream accept the new optional props
  (`menuDensity`, `enableQuickAccess`, `hideSectionDividers`, `compactTransition`,
  `aboveMenuContent`, `menuOverflow`, `collapsedMenuGroupIds`, `defaultCollapsedMenuGroupIds`,
  `onToggleMenuGroupCollapsed`, `menuGroupNestedIcons`, `onQuickAccessChange`), but a wrapper
  that forwards an explicit list ignores them without any error. Forward them explicitly or
  document that they are unsupported.

**Features built on removed upstream mechanics.**

- Anything built on `FooterBar` / array `renderFooter` (horizontal footer, slot ordering by name)
  has no upstream equivalent; remove it or reimplement on top of a vertical `renderFooter`.
- `renderFooterAfter` can be reimplemented in the wrapper (render after the footer items) or
  dropped. `defaultMenuGroups` has no upstream equivalent: forward `editMenuProps`,
  `defaultMenuItems` and `onMenuGroupsChanged`, keep your own groups snapshot and restore it in
  `editMenuProps.onResetSettingsToDefault` (the built-in reset restores `defaultMenuItems` only).
- `MenuGroup.collapsible`/`collapsedByDefault`/`collapsed` map to `menuOverflow="scroll"` plus the
  `collapsedMenuGroupIds` family; forward those props.

**Everything else.**

- Built-in items that put extra content into `tooltipText` (for example a title plus a `<Hotkey>`
  hint) lose it silently (section 4); move the hint into `title` or drop it.
- Stories and demos that render `FooterItem` outside the aside should provide
  `AsideHeaderContextProvider value={{compact, size}}` or rely on the default context. Note that
  the density variables are set by `PageLayout`; outside it, 7.x footer rows fall back to 32px, so
  such screenshots differ from the app.
- Wrapper SCSS may still reference 3.x/5.0.0-only classes and variables (`gn-drawer__*`,
  `gn-footer-bar`, zone variables, `--gn-aside-header-footer-item-icon-color`); no linter reports
  them. Grep for `gn-` and `--gn-` in the wrapper styles and check each name against section 6/7.
- Raise the wrapper's `@gravity-ui/uikit` peer range to `^7.42.0` (section 2).
- Update READMEs: prop tables, callback signatures (`compact` instead of `isExpanded`), examples.
- Bump your own major version: consumers of the wrapper inherit all DOM/CSS changes above.

---

## 10. Verification

Run in this order and fix until green:

```bash
npm ls @gravity-ui/navigation            # exactly one 7.x copy
npm run typecheck
npm run lint
npm test
# visual regression: regenerate screenshots that changed because of the new layout
```

Done criteria:

- No unexplained references to removed upstream APIs. Classify every hit of the section 0 `grep`
  commands as (a) a removed API that has been migrated, (b) a supported API that the third command
  intentionally finds (`collapseButtonWrapper`, `hideCollapseButton`, `MenuItem.pinned`) whose
  behavior was re-checked against section 5, or (c) your own vocabulary (for example a wrapper
  that keeps `pinned` and maps it at the boundary, section 9).
- No references to removed classes/variables: `gn-multiple-tooltip`, `gn-footer-bar`,
  `gn-drawer__*`, `__collapse-items-popup-content`, `--gn-aside-top-*`, `--gn-aside-bottom-*`,
  `--gn-aside-main-*`, `--gn-aside-top-panel-height`.
- `typecheck` and `lint` pass; unit tests pass; updated screenshots reviewed by a human.

---

## Appendix A. New optional APIs in 6.x–7.x

None of these are required for the migration.

| API                                                                                                                           | Since                                      | Purpose                                                       |
| :---------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- | :------------------------------------------------------------ |
| `menuGroups`, `MenuGroup`, `AsideHeaderItem.groupId`, `onMenuGroupsChanged`                                                   | 5.0.0 (absent in 5.0.1; reworked in 6.0.0) | grouped navigation, group visibility in All pages             |
| `editMenuProps.onToggleMenuGroup`, `MenuGroup.popupTitle`                                                                     | 6.0.0                                      | group pin in All pages, heading of the compact group popup    |
| `menuOverflow: 'collapse' \| 'scroll'`, `collapsedMenuGroupIds`, `defaultCollapsedMenuGroupIds`, `onToggleMenuGroupCollapsed` | 6.0.0                                      | scrollable menu with inline groups                            |
| `menuItemAriaProps`, `SettingsPage.menuItemAriaProps`                                                                         | 6.0.0                                      | aria attributes on rows                                       |
| `aboveMenuContent`                                                                                                            | 6.2.0                                      | content between the header and the menu                       |
| `MenuGroup.onItemClick`, `href` (6.5.0); `iconSize` (6.5.1); `hideItemsInAllPages` (6.6.0); `current` (7.0.0)                 | 6.5.0–7.0.0                                | clickable group headers                                       |
| `FooterItem.regularSize`                                                                                                      | 6.5.0                                      | 40px footer rows                                              |
| `Settings.enableMobileSettingsTabsScroll`                                                                                     | 6.1.0                                      | scrollable tabs in mobile settings                            |
| `menuDensity: 'default' \| 'compact'` (`AsideHeader`, `PageLayout`), type `AsideHeaderMenuDensity`                            | 7.0.0                                      | compact density: item height 32px, icon 16px, widths 44/220px |
| `compactTransition`                                                                                                           | 7.0.0                                      | disable collapse animation                                    |
| `hideSectionDividers`                                                                                                         | 7.0.0                                      | replace header/footer separators with scroll-edge indicators  |
| `enableQuickAccess`, `AsideHeaderItem.quickAccess`, `onQuickAccessChange`, `quickAccessHighlightInMainMenu`                   | 7.0.0                                      | pinned quick-access section                                   |
| `menuGroupNestedIcons`                                                                                                        | 7.0.0                                      | icons of nested group items                                   |
| `HotkeysPanel.drawerProps`, `disableNavigationOffset`                                                                         | 4.0.12 (4.x line), 6.0.0 (5.0.0 line)      | Drawer passthrough; opt out of the aside offset               |

Density reference (7.x):

| Property                 | `default` | `compact` |
| :----------------------- | :-------: | :-------: |
| item height (min)        |   40px    |   32px    |
| footer item height (min) |   40px    |   32px    |
| icon size                |   18px    |   16px    |
| compact aside width      |   56px    |   44px    |
| expanded aside width     |   236px   |   220px   |
