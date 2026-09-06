# Aside Current Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move one selection surface between different representatives of the same logical current item during compact transitions.

**Architecture:** Keep ordinary row surfaces outside transitions. Resolve semantic current IDs in Item, match unique representatives within their section, and let a separate controller own temporary indicators, suppression and cancellation. AsideLayoutTransition coordinates measurement and timing but retains ownership of layout ghosts.

**Tech Stack:** React, TypeScript, CSS Modules/SCSS, Web Animations API, MutationObserver, Jest/jsdom, Playwright Chromium/WebKit.

## Global Constraints

- Approved specification: `docs/superpowers/specs/2026-09-06-aside-current-indicator-design.md`.
- Work only in `/private/tmp/navigation-aside-transition`, branch `feat/aside-layout-transition`, base `9a2ea8e6`.
- One experimental commit containing documentation, implementation and tests; no per-task commits, amend of the base, merge, push or worktree removal.
- Only changes to `compact` initiate transport. Ordinary navigation clicks, colors of text/icons and public event/API semantics remain unchanged.
- Match logical current IDs within a section; preserve quick-access suppression and `quickAccessHighlightInMainMenu`. Ambiguous ownership falls back to existing presentation.
- Source/target matching happens before existing surface keyframes are built. Suppress native and ghost selection; no crossfade of two backgrounds.
- A separate clipped layer inside positioned unified-menu-content paints above container backgrounds and below rows. It must not add scrollable overflow.
- Snapshot an active indicator before coordinator cancel. MutationObserver cancellation removes only indicator resources; layout ghosts continue.
- Respect reduced motion, missing API/targets, local child state changes, node replacement, interruption and unmount.
- Existing static baselines remain unchanged. Use the container runner; no baseline updates.

## File boundaries

- `components/CompositeBar/presentationCurrent.ts`: semantic current IDs using existing aggregation rules.
- `components/CompositeBar/Item/Item.tsx`: private JSON current-ID metadata on live row roots.
- `components/PageLayout/currentIndicatorModel.ts`: measurement, keys and pure representative matching.
- `components/PageLayout/CurrentIndicatorTransition.ts`: independent indicator ownership, geometry, suppression, observer and cleanup.
- `components/PageLayout/AsideLayoutTransition.tsx`: short integration points for capture, planning before keyframes, ghost suppression and cancel.
- `AsideHeader.module.scss`, `components/FirstPanel.tsx`: explicit coordinate/stacking host and bounded layer.
- `components/CompositeBar/Item/Item.module.scss`: narrowly scoped suppression of participating native/ghost surfaces.
- `__playwright__/CurrentIndicatorExample.tsx`: controlled test fixture with local menu state and optional decoration/More/quick access.
- `__tests__/currentIndicator.visual.test.tsx`: intermediate-frame and paint acceptance tests.
- Focused `__tests__` alongside model/controller and CompositeBar cover pure rules and resource lifecycle.

### Task 1: Semantic current IDs and row metadata

**Files:**

- Modify `src/components/AsideHeader/components/CompositeBar/presentationCurrent.ts`.
- Modify `src/components/AsideHeader/components/CompositeBar/Item/Item.tsx`.
- Create `src/components/AsideHeader/components/CompositeBar/__tests__/presentationCurrent.test.tsx`.

**Interfaces:**

```ts
export function getItemPresentationCurrentIds(
    item: AsideHeaderItem,
    options?: PresentationCurrentOptions,
): string[];
// Item row root, only outside popup rows:
'data-gn-aside-current-ids': currentIds.length ? JSON.stringify(currentIds) : undefined;
```

The helper returns sorted unique IDs for unsuppressed current leaves/self and recursively current popup descendants, including explicitly supplied popupItems. Keep the existing boolean API and behavior. A group header does not invent a current ID: collapsed group/More metadata describes its actual current descendants. Honor suppressCurrentHighlight by omitting metadata. Do not mutate input items or attach a public prop.

- [x] Add a rendering regression expecting JSON current IDs on a selected leaf and a collapsed representative; confirm the base has no metadata.
- [x] Add helper cases for no current, self, nested group/More, suppressed self with an unsuppressed descendant, explicit empty popupItems, duplicate IDs and multiple active descendants.
- [x] Implement the resolver and metadata. The same resolved result must determine metadata and existing selected styling, without drift between two definitions of current.
- [x] Run `npm test -- presentationCurrent quickAccessPanel CompositeBar --runInBand`, `npm run typecheck`, and eslint on changed files. Record RED and GREEN output.
- [x] Self-review and task-scoped read-only review. Leave changes uncommitted for the single experiment commit.

