'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');

function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
        for (const k in e) {
            if (k !== 'default') {
                const d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: () => e[k]
                });
            }
        }
    }
    n.default = e;
    return Object.freeze(n);
}

const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;
function getEventClientX(e) {
  return "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
}
function useResizeHandlers({ onStart, onMove, onEnd }) {
  const initialXPosition = React__namespace.useRef(0);
  const currentXPosition = React__namespace.useRef(0);
  const handleMove = React__namespace.useCallback(
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
  const handleEnd = React__namespace.useCallback(
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
  const handleStart = React__namespace.useCallback(
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
  const [isResizing, setIsResizing] = React__namespace.useState(false);
  const [resizeDelta, setResizeDelta] = React__namespace.useState(0);
  const [internalWidth, setInternalWidth] = React__namespace.useState(
    width ?? DRAWER_ITEM_INITIAL_RESIZE_WIDTH
  );
  const getClampedWidth = React__namespace.useCallback(
    (width2) => Math.min(Math.max(width2, minResizeWidth), maxResizeWidth),
    [minResizeWidth, maxResizeWidth]
  );
  const getResizedWidth = React__namespace.useCallback(
    (delta) => {
      const signedDelta = direction === "right" ? delta : -delta;
      const newWidth = (width ?? internalWidth) + signedDelta;
      return getClampedWidth(newWidth);
    },
    [width, internalWidth, direction, getClampedWidth]
  );
  const onStart = React__namespace.useCallback(() => {
    setIsResizing(true);
    setResizeDelta(0);
  }, [setIsResizing, setResizeDelta]);
  const onMove = React__namespace.useCallback((delta) => {
    setResizeDelta(delta);
  }, []);
  const onEnd = React__namespace.useCallback(
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
