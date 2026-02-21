## Code Review: PR #577 — feat: added footer context provider

### Summary

This PR replaces `React.cloneElement`-based prop injection in `FooterBar` with a `FooterLayoutContext` provider pattern, allowing `FooterItem` to read `layout` and `isExpanded` from context instead of being explicitly cloned with those props. This is a sound architectural improvement — context is the idiomatic React approach for implicit parent-to-child communication and avoids the fragility of `cloneElement`. However, there are two bugs and a performance issue that should be addressed before merging.

---

### Bug 1: `className` uses raw `layout` prop instead of `effectiveLayout` in `FooterItem.tsx`

**File:** `FooterItem.tsx:35`

```tsx
className={`${b({collapsed: !effectiveIsExpanded, layout})} ${bGlobal()}`}
```

The `layout` variable here is the raw prop destructured from `props`, which will be `undefined` when the layout comes from context (the whole point of this PR). This means the CSS modifier class (e.g., `footer-item_layout_horizontal`) won't be applied for context-provided layouts.

**Should be:**
```tsx
className={`${b({collapsed: !effectiveIsExpanded, layout: effectiveLayout})} ${bGlobal()}`}
```

---

### Bug 2: Dropdown (hidden) items no longer force `isExpanded: true`

**File:** `FooterBar.tsx:68-73`

Previously, `renderChild(child, true)` forced `isExpanded: true` and `layout: 'vertical'` for items rendered inside the overflow dropdown menu. The new code passes children raw:

```tsx
text: child,
```

These dropdown items are rendered **outside** the `FooterLayoutContext.Provider` (which only wraps `visibleChildren`). So `FooterItem` will fall through the resolution chain:

1. `isExpandedProp` → `undefined` (not passed)
2. `footerLayoutCtx?.isExpanded` → `undefined` (no provider)
3. `contextIsExpanded` → `context?.isExpanded ?? true`

In collapsed mode (`AsideHeaderContext.isExpanded === false`), dropdown items will render collapsed (icon-only), when they should **always** show their text inside the dropdown popup. The original code explicitly handled this case.

**Fix options:**
- Wrap the dropdown items in a separate `FooterLayoutContext.Provider` with `{ layout: 'vertical', isExpanded: true }`
- Or keep using `cloneElement` for just the dropdown case

---

### Performance: Context value object should be memoized

**File:** `FooterBar.tsx:88-91`

```tsx
<FooterLayoutContext.Provider
    value={{
        layout: isHorizontal ? 'horizontal' : 'vertical',
        isExpanded,
    }}
>
```

The `value` prop is an inline object literal, creating a new reference on every render. This will trigger re-renders of all context consumers even when `layout` and `isExpanded` haven't changed. Wrap it in `useMemo`:

```tsx
const footerLayoutValue = useMemo(
    () => ({ layout: isHorizontal ? 'horizontal' : 'vertical' as const, isExpanded }),
    [isHorizontal, isExpanded],
);

// ...

<FooterLayoutContext.Provider value={footerLayoutValue}>
```

---

### Minor: Broken comments in stories

**File:** `FooterBar.stories.tsx:65, 102`

Two comments were truncated when removing `layout="horizontal"`:

```tsx
// In horizontal mode (isPinned=true), FooterBar automatically sets  (hides title)
// Horizontal mode with overflow - FooterBar sets for visible items
```

These should be reworded, e.g.:
```tsx
// In horizontal mode (isPinned=true), FooterBar automatically hides the title via context
// Horizontal mode with overflow - FooterBar sets layout via context for visible items
```

---

### API Surface

The PR exports `FooterLayoutContext`, `useFooterLayout`, and `FooterLayoutContextValue` from the public `index.ts`. This is appropriate — it allows consumers who build custom footer components (not using `FooterItem`) to read the layout context. Just be aware this becomes a public API contract.

---

### What looks good

- The overall direction of moving from `cloneElement` to context is correct and more maintainable
- The fallback chain in `FooterItem` (`explicit prop > context > AsideHeaderContext > default`) is well-designed and preserves backward compatibility for consumers who pass `layout`/`isExpanded` directly
- Removing `isValidFooterElement` and `renderChild` simplifies `FooterBar` significantly
- Stories properly updated to no longer pass redundant `layout="horizontal"` props

---

### Summary of required changes

| Severity | Issue | File |
|----------|-------|------|
| 🔴 Bug | `className` uses `layout` instead of `effectiveLayout` | `FooterItem.tsx:35` |
| 🔴 Bug | Dropdown items lose forced `isExpanded: true` | `FooterBar.tsx:68-73` |
| 🟡 Perf | Context value not memoized | `FooterBar.tsx:88-91` |
| 🟢 Nit | Truncated comments in stories | `FooterBar.stories.tsx:65,102` |
