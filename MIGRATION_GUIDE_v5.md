# Navigation v5.0 Migration Guide

## Breaking Changes

This section lists all breaking changes in v5.0 that require code modifications.

### 1. Removed `multipleTooltip` Prop

The `multipleTooltip` prop has been removed from `AsideHeader` component.

#### What Was Removed

- `multipleTooltip` prop from `AsideHeader` and `PageLayoutAside` components
- `MultipleTooltip` component and related context (`MultipleTooltipContext`, `MultipleTooltipProvider`)
- All associated tooltip behavior in collapsed navigation mode

#### Migration

If you were using `multipleTooltip={true}`:

```tsx
// Before (v4.x)
<AsideHeader
  multipleTooltip={true}
  menuItems={menuItems}
  // ...
/>

// After (v5.0)
<AsideHeader
  menuItems={menuItems}
  // ... (simply remove the prop)
/>
```

**Note**: There is no direct replacement for this feature. If you need custom tooltip behavior for menu items in collapsed mode, consider implementing it using the `itemWrapper` prop on individual menu items.

---

### 2. Removed AsideHeaderItem Props and Exports

The following have been removed and are not available in v5:

**AsideHeaderItem props (removed):**

- `afterMoreButton` — no longer supported
- `category` — use `groupId` for grouping
- `order` — order is determined by array position
- `pinned` (item-level) — replaced by `isExpanded` on items (e.g. `FooterItem`)

**Removed exports:**

- `useVisibleMenuItems` — no longer exported; use menu items state from your component
- `AllPagesListItem` — type/helper removed; use `AsideHeaderItem` and `onMenuItemsChanged` as needed

---

### 3. Prop Renaming (`compact` → `pinned`/`isExpanded`)

The `compact` prop and related APIs have been renamed to use clearer semantics with **inverted boolean logic**.

#### Main Prop Changes

| Old Prop/Parameter                            | New Prop/Parameter                         | Notes                                           |
| --------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `compact: boolean`                            | `pinned: boolean`                          | **Inverted!** `compact: true` → `pinned: false` |
| `onChangeCompact`                             | `onChangePinned`                           | Callback receives inverted value                |
| `AsideHeaderItem.compact`                     | `AsideHeaderItem.isExpanded`               | Used by `FooterItem`                            |
| `renderFooter({ compact })`                   | `renderFooter({ isExpanded })`             | Parameter renamed (AsideHeader)                 |
| `collapseButtonWrapper(_, { compact })`       | `collapseButtonWrapper(_, { isExpanded })` | Parameter renamed                               |
| `MenuItem.itemWrapper opts.compact`           | `MenuItem.itemWrapper opts.isExpanded`     | In itemWrapper callback                         |
| `LogoProps.wrapper(_, compact)`               | `LogoProps.wrapper(_, isExpanded)`         | Second parameter renamed                        |
| `MobileLogoProps.compact`                     | `MobileLogoProps.isExpanded`               | MobileLogo prop renamed                         |
| `BurgerMenuProps.renderFooter({ isCompact })` | `renderFooter({ isExpanded })`             | MobileHeader burger menu                        |

#### BurgerMenu (MobileHeader) Changes

```tsx
// Before (v4.x)
<MobileHeader
  burgerMenu={{
    items: menuItems,
    renderFooter: ({ isCompact }) => <Footer collapsed={isCompact} />,
  }}
/>

// After (v5.0)
<MobileHeader
  burgerMenu={{
    items: menuItems,
    renderFooter: ({ isExpanded }) => <Footer collapsed={!isExpanded} />,
  }}
/>
```

#### Understanding `pinned` vs `isExpanded`

In v5.0, the navigation state is represented by two distinct concepts:

| Concept      | Description                                                                                              | Controllable      |
| ------------ | -------------------------------------------------------------------------------------------------------- | ----------------- |
| `pinned`     | User preference — whether the sidebar should stay expanded                                               | ✅ Yes            |
| `isExpanded` | Visual state — whether the sidebar is currently expanded (can be true on hover even when `pinned=false`) | ❌ No (read-only) |

**Important**: `isExpanded` is an **internal state** managed by the navigation component. It cannot be controlled externally — it is derived from `pinned` and hover/mouse interactions. Use `pinned` prop and `onChangePinned` callback to control the navigation state.

This separation allows for hover-to-expand behavior when `pinned=false`.

#### Context Changes

The `AsideHeaderContext` has been updated:

