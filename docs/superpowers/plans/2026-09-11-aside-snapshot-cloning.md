# Aside snapshot cloning implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Remove unused appearance clones from compact-transition snapshots while preserving departing content and interrupted transitions.

**Architecture:** Keep `capture()` and `measure()` responsible for geometry and the existing scalar computed-style values. Attach a separate appearance map only to the final before snapshot, after merging departing elements and before cancelling old animations. Capture eligible standalone rows, visible titles and group lists; skip standalone copies of rows already covered by a before group. Share row eligibility with the ghost consumer. A missing appearance skips only its decorative ghost and preserves the remaining animation and cleanup.

**Tech Stack:** React class snapshot lifecycle, TypeScript, DOM/WAAPI, Jest/jsdom, Playwright Chromium/WebKit.

## Global constraints

- Implementation was authorized after plan review; commit and push were authorized separately after implementation validation.
- Preserve the documented compact-transition, reversal, current-indicator, clipping and cleanup behavior.
- Preserve `compactTransition={false}` and reduced-motion behavior; do not broaden animation disabling.
- Keep public props, Item/CompositeBar logic, CSS and screenshot baselines unchanged.
- Never obtain pre-update appearance from the live DOM in `addGhost()`.
- Do not predict which rows survive from the compact direction: menu data may change in the same commit.
- Geometry remains necessary for icons, surfaces and dividers even when their standalone appearance clones are removed.
- Preserve `Part` object identity after capturing appearances; construct the map after all four departing-map merges and never replace its keys afterward.
- Keep reduced-motion gating in its current location for this change. Avoiding before capture in reduced-motion mode is a separate optimization with its own active-transition cleanup checks.

## Verified starting point

Checkout reviewed: `0610a01d0801e3a790af6d51fbd73b275a07f028`.

`measure()` calls `cloneAppearance()` unconditionally. `capture()` runs before the React mutation and again in `start()`. The only consumers of appearance clones are the three `addGhost()` calls for before titles, disappearing rows and disappearing group lists. Standalone icon, surface and divider clones have no consumers.

A local Chromium 131 isolated benchmark executed the actual capture function on synthetic rows, each containing a surface, SVG icon and nested title span. Five warmups and 21 measured captures per variant; geometry-only variant removed only the clone expression. Counts cover one snapshot, including the panel style read. Geometry only is the no-cloning reference: an upper bound on the savings attributable to removing clones from that snapshot, not the planned cost of a before snapshot or a whole toggle.

| Rows | Variant                              | Deep clone calls | Copied elements | Computed-style calls | Median |
| ---- | ------------------------------------ | ---------------- | --------------- | -------------------- | ------ |
| 20   | Current                              | 80               | 260             | 341                  | 1.7 ms |
| 20   | Geometry only (no-cloning reference) | 0                | 0               | 81                   | 0.2 ms |
| 100  | Current                              | 400              | 1300            | 1701                 | 8.6 ms |
| 100  | Geometry only (no-cloning reference) | 0                | 0               | 401                  | 0.8 ms |

This establishes material avoidable capture overhead, not production frame loss or whole-transition speedup. The benchmark has no React commit, real UIKit layout, groups or active animations. Local diagnostic script: `/private/tmp/navigation-capture-review.cjs` (temporary, not a repository dependency).

Expected operation counts for the planned implementation, assuming the same ordinary row with all three parts exists in both snapshots: 8 deep clone calls per toggle become 2 when the before title is visible (row + title), or 1 when the before title has zero opacity (row only). This is a 75% or 87.5% reduction in clone calls, not measured elapsed-time savings. Group lists, disappearing rows and reversals have different counts.

For 100 equal-shaped rows in the benchmark, the current pair of snapshots makes 3402 computed-style calls. The proposed pair is projected to make 1702 with visible before titles (1301 before + 401 after), or 1502 with zero-opacity before titles (1101 + 401): approximately 50% or 56% fewer **total** calls. Approximately 65% fewer calls applies only to style reads inside cloning for the visible-title case (2600 to 900), excluding unchanged geometry/style measurement. These are arithmetic projections from the fixture, not a benchmark of the completed implementation. No 1.7 → 0.2 ms or 8.6 → 0.8 ms whole-toggle result is promised.

Existing `AsideLayoutTransition.test.tsx`: 29 tests passed before changes.

