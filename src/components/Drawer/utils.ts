import * as React from 'react';

export const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
export const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
export const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;

export type DrawerDirection = 'right' | 'left';
export type OnResizeHandler = (width: number) => void;

function getEventClientX(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
    return 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
}

export interface UseResizeHandlersParams {
    onStart: () => void;
    onMove: (delta: number) => void;
    onEnd: (delta: number) => void;
}

export function useResizeHandlers({onStart, onMove, onEnd}: UseResizeHandlersParams) {
    const initialXPosition = React.useRef(0);
    const currentXPosition = React.useRef(0);

    const handleMove = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            const currentX = getEventClientX(e);

            if (currentXPosition.current === currentX) {
                return;
            }

            currentXPosition.current = currentX;

            const delta = initialXPosition.current - currentX;

            onMove(delta);
        },
        [onMove],
    );

    const handleEnd = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);

            document.body.style.removeProperty('user-select');
            document.body.style.removeProperty('-webkit-user-select');
            document.body.style.removeProperty('cursor');

            const currentX = getEventClientX(e);
            const delta = initialXPosition.current - currentX;

            onEnd(delta);
        },
        [handleMove, onEnd],
    );

    const handleStart = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            const currentX = getEventClientX(e);

            initialXPosition.current = currentX;
            currentXPosition.current = currentX;

            window.addEventListener('mouseup', handleEnd, {once: true});
            window.addEventListener('touchend', handleEnd, {once: true});
            window.addEventListener('touchcancel', handleEnd, {once: true});

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove);

            document.body.style.setProperty('user-select', 'none');
            document.body.style.setProperty('-webkit-user-select', 'none');
            document.body.style.setProperty('cursor', 'col-resize');

            onStart();
        },
        [handleEnd, handleMove, onStart],
    );

    return {
        onMouseDown: handleStart,
        onTouchStart: handleStart,
    };
}

export interface UseResizableDrawerItemParams {
    direction?: DrawerDirection;
    width?: number;
    minResizeWidth?: number;
    maxResizeWidth?: number;
    onResizeStart?: VoidFunction;
    onResize?: OnResizeHandler;
}

export function useResizableDrawerItem(params: UseResizableDrawerItemParams) {
    const {
        direction,
        width,
        minResizeWidth = DRAWER_ITEM_MIN_RESIZE_WIDTH,
        maxResizeWidth = DRAWER_ITEM_MAX_RESIZE_WIDTH,
        onResizeStart,
        onResize,
    } = params;

    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeDelta, setResizeDelta] = React.useState(0);
    const [internalWidth, setInternalWidth] = React.useState(
        width ?? DRAWER_ITEM_INITIAL_RESIZE_WIDTH,
    );

    const getClampedWidth = React.useCallback(
        (width: number) => Math.min(Math.max(width, minResizeWidth), maxResizeWidth),
        [minResizeWidth, maxResizeWidth],
    );

    const getResizedWidth = React.useCallback(
        (delta: number) => {
            const signedDelta = direction === 'right' ? delta : -delta;
            const newWidth = (width ?? internalWidth) + signedDelta;
            return getClampedWidth(newWidth);
        },
        [width, internalWidth, direction, getClampedWidth],
    );

    const onStart = React.useCallback(() => {
        setIsResizing(true);
        setResizeDelta(0);
        onResizeStart?.();
    }, [onResizeStart]);

    const onMove = React.useCallback((delta: number) => {
        setResizeDelta(delta);
    }, []);

    const onEnd = React.useCallback(
        (delta: number) => {
            const newWidth = getResizedWidth(delta);
            setIsResizing(false);
            setInternalWidth(newWidth);
            onResize?.(newWidth);
        },
        [setIsResizing, setInternalWidth, getResizedWidth, onResize],
    );

    const displayWidth = isResizing
        ? getResizedWidth(resizeDelta)
        : getClampedWidth(width ?? internalWidth);

    const handlers = useResizeHandlers({onStart, onMove, onEnd});

    return {resizedWidth: displayWidth, resizerHandlers: handlers};
}