```typescript
// Before (v4.x)
interface AsideHeaderContextType {
  compact: boolean;
  onChangeCompact?: (compact: boolean) => void;
  // ...
}

// After (v5.0)
interface AsideHeaderContextType {
  pinned: boolean; // User preference (inverted from compact)
  isExpanded: boolean; // Current visual state
  size: number; // Current width in pixels
  onChangePinned?: (pinned: boolean) => void;
  onExpand?: () => void; // Trigger expand (e.g., on mouse enter)
  onFold?: () => void; // Trigger collapse (e.g., on mouse leave)
}
```

**`useAsideHeaderContext` and `useAsideHeaderContextOptional`:**

`useAsideHeaderContext()` throws an error when used outside of `AsideHeaderContext.Provider` (e.g. outside `AsideHeader` or `PageLayout`). Use it when your component must always be rendered inside the provider.

For components that can work with or without the provider (e.g. `FooterItem`), use `useAsideHeaderContextOptional()`, which returns `AsideHeaderContextType | undefined` and does not throw when outside the provider.

#### Migration Examples

**AsideHeader component:**

```tsx
// Before (v4.x)
<AsideHeader
  compact={isCompact}
  onChangeCompact={setIsCompact}
/>

// After (v5.0)
<AsideHeader
  pinned={!isCompact}  // or use new state: pinned={isPinned}
  onChangePinned={setIsPinned}
/>
```

**FooterItem component:**

```tsx
// Before (v4.x)
<FooterItem compact={!isExpanded} />

// After (v5.0)
<FooterItem isExpanded={isExpanded} />
```

**renderFooter callback:**

The `renderFooter` callback now receives additional parameters:

```tsx
// Before (v4.x)
renderFooter={({ compact, size }) => (
  <FooterItem compact={compact} />
)}

// After (v5.0)
renderFooter={({ isExpanded, isPinned, size, asideRef, isCompactMode }) => (
  <FooterItem isExpanded={isExpanded} />
)}
```

| New Parameter   | Type                              | Description                                 |
| --------------- | --------------------------------- | ------------------------------------------- |
| `isExpanded`    | `boolean`                         | Current visual state (replaces `compact`)   |
| `isPinned`      | `boolean`                         | User preference for pinned state            |
| `size`          | `number`                          | Current sidebar width in pixels             |
| `asideRef`      | `React.RefObject<HTMLDivElement>` | Reference to the aside container element    |
| `isCompactMode` | `boolean \| undefined`            | Whether compact item sizing mode is enabled |

**New return type**: Can now return `React.ReactNode[]` (array) for automatic `FooterBar` wrapping with horizontal/vertical layout.

**Logo wrapper:**

```tsx
// Before (v4.x)
logo={{
  wrapper: (node, compact) => <Link>{node}</Link>
}}

// After (v5.0)
logo={{
  wrapper: (node, isExpanded) => <Link>{node}</Link>
}}
```

**collapseButtonWrapper callback:**

```tsx
// Before (v4.x)
collapseButtonWrapper={(button, { compact }) => (
  <Tooltip content={compact ? 'Expand' : 'Collapse'}>{button}</Tooltip>
)}

// After (v5.0)
collapseButtonWrapper={(button, { isExpanded, onChangePinned }) => (
  <Tooltip content={isExpanded ? 'Collapse' : 'Expand'}>{button}</Tooltip>
)}
```

**itemWrapper callback:**

```tsx
// Before (v4.x)
itemWrapper={(params, makeItem, { compact }) => makeItem(params)}

// After (v5.0)
itemWrapper={(params, makeItem, { isExpanded }) => makeItem(params)}
```

The `opts` object in `itemWrapper` now contains:

| Property             | Type                                          | Description                                                                                       |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `isExpanded`         | `boolean`                                     | Current visual state — whether the sidebar is expanded                                            |
| `item`               | `MenuItem`                                    | The menu item being rendered                                                                      |
| `ref`                | `React.RefObject<HTMLElement>`                | Reference to the item element                                                                     |
| `setCollapseBlocker` | `((isBlocked: boolean) => void) \| undefined` | Call with `true` when a popup opens, `false` when it closes, to block sidebar collapse while open |

---

### 3. Deprecated CSS Variables

The following CSS variables have been replaced with zone-specific alternatives:

| Old Variable                                | New Variable                                | Zone   |
| ------------------------------------------- | ------------------------------------------- | ------ |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-top-item-icon-color`            | Top    |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-top-item-current-icon-color`    | Top    |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-bottom-item-icon-color`         | Bottom |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-bottom-item-current-icon-color` | Bottom |

#### Migration Steps

