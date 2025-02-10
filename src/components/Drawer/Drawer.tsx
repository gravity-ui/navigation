import React from 'react';

import {Portal, useBodyScrollLock, useForkRef} from '@gravity-ui/uikit';
import {CSSTransition, Transition} from 'react-transition-group';

import {block} from '../utils/cn';

import {type DrawerDirection, useResizableDrawerItem} from './utils';

import './Drawer.scss';

const b = block('drawer');
const TIMEOUT = 300;

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

    /** Called at the start of resizing. */
    onResizeStart?: VoidFunction;

    /**
     * Called at the end of resizing. Can be used to save the new width.
     * @param width The new width of the drawer item
     */
    onResize?: (width: number) => void;

    /** The minimum width of the resizable drawer item */
    minResizeWidth?: number;

    /** The maximum width of the resizable drawer item */
    maxResizeWidth?: number;

    /**
     * Keep child components mounted when closed, prioritized over Drawer.keepMounted property
     * @default false
     * */
    keepMounted?: boolean;
}

export const DrawerItem = React.forwardRef<HTMLDivElement, DrawerItemProps>(
    function DrawerItem(props, ref) {
        const {
            visible,
            content,
            children,
            direction = 'left',
            className,
            resizable,
            width,
            minResizeWidth,
            maxResizeWidth,
            onResizeStart,
            onResize,
            keepMounted = false,
        } = props;

        const [isInitialRender, setInitialRender] = React.useState(true);
        const itemRef = React.useRef<HTMLDivElement>(null);
        const handleRef = useForkRef(ref, itemRef);

        const cssDirection = direction === 'left' ? undefined : direction;

        const {resizedWidth, resizerHandlers, isResizing} = useResizableDrawerItem({
            direction,
            width,
            minResizeWidth,
            maxResizeWidth,
            onResizeStart,
            onResize,
        });

        React.useEffect(() => {
            setInitialRender(true);
        }, [direction]);

        const resizerElement = resizable ? (
            <div className={b('resizer', {direction})} {...resizerHandlers}>
                <div className={b('resizer-handle')} />
            </div>
        ) : null;

        return (
            <CSSTransition
                in={visible}
                timeout={TIMEOUT}
                mountOnEnter={!keepMounted}
                unmountOnExit={!keepMounted}
                classNames={b('item-transition', {direction: cssDirection})}
                nodeRef={itemRef}
                onEnter={() => setInitialRender(false)}
                onExit={() => setInitialRender(false)}
            >
                <div
                    ref={handleRef}
                    className={b(
                        'item',
                        {
                            direction: cssDirection,
                            hidden: isInitialRender && !visible,
                            resize: isResizing,
                        },
                        [className],
                    )}
                    style={{width: resizable ? `${resizedWidth}px` : undefined}}
                >
                    {resizerElement}
                    {children ?? content}
                </div>
            </CSSTransition>
        );
    },
);

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

    /**
     * Keep child components mounted when closed
     * @default false
     * */
    keepMounted?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
    className,
    veilClassName,
    children,
    style,
    onVeilClick,
    onEscape,
    preventScrollBody = true,
    hideVeil,
    disablePortal = true,
    keepMounted = false,
}) => {
    let someItemVisible = false;
    React.Children.forEach(children, (child) => {
        if (React.isValidElement<DrawerItemProps>(child) && child.type === DrawerItem) {
            const childVisible = Boolean(child.props.visible);
            if (childVisible) {
                someItemVisible = true;
            }
        }
    });

    React.useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onEscape?.();
            }
        }
        if (someItemVisible) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onEscape, someItemVisible]);

    useBodyScrollLock({enabled: preventScrollBody && someItemVisible});

    const containerRef = React.useRef<HTMLDivElement>(null);
    const veilRef = React.useRef<HTMLDivElement>(null);

    const drawer = (
        <Transition
            in={someItemVisible}
            timeout={{enter: 0, exit: TIMEOUT}}
            mountOnEnter={!keepMounted}
            unmountOnExit={!keepMounted}
            nodeRef={containerRef}
        >
            {(state) => {
                const childrenVisible = someItemVisible && state === 'entered';
                return (
                    <div ref={containerRef} className={b({hideVeil}, className)} style={style}>
                        <CSSTransition
                            in={childrenVisible}
                            timeout={TIMEOUT}
                            unmountOnExit
                            classNames={b('veil-transition')}
                            nodeRef={veilRef}
                        >
                            <div
                                ref={veilRef}
                                className={b('veil', {hidden: hideVeil}, veilClassName)}
                                onClick={onVeilClick}
                            />
                        </CSSTransition>
                        {React.Children.map(children, (child) => {
                            if (
                                React.isValidElement<DrawerItemProps>(child) &&
                                child.type === DrawerItem
                            ) {
                                const childVisible = Boolean(child.props.visible);
                                return React.cloneElement(child, {
                                    keepMounted,
                                    ...child.props,
                                    visible: childVisible && childrenVisible,
                                });
                            }
                            return child;
                        })}
                    </div>
                );
            }}
        </Transition>
    );

    if (disablePortal) {
        return drawer;
    }

    return <Portal>{drawer}</Portal>;
};
