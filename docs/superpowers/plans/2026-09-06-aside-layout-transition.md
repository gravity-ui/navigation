# Aside layout transition

Goal: reveal titles during expansion, move persistent rows/icons continuously between compact
and expanded positions, and finish without a second layout change.

Implementation:

- Render the target compact state immediately; remove the delayed presentation timer.
- Keep the aside's inner layout at the target width while its outer edge animates.
- Capture row geometry before the React commit with getSnapshotBeforeUpdate. Animate live
  target rows with translation only (FLIP), and animate icons and a separate selection surface.
- Fade entering titles/rows; keep departing content in a short-lived inert, aria-hidden overlay.
- On reversal, capture the currently displayed coordinates before cancelling old animations.
- Finish through Animation.finished, cancel on unmount, and respect reduced motion.
- Cover intermediate frames, both directions, reversal, final geometry, and target-state controls.
- Check unit tests, types, lint, browser component tests, and build. No push or merge.