1. **Subheader icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-top-item-icon-color`
2. **Footer icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-bottom-item-icon-color`
3. **Subheader current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-top-item-current-icon-color`
4. **Footer current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-bottom-item-current-icon-color`

---

### Breaking Changes Summary

| Area                     | What Changed                                 | Severity  | Codemod Support |
| ------------------------ | -------------------------------------------- | --------- | --------------- |
| `multipleTooltip` prop   | Completely removed                           | ⚠️ High   | ❌ Manual       |
| `compact` → `pinned`     | Renamed with inverted boolean logic          | ⚠️ High   | ✅ Automatic    |
| `compact` → `isExpanded` | Renamed in FooterItem, MobileLogo, callbacks | ⚠️ High   | ✅ Automatic    |
| Context API              | New fields: `pinned`, `isExpanded`, `size`   | 🟡 Medium | ❌ Manual       |
| `renderFooter`           | Extended parameters, new return type         | 🟡 Medium | ✅ Partial      |
| `collapseButtonWrapper`  | New `onChangePinned` in callback data        | 🟢 Low    | ✅ Partial      |
| CSS variables            | Zone-specific alternatives                   | 🟡 Medium | ❌ Manual       |

---

## New Features

### Zone-Based CSS Variables

Navigation v5.0 introduces zone-based CSS variables for more granular control over styling. The navigation is divided into zones: **Top** (header/subheader area), **Main** (navigation groups), and **Bottom** (footer area).

### Top Zone (Subheader) Variables

New CSS variables for styling items in the Top zone (subheader area):

| Variable                                             | Purpose                      | Fallback                                         |
| ---------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-top-decoration-background-color`         | Decoration/backdrop          | `--gn-aside-item-current-background-color`       |
| `--gn-aside-top-divider-color`                       | Divider below top zone       | `--gn-aside-divider-horizontal-color`            |
| `--gn-aside-top-item-icon-color`                     | Icon color                   | `--gn-aside-item-icon-color`                     |
| `--gn-aside-top-item-current-icon-color`             | Active item icon color       | `--gn-aside-item-current-icon-color`             |
| `--gn-aside-top-item-text-color`                     | Text color                   | `--gn-aside-item-text-color`                     |
| `--gn-aside-top-item-current-text-color`             | Active item text color       | `--gn-aside-item-current-text-color`             |
| `--gn-aside-top-item-background-color`               | Background color             | `transparent`                                    |
| `--gn-aside-top-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-top-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-top-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |

### Main Zone (Group Items) Variables

New CSS variables for styling items inside navigation groups:

| Variable                                                    | Purpose                      | Fallback                                         |
| ----------------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-main-background-color`                          | Main area background         | `transparent`                                    |
| `--gn-aside-main-group-item-background-color`               | Group item background        | Semantic value                                   |
| `--gn-aside-main-group-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-main-group-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-main-group-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |
| `--gn-aside-main-group-border-color-hover`                  | Group border on hover        | `--gn-aside-line-vertical-color-hover`           |
| `--gn-aside-main-group-border-color-current`                | Group border when active     | `--gn-aside-current-line-vertical-color`         |

### Bottom Zone (Footer) Variables

New CSS variables for styling the Bottom zone (footer area):

| Variable                                                | Purpose                      | Fallback                                         |
| ------------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-bottom-background-color`                    | Footer container background  | `--gn-aside-surface-background-color`            |
| `--gn-aside-bottom-divider-color`                       | Divider above footer         | `--gn-aside-divider-horizontal-color`            |
| `--gn-aside-bottom-item-icon-color`                     | Icon color                   | `--gn-aside-item-icon-color`                     |
| `--gn-aside-bottom-item-current-icon-color`             | Active item icon color       | `--gn-aside-item-current-icon-color`             |
| `--gn-aside-bottom-item-text-color`                     | Text color                   | `--gn-aside-item-text-color`                     |
| `--gn-aside-bottom-item-current-text-color`             | Active item text color       | `--gn-aside-item-current-text-color`             |
| `--gn-aside-bottom-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-bottom-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-bottom-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |

### Scrollbar (General) Variables

CSS variables for the navigation menu scrollbar (used by `ScrollableWithScrollbar` in CompositeBar):

| Variable                                  | Purpose                    | Typical fallback                       |
| ----------------------------------------- | -------------------------- | -------------------------------------- |
| `--gn-aside-scrollbar-handle-color`       | Scrollbar thumb color      | `--g-color-private-black-100` or theme |
| `--gn-aside-scrollbar-handle-color-hover` | Thumb color on hover       | `--g-color-private-black-150` or theme |
| `--gn-aside-scrollbar-track-color`        | Scrollbar track background | `transparent`                          |

