# Code Review: PR #574 — feat: filter redundant dividers

**PR:** https://github.com/gravity-ui/navigation/pull/574
**Base branch:** v5
**Author:** olaslo
**Commit:** `4cdf12c` — feat: filter redundant dividers

---

## Summary

This PR moves the hidden-item filtering logic out of the `CompositeBar` component and into the `useGroupedMenuItems` hook, and adds new utility functions to filter redundant dividers (consecutive, leading, and trailing dividers). The goal is to prevent visual artifacts when hidden items cause dividers to stack up or appear at the edges of the menu.

### Files changed (3 files, +80 / -15)

| File | Changes |
|------|---------|
| `src/components/AsideHeader/components/CompositeBar/utils.ts` | +70 — new filtering utilities |
| `src/components/AsideHeader/components/CompositeBar/CompositeBar.tsx` | +4 / -15 — removed inline filtering |
| `src/components/AsideHeader/components/AllPagesPanel/useGroupedMenuItems.ts` | +6 / -1 — calls new filtering |

---

## Architecture & Approach

The PR takes a reasonable approach: instead of filtering hidden items at render time inside `CompositeBar`, the filtering is moved upstream into the data-preparation hook (`useGroupedMenuItems`). This consolidates both visibility filtering and divider cleanup into one place, which is a step toward cleaner separation of concerns.

**Positive aspects:**
- The filtering functions (`filterConsecutiveDividers`, `filterLeadingAndTrailingDividers`, `filterRedundantDividers`) are well-decomposed and individually clear.
- The `useGroupedMenuItems` hook is a natural place to apply this logic since it already builds the flat list of menu items.
- Edit mode is correctly exempted — dividers should remain visible when users are rearranging items.

---

## Issues

### 1. [Medium] `CompositeBar` no longer filters hidden items — contract change

**Location:** `CompositeBar.tsx:273`

Before this PR, `CompositeBar` was a self-contained component that filtered out hidden items from whatever `items` it received. After this PR, `CompositeBar` blindly renders everything passed to it, relying entirely on callers to pre-filter.

This is a **breaking contract change**. If any caller passes items with `hidden: true`, they will now be rendered. While the current callers in the codebase (`FirstPanel`, `Header`) go through `useGroupedMenuItems` (which does the filtering), this is a public component that external consumers could use. The change also means `CompositeBarView` (which is exported) no longer has any hidden-item protection either.

**Suggestion:** Either:
- Document this contract change clearly (e.g., in the component's JSDoc), or
- Keep a lightweight hidden-item filter in `CompositeBar` as a safety net, and do the divider-specific filtering upstream only.

### 2. [Medium] Duplicate hidden-item filtering in `getVisibleItemsWithFilteredDividers`

**Location:** `utils.ts:82-89`

`getVisibleItemsWithFilteredDividers` filters `.hidden` items:
```ts
const visible = items
    .filter((item) => !item.hidden)
    .map((item) => ({
        ...item,
        items: 'items' in item && item.items
            ? filterRedundantDividers(item.items.filter((nested) => !nested.hidden))
            : [],
    }));
```

But `useGroupedMenuItems` already filters hidden items at lines 15-21 (top-level) and line 73 (group items). So hidden-item filtering happens **twice** for the normal code path. This isn't harmful functionally, but it is confusing — a reader may think the first filter is insufficient, or may be unsure which layer is responsible for the hidden-item concern.

**Suggestion:** Pick one layer to own the hidden-item filtering and document the expectation. If `getVisibleItemsWithFilteredDividers` is meant to be usable independently, the duplication is acceptable, but it should be documented.

### 3. [Medium] `getVisibleItemsWithFilteredDividers` overwrites `items` with an empty array for non-group items

**Location:** `utils.ts:84-90`

```ts
.map((item) => ({
    ...item,
    items:
        'items' in item && item.items
            ? filterRedundantDividers(item.items.filter((nested) => !nested.hidden))
            : [],
}));
```

When the item is a plain `MenuItem` (not a `GroupedMenuItem`), the `'items' in item` check is false, and the result assigns `items: []` to the spread object. This adds an `items` property that wasn't there before, which effectively mutates the shape of the object. Downstream code that checks `'items' in item` to distinguish `MenuItem` from `GroupedMenuItem` would then incorrectly classify plain menu items as grouped items with zero children.

This is the same pattern as the old `CompositeBar` code, so it's not a regression per se — but moving it to a utility function that's called from a data-preparation layer makes the shape mutation more concerning since the output is now stored in a `useMemo` and shared.

**Suggestion:** Only spread `items` when the original item actually has it:
```ts
.map((item) => {
    if ('items' in item && item.items) {
        return {
            ...item,
            items: filterRedundantDividers(item.items.filter((nested) => !nested.hidden)),
        };
    }
    return item;
});
```

### 4. [Low] `filterConsecutiveDividers` is exported but unused outside this file

**Location:** `utils.ts:40`

`filterConsecutiveDividers` is exported but only called by `filterRedundantDividers` within the same file. If it's only an internal implementation detail, it doesn't need to be exported.

**Suggestion:** Remove the `export` keyword, or add it intentionally for testing purposes (and add the tests).

### 5. [Low] No unit tests for the new filtering logic

The new utility functions (`filterConsecutiveDividers`, `filterLeadingAndTrailingDividers`, `filterRedundantDividers`, `getVisibleItemsWithFilteredDividers`) have no unit tests. These are pure functions with well-defined edge cases that are ideal candidates for unit testing:

- Empty array input
- All dividers
- Single non-divider item
- Consecutive dividers in the middle
- Leading/trailing dividers
- Only an ALL_PAGES_ID item with dividers
- Nested group items with dividers

**Suggestion:** Add unit tests. These are pure functions and trivial to test.

### 6. [Low] Cross-module dependency: `utils.ts` imports `ALL_PAGES_ID` from `AllPagesPanel`

**Location:** `utils.ts:4`

`CompositeBar/utils.ts` now imports from `AllPagesPanel/constants.ts`. This creates a dependency from a general-purpose utility module to a specific feature module. If `filterRedundantDividers` is meant to be a reusable utility, coupling it to `ALL_PAGES_ID` is conceptually questionable.

**Suggestion:** Consider passing the "special item IDs to ignore" as a parameter, or move the ALL_PAGES-specific logic to the call site. Alternatively, if this coupling is acceptable for the project, document it.

### 7. [Nit] `items?.length` optional chaining is unnecessary after null check

**Location:** `CompositeBar.tsx:279`

```tsx
if (!items || items.length === 0) {
    return null;
}
// ...
recalcDeps={[items?.length]}
```

After the early return, `items` is guaranteed to be defined. The `?.` is unnecessary and slightly misleading.

**Suggestion:** Change to `items.length`.

---

## Verdict

The PR addresses a real visual problem (redundant dividers when items are hidden) and the utility functions are well-structured. However, there are a few concerns:

1. The removal of hidden-item filtering from `CompositeBar` is a silent contract change that could affect external consumers.
2. The `.map()` in `getVisibleItemsWithFilteredDividers` mutates item shapes by adding `items: []` to non-group items.
3. No unit tests for the new pure utility functions.

**Recommendation:** Request changes to address issues #1 and #3 at minimum; #2 and #3 are also worth fixing before merge.