### Task 2: Independent selection transfer controller

**Files:**

- Create `src/components/AsideHeader/components/PageLayout/currentIndicatorModel.ts`.
- Create `src/components/AsideHeader/components/PageLayout/CurrentIndicatorTransition.ts`.
- Create their focused tests under `src/components/AsideHeader/components/PageLayout/__tests__/`.
- Modify coordinator, Item SCSS, AsideHeader SCSS and FirstPanel listed in File boundaries.

**Interfaces:**

```ts
type CurrentPresentation = {
  key: string;
  section: string;
  rowId: string;
  currentIds: string[];
  row: HTMLElement;
  surface: HTMLElement;
  rect: DOMRect;
  color: string;
  radius: string;
};
type CurrentSnapshot = Map<string, CurrentPresentation>;
type CurrentTransfer = {from: CurrentPresentation; to: CurrentPresentation};
export function getCurrentRowKey(row: HTMLElement): string;
export function captureCurrentPresentation(panel: HTMLElement): CurrentSnapshot;
export function matchCurrentPresentations(
  before: CurrentSnapshot,
  after: CurrentSnapshot,
): CurrentTransfer[];
export class CurrentIndicatorTransition {
  capture(panel: HTMLElement): CurrentSnapshot;
  start(
    panel: HTMLElement,
    transfers: CurrentTransfer[],
    options: KeyframeAnimationOptions,
    startTime: number | null,
  ): void;
  manages(surface: HTMLElement): boolean;
  prepareGhost(root: HTMLElement): void;
  cancel(): void;
}
```

If browser Animation.startTime has a wider declared type, accept the browser's actual type rather than casting it to an incompatible number. Private implementation types can be refined without changing these responsibilities.

Private DOM contracts used by acceptance tests: container `data-gn-aside-current-container`, layer `data-gn-aside-current-indicator-layer`, rectangle `data-gn-aside-current-indicator`, live suppression `data-gn-aside-current-suppressed`, ghost suppression `data-gn-aside-current-ghost-suppressed`. Clone-only row identity can use `data-gn-aside-current-row-key`. The new browser regression and shared animation utilities are prepared by the root in `currentIndicator.visual.test.tsx` and `__playwright__/transitionTestUtils.ts`; do not edit those files during Task 2.

- [x] Add model tests: unique same logical ID/different row, same row (no transfer), unrelated IDs, section isolation, duplicate/ambiguous representatives and multi-current aggregates (no arbitrary pairing).
- [x] Add controller lifecycle tests with DOM metadata, real MutationObserver and controllable Animation.finished: source geometry survives capture-before-cancel; stale completion cannot clear a new generation; child mutation and target node replacement cancel only transport; unchanged metadata and own DOM operations do not cancel; unmount disconnects and restores native surfaces.
- [x] Capture current surfaces from live rows only, excluding layout ghosts and indicator layers. Validate one unique representative per logical current/section and real nonzero source/target geometry. Same-row cases retain existing native morph, unless continuing an already moving transfer.
- [x] Create a bounded, aria-hidden/inert, pointer-events:none layer inside the current content host. Set unified-menu-content position:relative and an explicit paint ordering with transparent list planes above the indicator. Limit layer block extent to content and inline extent to the already expanded scrollport; clip its children.
- [x] Translate viewport rectangles into the post-commit host's local content coordinates. Interpolate position and dimensions, not scale:

```ts
const from = {
  left: `${oldRect.x - hostRect.x}px`,
  top: `${oldRect.y - hostRect.y}px`,
  width: `${oldRect.width}px`,
  height: `${oldRect.height}px`,
  borderRadius: oldRadius,
  backgroundColor: oldColor,
};
const to = {
  left: `${targetRect.x - hostRect.x}px`,
  top: `${targetRect.y - hostRect.y}px`,
  width: `${targetRect.width}px`,
  height: `${targetRect.height}px`,
  borderRadius: targetRadius,
  backgroundColor: targetColor,
};
const animation = indicator.animate([from, to], options);
if (startTime !== null) animation.startTime = startTime;
```