Plan-review checks reconfirmed the same HEAD, the before-only clone consumers, local `@types/jest` 28.1.8 lacking `mock.contexts`, and the Playwright 1.49.1 boolean `--update-snapshots` CLI option. A standalone TypeScript check reproduced TS2339 for `mock.contexts`; the explicit `this: Node` target-recording spy below passed. `npm run typecheck` excludes test files in this repository, so the focused ts-jest run is also required to validate test snippets.

The corrected inner Playwright command was checked locally with `--list`: 268 tests discovered in the four selected files across Chromium and WebKit. This verifies CLI parsing and discovery only; no browser suite or container run was performed while revising this plan.

## Task 1: Separate before appearance from geometry

**Files:**

- Modify: `src/components/AsideHeader/components/PageLayout/AsideLayoutTransition.tsx`
- Test: `src/components/AsideHeader/components/PageLayout/__tests__/AsideLayoutTransition.test.tsx`

**Interfaces:** `capture(panel): Snapshot` returns geometry and scalar presentation values only. `BeforeSnapshot` additionally owns frozen appearance copies. Only `getSnapshotBeforeUpdate()` creates those copies; `start()` consumes them.

- [x] Add a phase-specific regression in the existing `AsideLayoutTransition compactTransition` describe, reusing its `view`, queued `microtasks`, WAAPI mocks and cleanup:

```tsx
it('does not clone target DOM while starting a transition', () => {
  const child = (
    <button data-gn-composite-bar-item-id="home" style={{opacity: 1}}>
      <span data-gn-aside-part="icon">
        <svg>
          <path />
        </svg>
      </span>
      <span data-gn-aside-part="title" style={{opacity: 1}}>
        Home
      </span>
      <span data-gn-aside-part="surface" />
    </button>
  );
  const {rerender} = render(view(false, true, child));
  rerender(view(true, true, child));
  const clones = jest.spyOn(Node.prototype, 'cloneNode');
  act(() => microtasks.splice(0).forEach((callback) => callback()));
  expect(clones).not.toHaveBeenCalled();
});
```

- [x] Run the focused Jest command below and confirm this regression fails on eager after cloning.
- [x] Before changing production code, also add and run tests 2 and 3 shown below. Record their baseline failures: test 2 observes 4 clone calls with targets `[null, 'icon', 'title', 'surface']`, rather than 2 / `[null, 'title']`; test 3 observes a standalone `nested` clone, so its expected `false` is actually `true`. These baseline values were identified during plan review. Do not count tests that only pass after implementation as evidence of the baseline defect.
- [x] Remove `clone` from `Part` and the `clone: cloneAppearance(element)` expression from `measure()`. Retain every other measured field.
- [x] Add the following before-only type and capture helper after `capture()`:

```ts
type BeforeSnapshot = Snapshot & {appearances: Map<Part, HTMLElement>};

function canCreateRowGhost(row: Row, snapshot: Snapshot): boolean {
  return row.opacity !== 0 && !(row.group && snapshot.groups.has(row.group));
}

function captureGhostAppearances(snapshot: Snapshot): Map<Part, HTMLElement> {
  const appearances = new Map<Part, HTMLElement>();
  const save = (part: Part) => appearances.set(part, cloneAppearance(part.element));
  snapshot.rows.forEach((row) => {
    if (canCreateRowGhost(row, snapshot)) save(row);
    if (row.title && row.title.opacity > 0) save(row.title);
  });
  snapshot.groups.forEach(({part}) => save(part));
  return appearances;
}
```

Use `canCreateRowGhost()` in both capture and consumption. `opacity !== 0` is deliberately the inverse of the existing row exclusion, including its behavior for NaN; do not replace it with `> 0`. Titles retain the separate existing `> 0` check. Every group remains eligible.

A row with `row.group && snapshot.groups.has(row.group)` cannot become a standalone ghost, regardless of after state; its group-list clone already includes it. Skip that row copy, but still save its visible title: title ghost eligibility depends on `after.groups`, which is not yet known. Departing rows remeasured by `measureRow()` have no `.group`; evaluate the final merged snapshot rather than inferring their ownership. Icons/surfaces/dividers remain included as descendants when a whole row or group is copied, but are not copied independently.

- [x] Change the class snapshot generic, `getSnapshotBeforeUpdate()` return type, `componentDidUpdate()` before parameter and `start()` before parameter from `Snapshot` to `BeforeSnapshot`, preserving nullable signatures where present.
- [x] After all four departing-map merges in `getSnapshotBeforeUpdate()`, immediately before `this.animatedPanel = panel; this.cancel();`, construct and return the final before snapshot:

```ts
const before: BeforeSnapshot = {
  ...snapshot,
  appearances: captureGhostAppearances(snapshot),
};
this.animatedPanel = panel;
this.cancel();
return before;
```

Do not move capture past cancellation: existing ghosts are removed there. Keep current-indicator capture/cancellation and moving-geometry reads in their current order.

- [x] Add `appearances: Map<Part, HTMLElement>` as the third `addGhost()` argument and explicitly return `HTMLElement | undefined`. Remove `const ghost = part.clone`. At the very start of `addGhost()`, before creating an overlay or changing DOM, read the copy:

```ts
const ghost = appearances.get(part);
if (!ghost) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Missing pre-update aside ghost appearance');
  }
  return undefined;
}
```

Keep `prepareGhost()`, attribute stripping, clipping and successful ghost animations unchanged. Never throw or fall back to cloning live DOM on a miss: `start()` runs in an uncaught microtask after animation resources are installed but before its final cleanup registration. Report the invariant violation in development and omit only that decorative copy.

- [x] Replace the title-ghost branch with a local guard. Do **not** return from `after.rows.forEach()` on a missing title: the following surface geometry/paint work must still run.

```ts
} else if (old.title && old.title.opacity > 0) {
  const ghost = this.addGhost(panel, old.title, before.appearances);
  if (ghost) {
    this.departingTitles.set(key, ghost);
    animate(ghost, [
      {opacity: old.title.opacity, transform: 'none'},
      {
        opacity: 0,
        transform: translation(row.rect.x - old.rect.x, row.rect.y - old.rect.y),
      },
    ]);
  }
}
```

- [x] Replace the entire standalone-row consumer with the shared predicate and a callback-local guard:

```ts
before.rows.forEach((row, key) => {
  if (after.rows.has(key) || !canCreateRowGhost(row, before)) return;
  const ghost = this.addGhost(panel, row, before.appearances);
  if (!ghost) return;
  this.departingRows.set(key, ghost);
  animate(ghost, [{opacity: row.opacity}, {opacity: 0}]);
});
```

- [x] In `before.groups.forEach()`, replace the group ghost lookup with these lines; retain the remainder of that callback:

```ts
if (after.groups.has(key)) return;
const ghost = this.addGhost(panel, group.part, before.appearances);
if (!ghost) return;
```

These two early returns exit only the individual departing-row/group callbacks; `start()` must still reach resource ownership and completion cleanup at its end.

- [x] Test 2, added at the baseline stage above: enforce which roots are copied. Its baseline failure is 4 calls / `[null, 'icon', 'title', 'surface']`; after implementation it must report 2 / `[null, 'title']`:

```tsx
it('captures only standalone ghost candidates before an update', () => {
  const child = (
    <button data-gn-composite-bar-item-id="home" style={{opacity: 1}}>
      <span data-gn-aside-part="icon">
        <svg>
          <path />
        </svg>
      </span>
      <span data-gn-aside-part="title" style={{opacity: 1}}>
        Home
      </span>
      <span data-gn-aside-part="surface" />
    </button>
  );
  const {rerender} = render(view(false, true, child));
  const targets: Element[] = [];
  const cloneNode = Node.prototype.cloneNode;
  const clones = jest.spyOn(Node.prototype, 'cloneNode').mockImplementation(function (
    this: Node,
    deep?: boolean,
  ) {
    targets.push(this as Element);
    return cloneNode.call(this, deep);
  });
  rerender(view(true, true, child));
  expect(clones).toHaveBeenCalledTimes(2);
  expect(targets.map((node) => node.getAttribute('data-gn-aside-part'))).toEqual([null, 'title']);
});
```

- [x] Test 3, added at the baseline stage above: cover before-group capture. At the reviewed HEAD, `nested` is cloned independently and the first assertion fails (`true` instead of `false`). After implementation it must skip that standalone row while preserving the nested title candidate and group-list copy:

```tsx
it('captures a group and nested title without a standalone nested row', () => {
  const child = (
    <div data-gn-aside-group="group">
      <button data-gn-composite-bar-item-id="header" style={{opacity: 1}}>
        Group
      </button>
      <div className="g-list">
        <button data-gn-composite-bar-item-id="nested" data-gn-aside-nested style={{opacity: 1}}>
          <span data-gn-aside-part="title" style={{opacity: 1}}>
            Nested title
          </span>
        </button>
      </div>
    </div>
  );
  const {rerender} = render(view(false, true, child));
  const targets: Element[] = [];
  const cloneNode = Node.prototype.cloneNode;
  jest.spyOn(Node.prototype, 'cloneNode').mockImplementation(function (this: Node, deep?: boolean) {
    targets.push(this as Element);
    return cloneNode.call(this, deep);
  });
  rerender(view(true, true, child));
  expect(
    targets.some((node) => node.getAttribute('data-gn-composite-bar-item-id') === 'nested'),
  ).toBe(false);
  expect(targets.some((node) => node.getAttribute('data-gn-aside-part') === 'title')).toBe(true);
  expect(targets.some((node) => node.matches('.g-list'))).toBe(true);
});
```

- [x] Add fault-injection coverage to the same describe. Clear the returned before appearance map before flushing the queued start, so all three ghost consumer branches encounter a miss. The surface assertion specifically rejects returning early from a row on a missing title:

```tsx
it('skips missing decorative copies while preserving surface animation and cleanup', () => {
  const child = (compact: boolean) => (
    <>
      <button data-gn-composite-bar-item-id="home" style={{opacity: 1}}>
        <span data-gn-aside-part="title" style={{opacity: compact ? 0 : 1}}>
          Home
        </span>
        <span data-gn-aside-part="surface" />
      </button>
      {!compact && (
        <>
          <button data-gn-composite-bar-item-id="departing" style={{opacity: 1}}>
            Departing
          </button>
          <div data-gn-aside-group="group">
            <button data-gn-composite-bar-item-id="header" style={{opacity: 1}}>
              Group
            </button>
            <div className="g-list">
              <button
                data-gn-composite-bar-item-id="nested"
                data-gn-aside-nested
                style={{opacity: 1}}
              >
                Nested
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
  const diagnostics = jest.spyOn(console, 'error').mockImplementation(() => {});
  const snapshots = jest.spyOn(AsideLayoutTransition.prototype, 'getSnapshotBeforeUpdate');
  const {rerender, unmount} = render(view(false, true, child(false)));
  rerender(view(true, true, child(true)));
  const captured = snapshots.mock.results[0];
  if (captured.type !== 'return' || !captured.value) throw new Error('Expected before snapshot');
  expect(captured.value.groups.has('footer/group')).toBe(true);
  captured.value.appearances.clear();
  act(() => microtasks.splice(0).forEach((callback) => callback()));
  expect(diagnostics).toHaveBeenCalledWith('Missing pre-update aside ghost appearance');
  expect(handles.some(({frames}) => frames.some((frame) => 'width' in frame))).toBe(true);
  const findDecoration = (selector: string) =>
    // eslint-disable-next-line testing-library/no-node-access
    document.querySelector(selector);
  expect(findDecoration('[data-gn-aside-transition-overlay]')).toBeNull();
  expect(findDecoration('[data-gn-aside-animating]')).not.toBeNull();
  rerender(view(true, false, child(true)));
  expect(findDecoration('[data-gn-aside-animating]')).toBeNull();
  expect(handles.every(({cancel}) => cancel.mock.calls.length > 0)).toBe(true);
  unmount();
});
```

Test 4 cannot run unchanged against the original implementation: it needs `BeforeSnapshot.appearances` to inject the fault. The original implementation creates an overlay for this fixture; an adapted baseline probe without the new map access and missing-copy diagnostic expectation fails the overlay `toBeNull()` assertion. This is distinct from a baseline run of the complete test.

- [x] After introducing `BeforeSnapshot`, demonstrate the complete test's failure with the throwing miss handler, then its success with the planned guards. If the missing-copy check is placed after overlay creation, the overlay `toBeNull()` assertion must fail. An early return in the title branch must fail the surface-animation assertion. With the planned guards, start reaches ownership registration and disabling cancels all animations and removes the animating attribute. Keep these negative controls temporary; none belongs in the final implementation.

The snapshot group assertion runs before clearing appearances. This fixture has no composite-bar wrapper, so its section is `footer` and its group key is `footer/group`. Requiring that key prevents the missing-copy test from passing when group capture is broken and its nested row is treated as an independent candidate.

- [x] Run the complete focused Jest file, typecheck and file lint. All must pass. The focused Jest run validates test-file TypeScript, which the production `npm run typecheck` excludes.