### Usage Example

```css
.my-app {
  /* Top zone customization */
  --gn-aside-top-item-icon-color: #333;
  --gn-aside-top-item-current-background-color: rgba(0, 100, 255, 0.15);

  /* Main zone (groups) customization */
  --gn-aside-main-group-item-current-background-color: rgba(0, 100, 255, 0.2);
  --gn-aside-main-group-item-background-color-hover: rgba(0, 0, 0, 0.05);

  /* Bottom zone (footer) customization */
  --gn-aside-bottom-item-icon-color: #666;
  --gn-aside-bottom-item-current-background-color: rgba(0, 100, 255, 0.1);
}
```

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install @gravity-ui/navigation@^5.0.0
```

### Step 2: Run Automated Migration

The easiest way to migrate `compact` → `isExpanded` props is to use our codemod:

```bash
# Complete migration (recommended)
npx navigation-codemod v5 src/
```

The codemod automatically handles:

- **Literal values**: `compact={true}` → `isExpanded={false}`
- **Variable references**: `compact={isCompact}` → `isExpanded={!isCompact}`
- **Double negation removal**: `compact={!isExpanded}` → `isExpanded={isExpanded}`
- **Complex expressions**: `compact={a && b}` → `isExpanded={!(a && b)}`
- **Shorthand props**: `compact` → `isExpanded={false}`
- **Destructuring in callbacks**: `({ compact })` → `({ isExpanded })`
- **Callback parameters**: `(node, compact)` → `(node, isExpanded)`
- **Pass-through props**: `compact={compact}` in callbacks → `isExpanded={isExpanded}` (no double inversion)

### Step 3: Manual Updates (if needed)

The codemod handles most cases, but you may need to manually update:

#### Conditional logic using renamed variables

```tsx
// Before (v4.x)
renderFooter={({ compact }) => (
  <div className={compact ? 'collapsed' : 'expanded'}>...</div>
)}

// After codemod (parameter renamed, but ternary logic needs manual fix)
renderFooter={({ isExpanded }) => (
  <div className={isExpanded ? 'expanded' : 'collapsed'}>...</div>  // ← swap branches manually
)}
```

#### Update CSS variable usage

Replace deprecated CSS variables with zone-specific alternatives (see CSS Variables section above).

### Step 4: Verify and Test

1. **TypeScript Compilation**: Ensure all type errors are resolved
2. **Runtime Testing**: Test navigation expand/collapse functionality
3. **Visual Regression**: Check that UI appears correctly in both states

## Codemod Limitations

Our codemod handles most cases automatically, but may not cover:

1. **AsideHeader / PageLayout**: `<AsideHeader compact={...}>` → `<AsideHeader pinned={...}>` and `onChangeCompact` → `onChangePinned` are not automated; migrate these manually (invert the boolean for `compact` → `pinned`).
2. **Conditional expressions using renamed variables**: Ternary operators like `compact ? 'a' : 'b'` need manual logic inversion
3. **Dynamic property access**: `item['compact']`
4. **Computed property names**: `item[propName]`
5. **Spread patterns with compact**: `{...props, compact: true}`
6. **Non-target components**: Only `FooterItem`, `MobileLogo`, and `Item` components are transformed for compact → isExpanded

## Migration Checklist

- [ ] **Dependencies**: Update to @gravity-ui/navigation@^5.0.0
- [ ] **Run Codemod**: Execute `npx navigation-codemod v5 src/` on your codebase
- [ ] **Remove `multipleTooltip`**: Delete any usage of the removed prop
- [ ] **Review Conditionals**: Manually check ternary expressions using renamed variables
- [ ] **Update `renderFooter`**: Check for new parameters and adjust logic if needed
- [ ] **Update `collapseButtonWrapper`**: Adjust callback signature if used
- [ ] **`useAsideHeaderContext`**: Use only inside `AsideHeader`/`PageLayout` (it throws otherwise); use `useAsideHeaderContextOptional()` for optional context
- [ ] **MobileHeader**: Update `BurgerMenuProps.renderFooter` from `isCompact` to `isExpanded`
- [ ] **CSS Variables**: Update deprecated CSS variable names to zone-specific alternatives
- [ ] **Context Usage**: Update any direct usage of `AsideHeaderContext` with new prop names
- [ ] **TypeScript**: Resolve any remaining type errors
- [ ] **Tests**: Update test assertions and mocks
- [ ] **Visual Testing**: Verify navigation works correctly in both expanded and collapsed states
