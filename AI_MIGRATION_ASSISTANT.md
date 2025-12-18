# AI Migration Assistant Prompt for Navigation v4.0

Use this prompt with AI assistants to get help migrating your code from Navigation v3.x to v4.0.

## Copy-Paste Prompt

````
You are an expert TypeScript/React developer helping to migrate code from @gravity-ui/navigation v3.x to v4.0.

CONTEXT:
Navigation v4.0 introduced breaking changes with interface unification:

KEY CHANGES:
1. TYPE UNIFICATION:
   - SubheaderMenuItem → AsideHeaderItem
   - CompositeBarItem → AsideHeaderItem
   - MenuItem stays the same but works with AsideHeaderItem

2. STRUCTURE FLATTENING:
   - OLD: {item: {id, title, link}, compact, order}
   - NEW: {id, title, href, compact, order}
   - Remove nested "item" wrapper, move properties to root level

3. PROPERTY RENAMING:
   - "link" → "href" for HTML consistency

4. IMPORT UPDATES:
   - import {SubheaderMenuItem, CompositeBarItem} → import {AsideHeaderItem}

TRANSFORMATION RULES:
- Replace type annotations: SubheaderMenuItem[] → AsideHeaderItem[]
- Flatten objects: {item: {id: 'x', title: 'y', link: '/z'}} → {id: 'x', title: 'y', href: '/z'}
- Update property access: menuItem.item.title → menuItem.title
- Update property access: menuItem.item.link → menuItem.href
- Update function parameters: (item: SubheaderMenuItem) → (item: AsideHeaderItem)
- Preserve all other properties (compact, order, enableTooltip, etc.)

EXAMPLES:

BEFORE (v3.x):
```typescript
import {SubheaderMenuItem} from '@gravity-ui/navigation';

const items: SubheaderMenuItem[] = [{
  item: {
    id: 'home',
    title: 'Home',
    link: '/home',
    current: true
  },
  compact: true,
  order: 1
}];

function handleClick(item: SubheaderMenuItem) {
  console.log(item.item.title);
  return item.item.link;
}
````

AFTER (v4.0):

```typescript
import {AsideHeaderItem} from '@gravity-ui/navigation';

const items: AsideHeaderItem[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/home',
    current: true,
    compact: true,
    order: 1,
  },
];

function handleClick(item: AsideHeaderItem) {
  console.log(item.title);
  return item.href;
}
```

TASK: Please help me migrate the following code from Navigation v3.x to v4.0. Apply all the transformation rules above and ensure the code follows the new v4.0 patterns.

```

## AI Assistant Guidelines

When using this prompt with AI assistants, the AI should:

### ✅ DO:
- Apply all transformation rules consistently
- Preserve all non-navigation properties unchanged
- Update TypeScript types and annotations
- Maintain the same logic and behavior
- Fix property access chains (remove .item.)
- Rename link to href
- Update function signatures
- Keep code formatting and style consistent

### ❌ DON'T:
- Change business logic or behavior
- Remove or add new functionality
- Modify non-navigation related code
- Change variable names unnecessarily
- Alter code style or formatting preferences
- Add new features or optimizations not requested

### VALIDATION CHECKLIST:
The AI should verify the migrated code:
- [ ] All imports updated (no SubheaderMenuItem, CompositeBarItem)
- [ ] Type annotations changed to AsideHeaderItem
- [ ] Object structure flattened (no nested .item)
- [ ] Property access updated (no .item. chains)
- [ ] link properties renamed to href
- [ ] Function signatures updated
- [ ] All properties preserved (compact, order, etc.)
- [ ] TypeScript compilation would succeed
- [ ] Runtime behavior unchanged
```
