# Navigation v5.0 Migration Guide

## CSS Variables Changes

### New Zone-Based CSS Variables

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

## Migration from v4.x

### Deprecated Variables

The following variables have been replaced with zone-specific alternatives:

| Old Variable                                | New Variable                                | Zone   |
| ------------------------------------------- | ------------------------------------------- | ------ |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-top-item-icon-color`            | Top    |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-top-item-current-icon-color`    | Top    |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-bottom-item-icon-color`         | Bottom |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-bottom-item-current-icon-color` | Bottom |

### Migration Steps

1. **Subheader icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-top-item-icon-color`
2. **Footer icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-bottom-item-icon-color`
3. **Subheader current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-top-item-current-icon-color`
4. **Footer current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-bottom-item-current-icon-color`

## Breaking Changes: Prop Renaming (`compact` → `pinned`/`isExpanded`)

The `compact` prop and related APIs have been renamed to use clearer semantics with **inverted boolean logic**.

### Main Prop Changes

| Old Prop/Parameter                            | New Prop/Parameter                         | Notes                                           |
| --------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `compact: boolean`                            | `pinned: boolean`                          | **Inverted!** `compact: true` → `pinned: false` |
| `onChangeCompact`                             | `onChangePinned`                           | Callback receives inverted value                |
| `AsideHeaderItem.compact`                     | `AsideHeaderItem.isExpanded`               | Used by `FooterItem`                            |
| `renderFooter({ compact })`                   | `renderFooter({ isExpanded })`             | Parameter renamed (AsideHeader)                 |
| `collapseButtonWrapper(_, { compact })`       | `collapseButtonWrapper(_, { isExpanded })` | Parameter renamed                               |
| `MenuItem.itemWrapper opts.compact`           | `MenuItem.itemWrapper opts.pinned`         | In itemWrapper callback                         |
| `LogoProps.wrapper(_, compact)`               | `LogoProps.wrapper(_, isExpanded)`         | Second parameter renamed                        |
| `MobileLogoProps.compact`                     | `MobileLogoProps.isExpanded`               | MobileLogo prop renamed                         |
| `BurgerMenuProps.renderFooter({ isCompact })` | `renderFooter({ isExpanded })`             | MobileHeader burger menu                        |

### Context Changes

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
  pinned: boolean; // Note: inverted semantics!
  onChangePinned?: (pinned: boolean) => void;
  // ...
}
```

### Migration Examples

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

```tsx
// Before (v4.x)
renderFooter={({ compact }) => (
  <FooterItem compact={compact} />
)}

// After (v5.0)
renderFooter={({ isExpanded }) => (
  <FooterItem isExpanded={isExpanded} />
)}
```

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

**itemWrapper callback:**

```tsx
// Before (v4.x)
itemWrapper={(params, makeItem, { compact }) => makeItem(params)}

// After (v5.0)
itemWrapper={(params, makeItem, { pinned }) => makeItem(params)}
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

1. **Conditional expressions using renamed variables**: Ternary operators like `compact ? 'a' : 'b'` need manual logic inversion
2. **Dynamic property access**: `item['compact']`
3. **Computed property names**: `item[propName]`
4. **Spread patterns with compact**: `{...props, compact: true}`
5. **Non-target components**: Only `FooterItem`, `MobileLogo`, and `Item` components are transformed

## Migration Checklist

- [ ] **Dependencies**: Update to @gravity-ui/navigation@^5.0.0
- [ ] **Run Codemod**: Execute `compact-to-is-expanded` transform on your codebase
- [ ] **Review Conditionals**: Manually check ternary expressions using renamed variables
- [ ] **CSS Variables**: Update deprecated CSS variable names to zone-specific alternatives
- [ ] **Context Usage**: Update any direct usage of `AsideHeaderContext` with new prop names
- [ ] **TypeScript**: Resolve any remaining type errors
- [ ] **Tests**: Update test assertions and mocks
- [ ] **Visual Testing**: Verify navigation works correctly in both expanded and collapsed states