- [x] Stamp selection row keys onto decorative clones during capture, while their source still has its composite-bar ancestry. `prepareGhost` suppresses only participating source/target surfaces. Ghost suppression lasts until that ghost is removed; restoring live backgrounds after a current change must not resurrect stale selection in a detached copy.
- [x] In getSnapshotBeforeUpdate, call controller.capture before cancel and store the snapshot. In start, measure and match before constructing surface keyframes. Start the controller using the coordinator's width timing; skip existing surface morph for managed live surfaces. Call prepareGhost before appending a cloned row/group. Coordinator cancel also calls controller cancel.
- [x] Observe live metadata attributes and childList/subtree only while transfers run. Compare active semantic identity, target row/surface references and layer connection; ignore indicator/ghost nodes. On invalidation, restore current native backgrounds and remove only the affected indicator, not layout animations/overlay. Disconnect when no transfers remain.
- [x] Keep native backgroundColor effects separately cancellable from surface geometry. Omit equal-color effects. On observed semantic changes release obsolete paint for changed native surfaces; when the last transport is invalidated release remaining native paint so later clicks during the same layout transition are not masked. Width, row/group motion, ghosts and other active indicators continue. No observer is retained after transport ends. Integrated regression: select existing top-level Home at 50% and require its opaque current background before finishing layout motion.
- [x] Run focused Jest, typecheck, eslint and the base browser regression supplied by Task 3; debug actual intermediate paint and maintain no-extra-overflow invariant.
- [x] Task-scoped review against the approved spec. No commit yet.

### Task 3: Browser acceptance and final integration

**Files:**

- Create `src/components/AsideHeader/__playwright__/CurrentIndicatorExample.tsx`.
- Create `src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx`.
- Update AsideHeader READMEs with experimental compact-only behavior if implemented.

**Interfaces:** fixture props control density, initial compact, current item, pre-collapsed group, quick access/highlight duplication, More scenario and decoration. Its inner menu component owns current state independently of the outer PageLayout, enabling the MutationObserver regression.

- [x] Before production integration, select Weekly operational performance in FullNavigation, toggle and pause the real browser animations at the first requestAnimationFrame. Seek 50% and require exactly one moving indicator between source and target; the base must fail this criterion, not merely a first-frame assertion.
- [x] Add both directions and mid-flight reversal. Check opacity 1, interpolated x/y/width/height/radius, native Analytics and cloned child surfaces not painted, and no discontinuity at finish.
- [x] Use an opaque fixture selection color for deterministic screenshot pixel checks. Inspect image pixels/paint at indicator interior, old/target native surfaces and over text/icon content, not only DOM geometry or computed color.
- [x] Test default and compact density, same-row pre-collapsed Analytics (no extra indicator), standalone current, More, quick access suppression and explicit highlight duplication, same item IDs in separate sections, ambiguous multi-current fallback.
- [x] Decoration fixture: headerDecoration true, menuOverflow scroll, expanded Analytics with non-pinned current child, Home in quick access, subheader rows retained. Override only fixture aside-content `--gradient-height: 2000px`; verify both endpoint rectangles within first 660px. During expand verify actual indicator paint above the gradient and below text/icons.
- [x] Scroll fixture: compare scrollHeight/scrollWidth with the indicator layer on and off at the same paused frame; assert footer overflow state unchanged. Move scrollTop and verify matching indicator translation and clipping at header/footer boundaries. Include a trajectory near the bottom content boundary.
- [x] During a paused transfer change current in the child without changing compact: observer removes only the indicator and suppression, while the group ghost, its clip animation, row animations and aside width animation remain. Test target node replacement, reduced motion and unmount cleanup.
- [x] Run the full verification commands without baseline update:

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
./scripts/playwright-docker.sh "npm run playwright -- src/components/AsideHeader/__tests__/AsideHeader.visual.test.tsx src/components/AsideHeader/__tests__/layoutTransition.visual.test.tsx src/components/AsideHeader/__tests__/fallbackTransition.visual.test.tsx src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx --workers=1 --retries=1 --reporter=line"
git diff --check
git diff --name-only -- '*.png'
```

- [x] Review the entire experiment relative to 9a2ea8e6, resolve findings and rerun affected checks.
- [x] Commit only experiment files, approved spec and this plan in one commit. Verify worktree clean and retained; main checkout remains at its original HEAD. No push/merge.