```sh
npm test -- --runInBand src/components/AsideHeader/components/PageLayout/__tests__/AsideLayoutTransition.test.tsx
npm run typecheck
npx eslint src/components/AsideHeader/components/PageLayout/AsideLayoutTransition.tsx src/components/AsideHeader/components/PageLayout/__tests__/AsideLayoutTransition.test.tsx
```

## Task 2: Validate appearance preservation and practical performance

**Files exercised:**

- `src/components/AsideHeader/__tests__/layoutTransition.visual.test.tsx`
- `src/components/AsideHeader/__tests__/currentIndicator.visual.test.tsx`
- `src/components/AsideHeader/__tests__/compactTransition.visual.test.tsx`
- `src/components/AsideHeader/__tests__/collapseButton.visual.test.tsx`

- [x] Run existing browser coverage in both configured browsers through the repository Linux runner. Use a PTY (`exec_command` with `tty: true`): the script invokes Docker/Podman with `-it` and fails without a TTY. Do not alter the runner to compensate. Use no snapshot-update flag:

```sh
./scripts/playwright-docker.sh 'npm run playwright -- layoutTransition.visual.test.tsx currentIndicator.visual.test.tsx compactTransition.visual.test.tsx collapseButton.visual.test.tsx --workers=1'
```

Playwright 1.49.1 accepts boolean `--update-snapshots`, not `--update-snapshots=none`. With `UPDATE_REQUEST` unset/empty, the repository config uses `updateSnapshots: 'missing'`: existing baselines are checked, but missing ones can be created. Ensure `UPDATE_REQUEST` is unset/empty in the test environment and inspect `git status --short` afterward for new snapshot files. Do not treat auto-created missing snapshots as passing visual evidence or include them in this change; report the coverage gap. Baseline updates require separate authorization.

Verify the existing themed title-ghost assertion remains `rgb(155, 0, 0)` after collapse; nested dividers resize during departure and reversal; scrolled group ghosts remain clipped; current changes/remounts release old resources; toggling compactTransition clears queued starts and overlays; collapse anchors do not leak into ghosts. Preserve any existing full-suite failures separately from focused reruns.

- [x] Profile FullNavigation and a representative long/grouped menu in both directions and on mid-flight reversal. Record snapshot phase, clone count, style-read count, capture time and whole-toggle frame timing separately. Compare the same browser, DOM and machine before/after; use warmed repeated measurements and report median/p95. Do not make millisecond assertions in Jest or derive browser speed from jsdom.
- [x] Confirm no standalone after clone is created. Before clones must have row, visible title or group-list roots. Frozen typography must come from the old DOM even if the source changes or disappears before `start()`.
- [x] Run `git diff --check` and inspect the final diff. Report measured savings and browser limitations before proposing further optimization.

The first change removes redundant standalone nested-row copies as well as all after and standalone icon/surface/divider copies. It still leaves overlap between eligible rows and their titles, and between group lists and nested titles. If this remains a measured bottleneck, design a separate per-snapshot frozen subtree map: capture each topmost candidate subtree once, map original descendants to frozen copies, and materialize each used ghost from the frozen copy. This requires independent tests for ancestor/descendant ghosts and mutations by `prepareGhost()`; do not substitute a live-element lazy clone. Retain the explicit before-only map for this change; an optional `clone` field and capture flags are an alternative architecture, not needed for correctness.

## Execution evidence

Task 1 is implemented in the two scoped source/test files. Untouched baseline: 29/29 Jest tests passed. With tests 1–3 added, all three failed on the expected clone behavior. The missing-copy regression also failed under each temporary negative control: throwing handler, overlay created before lookup, and title callback early return. Final focused Jest: 33/33 passed; production typecheck and targeted ESLint passed. Independent source review reported spec compliance and code quality approval with no actionable findings.

### Production fixture performance

Compared the saved original source at `0610a01d0801e3a790af6d51fbd73b275a07f028` with the implemented source in production Vite builds. Local headless Chromium `131.0.6778.33`, viewport 1440×1000, device scale 1, same machine and dependencies. FullNavigation uses its existing story args. The long-menu fixture uses the real AsideHeader with 100 items in five expanded groups and scroll overflow. Fonts were ready before measuring; no browser-suite workload ran concurrently.

Counters were measured separately from timing: three repetitions per action for clone/style-read counts; three warmup cycles followed by 15 measured cycles per action for timings. Counts were identical across all three repetitions. Reversal toggles during an active collapse after width progress reaches one third; the table measures the reversal action itself. Each natural transition was awaited and checked for overlay cleanup. Before and after variants ran sequentially, so these are local comparative measurements rather than a hardware-independent performance guarantee.

