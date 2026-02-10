# Code Review: PR #569 — feat: implement scrollbar for composite bar

**PR:** https://github.com/gravity-ui/navigation/pull/569
**Author:** kkirik
**Base:** v5
**Head:** feat/scrollbar

---

## Summary

This PR replaces the hidden native scrollbar in `CompositeBar` with a custom `ScrollableWithScrollbar` component. It introduces three CSS variables for theming the scrollbar (`--gn-aside-scrollbar-handle-color`, `--gn-aside-scrollbar-handle-color-hover`, `--gn-aside-scrollbar-track-color`) and adds a `useScrollbar` hook to manage drag, click, and resize interactions.

**Files changed:** 8 (3 new, 5 modified) | +279 / -13 lines

---

## Issues

### 1. [Bug] Unstable default `recalcDeps` causes unnecessary effect re-runs

**Files:** `ScrollableWithScrollbar.tsx:20`, `useScrollbar.ts:16`

Both the component and the hook declare `recalcDeps = []` as a default parameter. A new array literal is created on every render, so when it is spread into the `useEffect` dependency array at `useScrollbar.ts:48`, React sees a different reference each time and re-runs the effect. This causes:

- A new `ResizeObserver` to be created and destroyed every render
- Unnecessary `updateScrollState` calls

**Suggestion:** Extract a module-level constant:

```ts
const EMPTY_DEPS: React.DependencyList = [];
```

and use it as the default in both places, or pass the constant from a single location.

---

### 2. [Bug] Spreading `recalcDeps` into the useEffect dependency array

**File:** `useScrollbar.ts:48`

```ts
useEffect(() => {
    // ...
}, [updateScrollState, ...recalcDeps]);
```

Spreading a dynamic array into a dependency list is an ESLint `react-hooks/exhaustive-deps` violation and is explicitly discouraged by the React team. The number and identity of dependencies can change between renders, which makes the hook behavior unpredictable and can mask stale-closure bugs.

**Suggestion:** Consider one of:
- Accept a single primitive dependency (e.g., `itemCount: number`) and include it directly in the dependency array.
- Use a "version" counter that consumers increment when recalculation is needed.
- Observe the scroll container's children via `MutationObserver` instead of relying on caller-provided deps.

---

### 3. [Accessibility] Incomplete ARIA attributes for `role="scrollbar"`

**File:** `ScrollableWithScrollbar.tsx:42-45`

