import * as React from 'react';

const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;
function getEventClientX(e) {
    var _a, _b;
    return 'touches' in e ? (_b = (_a = e.touches[0]) === null || _a === void 0 ? void 0 : _a.clientX) !== null && _b !== void 0 ? _b : 0 : e.clientX;
}
function useResizeHandlers({ onStart, onMove, onEnd }) {
    const initialXPosition = React.useRef(0);
    const currentXPosition = React.useRef(0);
    const handleMove = React.useCallback((e) => {
        const currentX = getEventClientX(e);
        if (currentXPosition.current === currentX) {
            return;
        }
        currentXPosition.current = currentX;
        const delta = initialXPosition.current - currentX;
        onMove(delta);
    }, [onMove]);
    const handleEnd = React.useCallback((e) => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
        document.body.style.removeProperty('user-select');
        document.body.style.removeProperty('-webkit-user-select');
        document.body.style.removeProperty('cursor');
        const currentX = getEventClientX(e);
        const delta = initialXPosition.current - currentX;
        onEnd(delta);
    }, [handleMove, onEnd]);
    const handleStart = React.useCallback((e) => {
        const currentX = getEventClientX(e);
        initialXPosition.current = currentX;
        currentXPosition.current = currentX;
        window.addEventListener('mouseup', handleEnd, { once: true });
        window.addEventListener('touchend', handleEnd, { once: true });
        window.addEventListener('touchcancel', handleEnd, { once: true });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        document.body.style.setProperty('user-select', 'none');
        document.body.style.setProperty('-webkit-user-select', 'none');
        document.body.style.setProperty('cursor', 'col-resize');
        onStart();
    }, [handleEnd, handleMove, onStart]);
    return {
        onMouseDown: handleStart,
        onTouchStart: handleStart,
    };
}
function useResizableDrawerItem(params) {
    const { direction, width, minResizeWidth = DRAWER_ITEM_MIN_RESIZE_WIDTH, maxResizeWidth = DRAWER_ITEM_MAX_RESIZE_WIDTH, onResize, } = params;
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeDelta, setResizeDelta] = React.useState(0);
    const [internalWidth, setInternalWidth] = React.useState(width !== null && width !== void 0 ? width : DRAWER_ITEM_INITIAL_RESIZE_WIDTH);
    const getClampedWidth = React.useCallback((width) => Math.min(Math.max(width, minResizeWidth), maxResizeWidth), [minResizeWidth, maxResizeWidth]);
    const getResizedWidth = React.useCallback((delta) => {
        const signedDelta = direction === 'right' ? delta : -delta;
        const newWidth = (width !== null && width !== void 0 ? width : internalWidth) + signedDelta;
        return getClampedWidth(newWidth);
    }, [width, internalWidth, direction, getClampedWidth]);
    const onStart = React.useCallback(() => {
        setIsResizing(true);
        setResizeDelta(0);
    }, [setIsResizing, setResizeDelta]);
    const onMove = React.useCallback((delta) => {
        setResizeDelta(delta);
    }, []);
    const onEnd = React.useCallback((delta) => {
        const newWidth = getResizedWidth(delta);
        setIsResizing(false);
        setInternalWidth(newWidth);
        onResize === null || onResize === void 0 ? void 0 : onResize(newWidth);
    }, [setIsResizing, setInternalWidth, getResizedWidth, onResize]);
    const displayWidth = isResizing
        ? getResizedWidth(resizeDelta)
        : getClampedWidth(width !== null && width !== void 0 ? width : internalWidth);
    const handlers = useResizeHandlers({ onStart, onMove, onEnd });
    return { resizedWidth: displayWidth, resizerHandlers: handlers };
}

export { DRAWER_ITEM_INITIAL_RESIZE_WIDTH, DRAWER_ITEM_MAX_RESIZE_WIDTH, DRAWER_ITEM_MIN_RESIZE_WIDTH, useResizableDrawerItem, useResizeHandlers };
//# sourceMappingURL=utils.js.map
