import { default as React } from 'react';
import { DrawerDirection } from './utils';
export interface DrawerItemProps {
    /** Unique identifier for the drawer item. */
    id: string;
    /**
     * Content to be displayed within the drawer item.
     * @deprecated Use `children` instead.
     */
    content?: React.ReactNode;
    /** Content to be displayed within the drawer item, preferable over the deprecated `content`. */
    children?: React.ReactNode;
    /** Determines whether the drawer item is visible or hidden. */
    visible: boolean;
    /** Specifies the direction from which the drawer should slide in, `left` by default.
     * @default left
     */
    direction?: DrawerDirection;
    /** Additional custom class name applied to the drawer item. */
    className?: string;
    /** Determines whether the drawer item can be resized */
    resizable?: boolean;
    /**
     * The width of the resizable drawer item.
     * If not provided, the width will be stored internally.
     */
    width?: number;
    /**
     * Called at the end of resizing. Can be used to save the new width.
     * @param width The new width of the drawer item
     */
    onResize?: (width: number) => void;
    /** The minimum width of the resizable drawer item */
    minResizeWidth?: number;
    /** The maximum width of the resizable drawer item */
    maxResizeWidth?: number;
}
export declare const DrawerItem: React.ForwardRefExoticComponent<DrawerItemProps & React.RefAttributes<HTMLDivElement>>;
type DrawerChild = React.ReactElement<DrawerItemProps>;
export interface DrawerProps {
    /** Child components to be rendered within the drawer. This can be a single child or an array of children. */
    children: DrawerChild | DrawerChild[];
    /**
     * Optional flag to prevent the body from scrolling when the drawer is open, `true` by default.
     * @default true
     */
    preventScrollBody?: boolean;
    /** Optional additional class names to style the drawer component. */
    className?: string;
    /** Optional inline styles to be applied to the drawer component. */
    style?: React.CSSProperties;
    /** Optional additional class names to style the background veil element. */
    veilClassName?: string;
    /** Optional callback function that is called when the veil (overlay) is clicked. */
    onVeilClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    /** Optional callback function that is called when the escape key is pressed, if the drawer is open. */
    onEscape?: () => void;
    /** Optional flag to hide the background darkening */
    hideVeil?: boolean;
    /** Optional flag to not use `Portal` for drawer */
    disablePortal?: boolean;
}
export declare const Drawer: React.FC<DrawerProps>;
export {};
