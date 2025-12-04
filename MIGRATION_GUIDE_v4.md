# Navigation v4.0 Migration Guide

## Overview

Navigation v4.0 introduces significant breaking changes focused on unifying component interfaces and simplifying the API. This guide will walk you through the migration process step by step.

## Major Changes Summary

### 🔄 Interface Unification

- **Unified Types**: `SubheaderMenuItem` and `CompositeBarItem` → `AsideHeaderItem`
- **Flat Structure**: Removed nested `item` wrapper structure
- **Consistent Naming**: `link` → `href` for HTML consistency

## Breaking Changes Details

### 1. Type Unification

#### Before (v3.x)

```typescript
import {
  SubheaderMenuItem,
  CompositeBarItem,
  MenuItem
} from '@gravity-ui/navigation';

// Three different types for similar items
const subheaderItems: SubheaderMenuItem[] = [...];
const compositeItems: CompositeBarItem[] = [...];
const menuItems: MenuItem[] = [...];
```

#### After (v4.0)

```typescript
import {AsideHeaderItem} from '@gravity-ui/navigation';

// Single unified type
const subheaderItems: AsideHeaderItem[] = [...];
const compositeItems: AsideHeaderItem[] = [...];
const menuItems: AsideHeaderItem[] = [...];
```

### 2. Structure Flattening

The most significant change is removing the nested `item` wrapper:

#### Before (v3.x) - Nested Structure

```typescript
const menuItem: SubheaderMenuItem = {
  // Properties related to display/behavior
  compact: true,
  order: 1,
  enableTooltip: true,
  bringForward: false,

  // Actual item data nested inside
  item: {
    id: 'dashboard',
    title: 'Dashboard',
    link: '/dashboard',
    current: true,
    icon: DashboardIcon,
    // ... other item properties
  },
};

// Accessing nested properties
console.log(menuItem.item.id);
console.log(menuItem.item.title);
console.log(menuItem.item.link);
```

#### After (v4.0) - Flat Structure

```typescript
const menuItem: AsideHeaderItem = {
  // All properties at the same level
  id: 'dashboard',
  title: 'Dashboard',
  href: '/dashboard', // note: link → href
  current: true,
  icon: DashboardIcon,
  compact: true,
  order: 1,
  enableTooltip: true,
  bringForward: false,
  // ... other properties
};

// Direct property access
console.log(menuItem.id);
console.log(menuItem.title);
console.log(menuItem.href);
```

### 3. Property Renaming

#### `link` → `href`

For consistency with HTML anchor element standards:

```typescript
// Before
const item = {
  item: {
    link: '/profile',
  },
};

// After
const item = {
  href: '/profile',
};
```

### 4. Function Signatures

#### Event Handlers

```typescript
// Before
function handleItemClick(
  item: MenuItem,
  collapsed: boolean,
  event: React.MouseEvent<HTMLElement, MouseEvent>,
) {
  console.log(`Clicked: ${item.title}`);
  window.location.href = item.link;
}

// After
function handleItemClick(
  item: AsideHeaderItem,
  collapsed: boolean,
  event: React.MouseEvent<HTMLElement, MouseEvent>,
) {
  console.log(`Clicked: ${item.title}`);
  window.location.href = item.href;
}
```

#### Component Props

```typescript
// Before
interface SidebarProps {
  headerItems: SubheaderMenuItem[];
  compositeItems: CompositeBarItem[];
}

// After
interface SidebarProps {
  headerItems: AsideHeaderItem[];
  compositeItems: AsideHeaderItem[];
}
```

### 5. Context Changes

#### AsideHeaderContext

```typescript
// Before
interface AsideHeaderInnerContextType {
  menuItems: MenuItem[];
  onItemClick: (item: MenuItem, collapsed: boolean, event: MouseEvent) => void;
}

// After
interface AsideHeaderInnerContextType {
  menuItems: AsideHeaderItem[];
  onItemClick: (item: AsideHeaderItem, collapsed: boolean, event: MouseEvent) => void;
}
```

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install @gravity-ui/navigation@^4.0.0
```

### Step 2: Run Automated Migration

The easiest way is to use our codemods:

```bash
# Complete migration (recommended)
npx navigation-codemod v4 src/

# Or run step by step
npx navigation-codemod unify-interfaces src/
npx navigation-codemod link-to-href src/
```

### Step 3: Manual Updates (if needed)

#### Update Imports

```typescript
// Before
import {SubheaderMenuItem, CompositeBarItem} from '@gravity-ui/navigation';