Counts include the before lifecycle and `start()`; they exclude React rendering outside those boundaries. The after-capture clone count is zero in every implemented scenario.

| Fixture           | Action   | Clone calls before → after | Computed-style calls before → after |
| ----------------- | -------- | -------------------------- | ----------------------------------- |
| FullNavigation    | Collapse | 157 → 40                   | 973 → 472                           |
| FullNavigation    | Expand   | 157 → 17                   | 973 → 330                           |
| FullNavigation    | Reverse  | 177 → 36                   | 1123 → 479                          |
| 100 grouped items | Collapse | 454 → 117                  | 3879 → 2151                         |
| 100 grouped items | Expand   | 454 → 6                    | 3879 → 509                          |
| 100 grouped items | Reverse  | 465 → 17                   | 5317 → 1947                         |

Combined snapshot time below is the per-sample sum of `getSnapshotBeforeUpdate()` and the after `capture()` (including before lifecycle/current-indicator work, excluding the remainder of `start()`). It is not the sum of independently calculated medians.

| Fixture           | Action   | Median before → after | p95 before → after |
| ----------------- | -------- | --------------------- | ------------------ |
| FullNavigation    | Collapse | 7.0 → 3.3 ms          | 7.4 → 3.7 ms       |
| FullNavigation    | Expand   | 7.2 → 2.3 ms          | 8.3 → 2.9 ms       |
| FullNavigation    | Reverse  | 9.7 → 4.9 ms          | 10.7 → 5.3 ms      |
| 100 grouped items | Collapse | 29.2 → 15.3 ms        | 31.6 → 16.2 ms     |
| 100 grouped items | Expand   | 28.2 → 2.5 ms         | 29.8 → 3.0 ms      |
| 100 grouped items | Reverse  | 46.7 → 19.8 ms        | 59.0 → 21.5 ms     |

A separate whole-toggle frame observation includes React/DOM work outside snapshots. It measures click-to-next-rAF (a pre-paint scheduling proxy, not a paint-timing entry) and the largest rAF interval during each transition. No constant-FPS claim follows from these observations; the long-menu collapse/reversal still costs more than a 60 Hz frame budget.

| Fixture           | Action   | Next-rAF median before → after | Max-frame-gap p95 before → after |
| ----------------- | -------- | ------------------------------ | -------------------------------- |
| FullNavigation    | Collapse | 20.9 → 17.4 ms                 | 30.2 → 18.8 ms                   |
| FullNavigation    | Expand   | 19.1 → 16.7 ms                 | 21.8 → 18.7 ms                   |
| FullNavigation    | Reverse  | 21.7 → 16.9 ms                 | 25.0 → 18.7 ms                   |
| 100 grouped items | Collapse | 51.4 → 36.6 ms                 | 63.8 → 39.7 ms                   |
| 100 grouped items | Expand   | 53.9 → 27.7 ms                 | 58.1 → 36.1 ms                   |
| 100 grouped items | Reverse  | 68.7 → 42.5 ms                 | 81.9 → 46.7 ms                   |

Temporary evidence directory: `/private/tmp/navigation-snapshot-implementation/`.

- `task-1-report.md`, `task-1-*.log`: red, negative-control and final verification evidence.
- `review.diff`, `review-report.md`: reviewed source changes and independent review.
- `AsideLayoutTransition.before.tsx`: saved original source used for the comparison.
- `build-perf.cjs`, `run-perf.cjs`: production fixture builder and benchmark driver.
- `performance-results.json`: raw per-action phase/counter/frame observations.
- `performance-summary.jsonl`: per-phase aggregate timing and counts.
- `playwright-linux.log`: Linux browser-suite output; 268/268 tests passed in 5.1 minutes, command exit 0.

### Final validation and workspace state

The exact Task 2 Linux-runner command completed successfully with a PTY: **268 tests passed in 5.1 minutes**, across Chromium and WebKit, with no failed/flaky tests reported. This includes themed title ghosts, group/divider departure and reversal, current-indicator transport, clipping, compact-transition disabling and collapse-button coverage. No snapshot baseline was created or modified.

Final `git diff --check` and plan formatting checks passed. The source/test diff still matches the independently reviewed patch. The pre-commit scope audit identified only the two scoped source/test modifications and this plan/evidence document.
