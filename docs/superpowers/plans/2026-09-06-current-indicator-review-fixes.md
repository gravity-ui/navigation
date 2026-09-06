# Current Indicator Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the validated current-indicator review findings without changing public APIs or rebuilding the layout coordinator.

**Architecture:** Share DOM identity and section definitions; keep identity-only reads separate from geometry snapshots. AsideLayoutTransition owns the union lifetime of indicator transfers and native surface paint, with a small observer helper for DOM subscription and linear identity comparison. Indicator layers and native geometry remain independent of CSS-variable-based paint suppression.

**Tech Stack:** React 18, TypeScript, SCSS modules, WAAPI, MutationObserver, Jest, Playwright Chromium/WebKit.

## Global Constraints

- Work only in `/private/tmp/navigation-aside-transition`, branch `feat/aside-layout-transition`, base `dd8eb37f`; preserve the main checkout and retained worktree.
- No commit, amend, push, merge, baseline update, dependency changes, or unrelated source edits during this correction task. Deliver the verified working-tree diff.
- Follow the approved `docs/superpowers/specs/2026-09-06-aside-current-indicator-design.md`, including its review corrections.
- The observer is alive iff there are active indicator transfers or entries in `surfacePaint`, including transitions that never create an indicator. The coordinator is the only lifetime/disconnect owner; common cancel and unmount always disconnect.
- Observe the panel with subtree/childList and filtered identity attributes; observe its immediate parent with childList only. Content outside the panel must not trigger identity capture. Identity validation performs no geometry/computed-style reads.
- No global native paint reset. Cancel only affected surfaces on semantic changes; keep unrelated hover paint and layout animations. Remove settled paint entries with generation guards.
- Native surface geometry continues while indicator paint suppression is active. Before the ordinary reversal snapshot, restore native paint after saving the moving indicator, so fallback cannot capture suppression-induced transparent.
- Use CSS variables for all affected native current/hover backgrounds and suppression; no `!important` in Item.module.scss.
- LTR and RTL layers match both horizontal scrollport boundaries, and add no scrollWidth/scrollHeight or footer overflow change. Existing static appearance and PNG baselines remain unchanged.
- Existing build duplicate-mock/ts-jest warnings and 42 lint warnings are baseline evidence, not new failures. Do not claim build success without a successful build process.

---

### Task 1: Shared identity, stable keys, RTL layer and variable-only suppression

**Files:**

- Create `src/components/AsideHeader/components/PageLayout/currentIndicatorDom.ts` for shared selectors/attributes and section identity.
- Modify `src/components/AsideHeader/components/PageLayout/currentIndicatorModel.ts` and its `__tests__/currentIndicatorModel.test.ts`.
- Modify `src/components/AsideHeader/components/PageLayout/CurrentIndicatorTransition.ts` for layer coordinates and shared constants only.
- Modify `src/components/AsideHeader/components/PageLayout/AsideLayoutTransition.tsx` for shared section keys/selectors only.
- Modify `src/components/AsideHeader/components/CompositeBar/Item/Item.tsx`, `Item.module.scss` and existing metadata tests as needed for shared constants/CSS contract.
- Modify `src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx` and `__playwright__/CurrentIndicatorExample.tsx` only for RTL and suppression regressions.

**Interfaces:**

```ts
// currentIndicatorDom.ts, import existing COMPOSITE_BAR_ITEM_ID_ATTRIBUTE rather than repeat it
export const CURRENT_ROW_SELECTOR = `[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}]`;
export const CURRENT_IDS_ATTRIBUTE = 'data-gn-aside-current-ids';
export const SURFACE_SELECTOR = '[data-gn-aside-part="surface"]';
export const CURRENT_SUPPRESSED_ATTRIBUTE = 'data-gn-aside-current-suppressed';
export const CURRENT_GHOST_SUPPRESSED_ATTRIBUTE = 'data-gn-aside-current-ghost-suppressed';
export const CURRENT_ROW_KEY_ATTRIBUTE = 'data-gn-aside-current-row-key';
export function getCompositeBarSection(element: HTMLElement, fallback = 'footer'): string {
  return element.closest('[id^="gravity-ui/navigation-"][id$="-composite-bar"]')?.id ?? fallback;
}

// currentIndicatorModel.ts
export type CurrentIdentity = {
  key: string;
  section: string;
  rowId: string;
  currentIds: string[];
  row: HTMLElement;
  surface: HTMLElement;
};
export type CurrentIdentitySnapshot = Map<HTMLElement, CurrentIdentity>;
export type CurrentPresentation = CurrentIdentity & {
  rect: DOMRect;
  color: string;
  radius: string;
  inFlight?: boolean;
};
export function captureCurrentIdentity(panel: HTMLElement): CurrentIdentitySnapshot;
export function captureCurrentPresentation(
  panel: HTMLElement,
  identities?: CurrentIdentitySnapshot,
): CurrentSnapshot;
```

Preserve existing matching semantics, including distinct duplicate representatives and ambiguous selections. `captureCurrentIdentity` reads only semantic DOM attributes and surface references; `captureCurrentPresentation` explicitly measures each identity and returns the existing presentation map. The optional identities argument lets Task 2 reuse a capture without another DOM traversal.

