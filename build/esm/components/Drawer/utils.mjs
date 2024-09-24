import { r as reactExports } from '../../node_modules/react/index.mjs';

const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;
function getEventClientX(e) {
  return "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
}
function useResizeHandlers({ onStart, onMove, onEnd }) {
  const initialXPosition = reactExports.useRef(0);
  const currentXPosition = reactExports.useRef(0);
  const handleMove = reactExports.useCallback(
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
  const handleEnd = reactExports.useCallback(
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
  const handleStart = reactExports.useCallback(
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
  const [isResizing, setIsResizing] = reactExports.useState(false);
  const [resizeDelta, setResizeDelta] = reactExports.useState(0);
  const [internalWidth, setInternalWidth] = reactExports.useState(
    width ?? DRAWER_ITEM_INITIAL_RESIZE_WIDTH
  );
  const getClampedWidth = reactExports.useCallback(
    (width2) => Math.min(Math.max(width2, minResizeWidth), maxResizeWidth),
    [minResizeWidth, maxResizeWidth]
  );
  const getResizedWidth = reactExports.useCallback(
    (delta) => {
      const signedDelta = direction === "right" ? delta : -delta;
      const newWidth = (width ?? internalWidth) + signedDelta;
      return getClampedWidth(newWidth);
    },
    [width, internalWidth, direction, getClampedWidth]
  );
  const onStart = reactExports.useCallback(() => {
    setIsResizing(true);
    setResizeDelta(0);
  }, [setIsResizing, setResizeDelta]);
  const onMove = reactExports.useCallback((delta) => {
    setResizeDelta(delta);
  }, []);
  const onEnd = reactExports.useCallback(
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

export { DRAWER_ITEM_INITIAL_RESIZE_WIDTH, DRAWER_ITEM_MAX_RESIZE_WIDTH, DRAWER_ITEM_MIN_RESIZE_WIDTH, useResizableDrawerItem, useResizeHandlers };
//# sourceMappingURL=utils.mjs.map