Per [WAI-ARIA scrollbar role](https://www.w3.org/TR/wai-aria-1.2/#scrollbar), the following are **required**:

| Attribute | Status | Note |
|---|---|---|
| `role="scrollbar"` | Present | |
| `aria-controls` | **Missing** | Must reference the ID of the scrollable container |
| `aria-valuenow` | Present | |
| `aria-valuemin` | Present | |
| `aria-valuemax` | Present | |
| `aria-orientation` | **Missing** | Should be `"vertical"` (defaults to `"vertical"` per spec but explicit is better) |

Additionally:
- The scrollbar element has no `tabIndex` and cannot receive keyboard focus.
- There are no keyboard event handlers (`ArrowUp`/`ArrowDown`, `PageUp`/`PageDown`, `Home`/`End`), so keyboard-only users cannot interact with the scrollbar.

**Suggestion:** Add `aria-controls` pointing to the scrollable inner div (give it a stable `id`), add `aria-orientation="vertical"`, and consider adding basic keyboard support or at minimum `tabIndex={0}` so the scrollbar is focusable.

---

### 4. [Bug] `updateScrollState` on scroll is synchronous setState in a scroll handler

**File:** `useScrollbar.ts:25-35`, used via `onScroll` at `ScrollableWithScrollbar.tsx:35`

`onScroll` fires at high frequency during scrolling. Each call triggers `setScrollState` which causes a full re-render. This can create visible jank on lower-end devices, especially if the children tree is large.

**Suggestion:** Either:
- Throttle or debounce `updateScrollState` (the codebase already has a `debounceFn` utility used in `useOverflowingHorizontalListItems`).
- Move thumb position calculation into a `requestAnimationFrame` callback.
- Use a ref to track scroll position and only update state for `showScrollbar` changes, while driving the thumb `transform` imperatively via `ref.current.style.transform`.

---

### 5. [Performance] Thumb position and height are recalculated on every render

**File:** `useScrollbar.ts:106-120`

The `thumbRatio`, `thumbHeight`, `trackHeight`, `thumbMaxTop`, and `thumbTop` values are computed as bare expressions in the hook body — so they run on every render, even when scroll state hasn't changed. This is minor for pure math, but combined with issue #4 (frequent re-renders), it adds up.

**Suggestion:** Wrap in `useMemo` keyed on `scrollState`, or better yet, adopt the imperative approach from issue #4.

---

### 6. [Bug] Event listener leak if component unmounts during drag

**File:** `useScrollbar.ts:50-90`

`handleThumbMouseDown` attaches `mousemove` and `mouseup` listeners to `document`. If the component unmounts while dragging (e.g., navigation collapse, route change), the `onMouseUp` cleanup never fires, leaving dangling listeners.

**Suggestion:** Track the mousemove/mouseup handlers in a ref and clean them up in a `useEffect` return. For example:

```ts
const listenersRef = useRef<{move?: (e: MouseEvent) => void; up?: () => void}>({});

useEffect(() => {
    return () => {
        if (listenersRef.current.move) {
            document.removeEventListener('mousemove', listenersRef.current.move);
        }
        if (listenersRef.current.up) {
            document.removeEventListener('mouseup', listenersRef.current.up);
        }
    };
}, []);
```

---

### 7. [UX] Scrollbar thumb has no border-radius

**File:** `ScrollableWithScrollbar.module.scss:43-61`

The thumb has no `border-radius` property, so it renders as a sharp rectangle. Most custom scrollbar implementations use a rounded thumb for a more polished look. Compare with the Gravity UI design system's general rounded aesthetic.

**Suggestion:** Add `border-radius: var(--g-spacing-1)` or similar to `__scrollbar-thumb`.

---

### 8. [UX] No hover/fade behavior — scrollbar is always visible

**File:** `ScrollableWithScrollbar.tsx:39`, `ScrollableWithScrollbar.module.scss`

When content is scrollable, the custom scrollbar is permanently visible. Native OS scrollbars and most custom implementations auto-hide and show on hover or scroll activity. A permanently visible thin bar in the navigation may be distracting.

**Suggestion:** Consider adding an opacity transition that shows the scrollbar on container hover or during active scrolling, and fades it out otherwise.

---

### 9. [Docs] Migration guide lists incorrect fallback values

**File:** `MIGRATION_GUIDE_v5.md:310-311`

The migration guide says the fallback for `--gn-aside-scrollbar-handle-color` is `--g-color-private-black-100` and for hover is `--g-color-private-black-150`. However, the actual SCSS uses `var(--g-color-line-generic-solid)` as the fallback.

```scss
background: var(--gn-aside-scrollbar-handle-color, var(--g-color-line-generic-solid));
```

This mismatch will confuse consumers trying to match the default appearance.

**Suggestion:** Update the migration guide to reflect the actual fallback (`--g-color-line-generic-solid`).

---

### 10. [Design] Consider using native scrollbar styling or an existing library

Before shipping a 200+ line custom scrollbar implementation, it's worth considering alternatives:

- **CSS `scrollbar-width: thin` + `scrollbar-color`**: Supported in all modern browsers (Firefox, Chrome 121+, Safari 18+). Provides themed, thin scrollbars with zero JS.
- **Gravity UI's own scrollbar utilities**: Check if `@gravity-ui/uikit` already provides scrollbar primitives.

A custom implementation introduces maintenance burden (accessibility, touch support, RTL, high-DPI, different OS behaviors) that native or library solutions handle automatically.

---

### 11. [Missing] No touch/pointer event support

**File:** `useScrollbar.ts:50-90`

The drag implementation uses `mousedown`/`mousemove`/`mouseup` events only. This means:
- Touch/mobile users cannot drag the thumb.
- Pen/stylus input may not work depending on browser.

**Suggestion:** Use `PointerEvent` APIs (`pointerdown`, `pointermove`, `pointerup`) with `setPointerCapture` for unified input handling, or add parallel `touchstart`/`touchmove`/`touchend` handlers.

---

### 12. [Minor] Missing `index.ts` barrel export

The new `ScrollableWithScrollbar` directory doesn't have an `index.ts` re-export file. While it's only consumed internally right now, the rest of the component directories in the codebase generally follow the pattern of having barrel exports. This is minor and up to team convention.

---

## What Looks Good

- Clean separation between the hook (`useScrollbar`) and the component (`ScrollableWithScrollbar`).
- Proper CSS variable naming following the `--gn-aside-*` convention with sensible fallbacks.
- `ResizeObserver` usage for tracking container size changes.
- Documentation updates across migration guide, English README, and Russian README.
- The track click handler correctly prevents double-firing by checking `e.target !== e.currentTarget`.

---

## Verdict

The PR has a good structural foundation but has several issues that should be addressed before merging:

- **Must fix:** #1 (unstable default), #2 (spread deps), #3 (accessibility), #6 (event listener leak), #9 (incorrect docs)
- **Should fix:** #4 (scroll perf), #8 (always-visible scrollbar), #11 (touch support)
- **Consider:** #5 (useMemo), #7 (border-radius), #10 (native alternative), #12 (barrel export)

I recommend requesting changes on this PR.