- [x] Write identity tests that spy on getBoundingClientRect/getComputedStyle: identity capture returns stable row/surface/key/current without invoking either; presentation capture still records the actual rect and color. Assert same bar/row keys despite UIKit wrapper index changes and distinct section keys for quick access. Run the focused model suite RED.
- [x] Add a browser RTL regression using the opaque CurrentIndicatorExample. For collapse and expand, pause at 0/50/90%, require the layer's left and right to equal the scrollport bounds, verify visible selection paint across the expected clipped pill, and compare scrollWidth/scrollHeight/footer state with the layer enabled and disabled. Explicitly assert the compact host is narrower than the scrollport. Run RED before layer changes.
- [x] Implement the shared constants, stable section helper and separate identity/presentation paths. Replace all three loose section lookups in coordinator rows/groups/dividers, preserving each caller's fallback. Add a coordinator regression with a root row moving from wrapper item-0 to item-1: it must receive transform keyframes, not only a fade-in plus ghost.
- [x] Implement the horizontal layer frame using both scrollport edges and correct local coordinates:

```ts
const layerLeft = (scrollRect?.left ?? hostRect.left) - hostRect.left;
const layerWidth = (scrollRect?.right ?? hostRect.right) - (scrollRect?.left ?? hostRect.left);
// layer.style.left = `${layerLeft}px`; layer.style.width = `${Math.max(0, layerWidth)}px`;
// frame.left = `${presentation.rect.left - hostRect.left - layerLeft}px`;
```

Retain vertical content bounds and clipping. If RTL overflow checks fail, investigate the actual scrollable overflow origin before changing containment; do not loosen the invariant or clip the real lists.

- [x] Convert compact current/hover rules at the end of Item.module.scss to assign the inherited `--_--row-surface-color` on the row, like expanded rules. Suppression sets that variable locally on the surface, overriding inheritance without specificity escalation:

```scss
&__surface {
  background-color: var(--_--row-surface-color);
  &:global([data-gn-aside-current-suppressed]),
  &:global([data-gn-aside-current-ghost-suppressed]) {
    --_--row-surface-color: transparent;
  }
}
```

- [x] Run existing opaque native/ghost paint checks in both directions, and compact current+hover styling checks (including an actual hovered participating row). Run focused model/coordinator Jest, typecheck, changed-file eslint/stylelint and browser regressions GREEN. Record exact RED/GREEN commands/results in the task report. No stage/commit.
- [x] Task-scoped review must pass before Task 2.

### Task 2: Coordinator-owned union observer, independent geometry and correct fallback snapshots

**Files:**

- Create `src/components/AsideHeader/components/PageLayout/CurrentPresentationObserver.ts` and `__tests__/CurrentPresentationObserver.test.ts`.
- Modify `src/components/AsideHeader/components/PageLayout/CurrentIndicatorTransition.ts`, `AsideLayoutTransition.tsx` and their existing unit tests.
- Consume Task 1's `currentIndicatorDom.ts`, `CurrentIdentitySnapshot` and capture functions; extend their focused tests only if needed.

**Interfaces:**

Task 1 produces `captureCurrentIdentity(panel)` and `captureCurrentPresentation(panel, identities?)`. The observer helper only encapsulates subscription and linear metadata diff; the coordinator supplies its lifecycle. Use a callback carrying the identity snapshot and changed surface references:

```ts
type IdentityChange = (
  identities: CurrentIdentitySnapshot,
  changedSurfaces: Set<HTMLElement>,
) => void;
// The helper's public observe/disconnect operations are invoked only by the coordinator.
// Indicator validation accepts the already captured identity snapshot, never recaptures geometry.
// Indicator exposes whether transfers exist and notifies the coordinator when the set changes.
```

The exact helper method names may follow nearby conventions; no public component API changes. Keep the coordinator focused on ordering, timing and cleanup, not a new DOM walker. A single method reconciles observer liveness against `currentIndicator.hasActiveTransfers || surfacePaint.size > 0`; call it after initial effect construction and membership changes. No `release()`-owned disconnect and no observer inside the indicator module.

