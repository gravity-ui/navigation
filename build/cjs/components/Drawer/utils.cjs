'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');

const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;
function getEventClientX(e) {
  return "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
}
function useResizeHandlers({ onStart, onMove, onEnd }) {
  const initialXPosition = index.reactExports.useRef(0);
  const currentXPosition = index.reactExports.useRef(0);
  const handleMove = index.reactExports.useCallback(
    (e) => {
      const currentX = getEventClientX(e);
      if (currentXPosition.current === currentX) {
        return;
      }
      currentXPosition.current = currentX;
      const delta = initialXPosition.current - currentX;
      onMove(delta);
    },
    [onMove]
  );
  const handleEnd = index.reactExports.useCallback(
    (e) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("-webkit-user-select");
      document.body.style.removeProperty("cursor");
      const currentX = getEventClientX(e);
      const delta = initialXPosition.current - currentX;
      onEnd(delta);
    },
    [handleMove, onEnd]
  );
  const handleStart = index.reactExports.useCallback(
    (e) => {
      const currentX = getEventClientX(e);
      initialXPosition.current = currentX;
      currentXPosition.current = currentX;
      window.addEventListener("mouseup", handleEnd, { once: true });
      window.addEventListener("touchend", handleEnd, { once: true });
      window.addEventListener("touchcancel", handleEnd, { once: true });
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchmove", handleMove);
      document.body.style.setProperty("user-select", "none");
      document.body.style.setProperty("-webkit-user-select", "none");
      document.body.style.setProperty("cursor", "col-resize");
      onStart();
    },
    [handleEnd, handleMove, onStart]
  );
  return {
    onMouseDown: handleStart,
    onTouchStart: handleStart
  };
}
function useResizableDrawerItem(params) {
  const {
    direction,
    width,
    minResizeWidth = DRAWER_ITEM_MIN_RESIZE_WIDTH,
    maxResizeWidth = DRAWER_ITEM_MAX_RESIZE_WIDTH,
    onResize
  } = params;
  const [isResizing, setIsResizing] = index.reactExports.useState(false);
  const [resizeDelta, setResizeDelta] = index.reactExports.useState(0);
  const [internalWidth, setInternalWidth] = index.reactExports.useState(
    width ?? DRAWER_ITEM_INITIAL_RESIZE_WIDTH
  );
  const getClampedWidth = index.reactExports.useCallback(
    (width2) => Math.min(Math.max(width2, minResizeWidth), maxResizeWidth),
    [minResizeWidth, maxResizeWidth]
  );
  const getResizedWidth = index.reactExports.useCallback(
    (delta) => {
      const signedDelta = direction === "right" ? delta : -delta;
      const newWidth = (width ?? internalWidth) + signedDelta;
      return getClampedWidth(newWidth);
    },
    [width, internalWidth, direction, getClampedWidth]
  );
  const onStart = index.reactExports.useCallback(() => {
    setIsResizing(true);
    setResizeDelta(0);
  }, [setIsResizing, setResizeDelta]);
  const onMove = index.reactExports.useCallback((delta) => {
    setResizeDelta(delta);
  }, []);
  const onEnd = index.reactExports.useCallback(
    (delta) => {
      const newWidth = getResizedWidth(delta);
      setIsResizing(false);
      setInternalWidth(newWidth);
      onResize?.(newWidth);
    },
    [setIsResizing, setInternalWidth, getResizedWidth, onResize]
  );
  const displayWidth = isResizing ? getResizedWidth(resizeDelta) : getClampedWidth(width ?? internalWidth);
  const handlers = useResizeHandlers({ onStart, onMove, onEnd });
  return { resizedWidth: displayWidth, resizerHandlers: handlers };
}

exports.DRAWER_ITEM_INITIAL_RESIZE_WIDTH = DRAWER_ITEM_INITIAL_RESIZE_WIDTH;
exports.DRAWER_ITEM_MAX_RESIZE_WIDTH = DRAWER_ITEM_MAX_RESIZE_WIDTH;
exports.DRAWER_ITEM_MIN_RESIZE_WIDTH = DRAWER_ITEM_MIN_RESIZE_WIDTH;
exports.useResizableDrawerItem = useResizableDrawerItem;
exports.useResizeHandlers = useResizeHandlers;
//# sourceMappingURL=utils.cjs.map