// After
import {AsideHeaderItem} from '@gravity-ui/navigation';
```

#### Flatten Object Structure

```typescript
// Before
const items = [
  {
    item: {id: '1', title: 'Home', link: '/'},
    compact: true,
  },
];

// After
const items = [
  {
    id: '1',
    title: 'Home',
    href: '/',
    compact: true,
  },
];
```

#### Update Property Access

```typescript
// Before
items.forEach((menuItem) => {
  console.log(menuItem.item.title);
  if (menuItem.item.current) {
    // handle current item
  }
});

// After
items.forEach((menuItem) => {
  console.log(menuItem.title);
  if (menuItem.current) {
    // handle current item
  }
});
```

### Step 4: Update Component Usage

#### AsideHeader Component

```typescript
// Before
<AsideHeader
  subheaderItems={subheaderItems}  // SubheaderMenuItem[]
  menuItems={menuItems}            // MenuItem[]
  onMenuItemsChanged={(items: MenuItem[]) => setMenuItems(items)}
/>

// After
<AsideHeader
  subheaderItems={subheaderItems}  // AsideHeaderItem[]
  menuItems={menuItems}            // AsideHeaderItem[]
  onMenuItemsChanged={(items: AsideHeaderItem[]) => setMenuItems(items)}
/>
```

#### CompositeBar Component

```typescript
// Before
<CompositeBar
  type="subheader"
  items={items as SubheaderMenuItem[]}
  onItemClick={(item: MenuItem) => handleClick(item)}
/>

// After
<CompositeBar
  type="subheader"
  items={items as AsideHeaderItem[]}
  onItemClick={(item: AsideHeaderItem) => handleClick(item)}
/>
```

### Step 5: Verify and Test

1. **TypeScript Compilation**: Ensure all type errors are resolved
2. **Runtime Testing**: Test navigation functionality
3. **Visual Regression**: Check that UI appears correctly

## Common Migration Patterns

### Pattern 1: Array Processing

```typescript
// Before
const processItems = (items: SubheaderMenuItem[]) => {
  return items.map((menuItem) => ({
    id: menuItem.item.id,
    url: menuItem.item.link,
    label: menuItem.item.title,
    isActive: menuItem.item.current,
  }));
};

// After
const processItems = (items: AsideHeaderItem[]) => {
  return items.map((menuItem) => ({
    id: menuItem.id,
    url: menuItem.href,
    label: menuItem.title,
    isActive: menuItem.current,
  }));
};
```

### Pattern 2: Filtering and Searching

```typescript
// Before
const findItemById = (items: CompositeBarItem[], id: string) => {
  return items.find((item) => item.item.id === id);
};

const activeItems = items.filter((item) => item.item.current);

// After
const findItemById = (items: AsideHeaderItem[], id: string) => {
  return items.find((item) => item.id === id);
};

const activeItems = items.filter((item) => item.current);
```

### Pattern 3: Dynamic Item Creation

```typescript
// Before
const createMenuItem = (data: any): SubheaderMenuItem => ({
  item: {
    id: data.id,
    title: data.name,
    link: data.url,
    current: data.active,
  },
  compact: data.isCompact,
  order: data.position,
});

// After
const createMenuItem = (data: any): AsideHeaderItem => ({
  id: data.id,
  title: data.name,
  href: data.url,
  current: data.active,
  compact: data.isCompact,
  order: data.position,
});
```

### Codemod Limitations

Our codemods handle most cases automatically, but may not cover:

1. **Dynamic property access**: `menuItem['item']['title']`
2. **Computed property names**: `menuItem[itemKey][titleKey]`
3. **Complex destructuring patterns**
4. **Runtime property checks**: `if ('item' in menuItem)`

## AI Migration Assistant (Recommended)

For complex migration cases that codemods can't handle, you can use AI assistants with our specialized prompt.

### How to Use AI Migration

See `AI_MIGRATION_ASSISTANT.md` for the complete copy-paste prompt and detailed instructions.

## Migration Checklist

- [ ] **Dependencies**: Update to @gravity-ui/navigation@^4.0.0
- [ ] **Codemods or AI Assistance (Recommended)**: Run automated migration tools
- [ ] **Imports**: Update type imports (`SubheaderMenuItem` → `AsideHeaderItem`)
- [ ] **Types**: Update TypeScript annotations
- [ ] **Property Access**: Remove `.item.` from property chains
- [ ] **Property Names**: Change `link` to `href`
- [ ] **Event Handlers**: Update function signatures
- [ ] **Component Props**: Update prop types
- [ ] **Tests**: Update test assertions and mocks
- [ ] **Documentation**: Update internal documentation
- [ ] **Code Review**: Review changes for completeness
