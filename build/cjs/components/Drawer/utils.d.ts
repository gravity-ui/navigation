import * as React from 'react';
export declare const DRAWER_ITEM_MIN_RESIZE_WIDTH = 200;
export declare const DRAWER_ITEM_MAX_RESIZE_WIDTH = 800;
export declare const DRAWER_ITEM_INITIAL_RESIZE_WIDTH = 400;
export type DrawerDirection = 'right' | 'left';
export type OnResizeHandler = (width: number) => void;
export interface UseResizeHandlersParams {
    onStart: () => void;
    onMove: (delta: number) => void;
    onEnd: (delta: number) => void;
}
export declare function useResizeHandlers({ onStart, onMove, onEnd }: UseResizeHandlersParams): {
    onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
    onTouchStart: (e: React.MouseEvent | React.TouchEvent) => void;
};
export interface UseResizableDrawerItemParams {
    direction?: DrawerDirection;
    width?: number;
    minResizeWidth?: number;
    maxResizeWidth?: number;
    onResize?: OnResizeHandler;
}
export declare function useResizableDrawerItem(params: UseResizableDrawerItemParams): {
    resizedWidth: number;
    resizerHandlers: {
        onMouseDown: (e: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
        onTouchStart: (e: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
    };
};