- [x] Add failing observer tests: an unrelated content child mutation does not callback; a panel current/row/surface replacement does; validation uses neither geometry nor style; same identity does not cancel paint. Compare snapshots by `Map<HTMLElement, CurrentIdentity>` and current-ID sets, not nested scans of all rows. Parent removal/replacement is detected by parent childList observation.
- [x] Add coordinator regressions before production changes: (a) compact with native paint but no transfers followed by child current change cancels affected paint; (b) cancellation of the last transfer leaves unrelated hover paint running and a later current change still cancels its obsolete effect; (c) empty union/settlement/cancel/unmount disconnect, including stale settled promises after reversal; (d) participating surfaces have geometry keyframes but no color keyframes.
- [x] Add a real React batched-update regression for reversal/fallback: save a moving transfer, reverse compact while producing ambiguous current in the target DOM, and assert ordinary surface paint does not start from suppression-induced transparent. Use CSS or mocked computed-style deliberately sensitive to the suppression attribute so the test catches the actual bug, not jsdom's missing SCSS. Run all new focused regressions RED and record why each fails.
- [x] Move identity observation out of CurrentIndicatorTransition. Initialize baseline identity once from the target snapshot; reuse it for match/start/observer. Indicator `validate(panel, identities)` only validates its active targets and releases invalid transfers. The helper computes changed native surfaces in linear time (per-row IDs may be set-compared). It observes the panel and immediate parent only; ignore parent childList records unrelated to the panel itself.
- [x] Remove the unconditional `onNativePaintInvalidated()` call and all optional-set "cancel all paint" behavior from semantic invalidation. On callback, cancel only changed surfaces and validate indicators; the union-lifetime owner disconnects iff both sets are empty. Cancel callbacks remove effects from the coordinator's tracked animations so stale pending promises do not retain resource ownership.
- [x] Register each native paint effect in `surfacePaint`, and on either settlement remove only the matching animation entry with a generation guard, then reconcile observation. Start observation after effects are constructed even when no transfer was matched. General cancel disconnects first, invalidates the generation, then cleans indicator/layout/paint resources.
- [x] Save the moving current snapshot before cancellation; restore live indicator suppression before `capture(panel)` measures/clones ordinary surfaces. Keep existing layout animations alive until after the whole reversal snapshot has been collected. Reuse the identity snapshot, avoiding validation+capture+start duplicate traversals. Existing stale ghost selection suppression remains permanent for that ghost's lifetime.
- [x] Always construct native surface geometry morph when old/new surfaces exist; guard only backgroundColor morph with indicator ownership. Exclude equal-color paint effects as before. Remove the unreachable root-is-surface branch from prepareGhost and explain why transfers outside current-container are skipped (built-in header/footer never change representative).
- [x] Run focused observer/controller/coordinator/model Jest, typecheck, changed-file eslint, and existing browser current-change/reversal/target-replacement cases GREEN. No stage/commit. Task-scoped review must pass before Task 3.

### Task 3: Browser acceptance, helper cleanup and integration verification

**Files:**

- Modify `src/components/AsideHeader/__playwright__/CurrentIndicatorExample.tsx`, `currentIndicatorPaint.ts`, `transitionTestUtils.ts` if needed.
- Modify `src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx` and `fallbackTransition.visual.test.tsx`.
- Create `src/components/AsideHeader/__tests__/currentIndicatorLifecycle.visual.test.tsx` for the new React lifecycle regressions, keeping the existing visual test file from growing further.
- Update `src/components/AsideHeader/README.md` and `README-ru.md` only for the corrected behavior/limitations, avoiding duplicated implementation documentation.

**Interfaces:** Use the existing `toggleAsideAndPause`, `seekAnimations`, `finishAnimations`, `comparePaint`, `selectionPaint`. Task 1 adds RTL acceptance; Task 2 owns production fixes. This task changes tests/helpers/docs only; report any production defect with a failing regression before asking the controller to route a fix.

- [x] Add browser tests for native-paint-only transitions (no indicator) and a later current change; a last-transfer cancellation followed by a later current change while unrelated hover paint remains; native geometry after suppression release; and real simultaneous compact/current changes rejecting a reversal transfer. Fixture state controls must exercise actual React updates, not invoke private coordinator methods or merely mutate metadata.
- [x] Retain RTL first/midframe actual-paint and no-overflow checks for both directions from Task 1, and confirm current/hover suppression in both densities has no duplicate painted backgrounds without !important. Use the actual screenshots and existing calibrated paint helpers; bounding boxes alone cannot prove clipping/paint.
- [x] Share seek/finish helpers with fallbackTransition.visual.test.tsx; keep its distinct Toggle compact button. Refactor duplicate screenshot decode/sample logic into one browser evaluation helper within currentIndicatorPaint.ts. Preserve explicit empty-region behavior (an empty intersection is not painted); do not accidentally make a required in-viewport selection assertion vacuous. Run all helper consumers after the refactor.
- [x] Run the complete verification set without baseline updates:

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
./scripts/playwright-docker.sh "npm run playwright -- src/components/AsideHeader/__tests__/AsideHeader.visual.test.tsx src/components/AsideHeader/__tests__/layoutTransition.visual.test.tsx src/components/AsideHeader/__tests__/fallbackTransition.visual.test.tsx src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx src/components/AsideHeader/__tests__/currentIndicatorLifecycle.visual.test.tsx --workers=1 --retries=1 --reporter=line"
git diff --check
git diff --name-only -- '*.png'
rg -n '!important' src/components/AsideHeader/components/CompositeBar/Item/Item.module.scss
```

The final rg command is expected to return no matches (exit 1). Report exact passing counts and distinguish retries/environment warnings from assertion failures. No build success claim without running build to exit 0.

- [x] Task-scoped review, then broad final review of the entire correction relative to dd8eb37f. Resolve all material findings, rerun affected checks, and deliver the uncommitted diff with retained worktree and unchanged main checkout. No new baseline PNGs.
