import * as React from 'react';

export const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
export const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
export const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;

export type DrawerDirection = 'right' | 'left' | 'top' | 'bottom';
export type OnResizeHandler = (width: number) => void;

function getEventClientPosition(
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
    direction: 'horizontal' | 'vertical',
) {
    if ('touches' in e) {
        return direction === 'horizontal'
            ? (e.touches[0]?.clientX ?? 0)
            : (e.touches[0]?.clientY ?? 0);
    }

    return direction === 'horizontal' ? e.clientX : e.clientY;
}

export interface UseResizeHandlersParams {
    onStart: () => void;
    onMove: (delta: number) => void;
    onEnd: (delta: number) => void;
    direction?: 'horizontal' | 'vertical';
}

export function useResizeHandlers({
    onStart,
    onMove,
    onEnd,
    direction = 'horizontal',
}: UseResizeHandlersParams) {
    const initialPosition = React.useRef(0);
    const currentPosition = React.useRef(0);

    const handleMove = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            const current = getEventClientPosition(e, direction);

            if (currentPosition.current === current) {
                return;
            }

            currentPosition.current = current;

            const delta = initialPosition.current - current;

            onMove(delta);
        },
        [onMove, direction],
    );

    const handleEnd = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);

            document.body.style.removeProperty('user-select');
            document.body.style.removeProperty('-webkit-user-select');
            document.body.style.removeProperty('cursor');

            const current = getEventClientPosition(e, direction);
            const delta = initialPosition.current - current;

            onEnd(delta);
        },
        [handleMove, onEnd, direction],
    );

    const handleStart = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            const current = getEventClientPosition(e, direction);

            initialPosition.current = current;
            currentPosition.current = current;

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
        [handleEnd, handleMove, onStart, direction],
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
        direction = 'left',
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
            const signedDelta = ['right', 'bottom'].includes(direction) ? delta : -delta;
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
        [getResizedWidth, onResize],
    );

    const displayWidth = isResizing
        ? getResizedWidth(resizeDelta)
        : getClampedWidth(width ?? internalWidth);

    const handlers = useResizeHandlers({
        onStart,
        onMove,
        onEnd,
        direction: ['left', 'right'].includes(direction) ? 'horizontal' : 'vertical',
    });

    return {resizedWidth: displayWidth, resizerHandlers: handlers, isResizing};
}
