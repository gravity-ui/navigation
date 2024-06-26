import React from 'react';

import {useBodyScrollLock} from '@gravity-ui/uikit';
import {CSSTransition, Transition} from 'react-transition-group';

import {block} from '../utils/cn';

import './Drawer.scss';

const b = block('drawer');
const TIMEOUT = 300;

export type DrawerDirection = 'right' | 'left';

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
}

export const DrawerItem: React.FC<DrawerItemProps> = ({
    visible,
    content,
    children,
    direction = 'left',
    className,
}) => {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const cssDirection = direction === 'left' ? undefined : direction;

    return (
        <CSSTransition
            in={visible}
            timeout={TIMEOUT}
            unmountOnExit
            classNames={b('item-transition', {direction: cssDirection})}
            nodeRef={itemRef}
        >
            <div ref={itemRef} className={b('item', {direction: cssDirection}, className)}>
                {children ?? content}
            </div>
        </CSSTransition>
    );
};

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

    /** Optional callback function that is called when the veil (overlay) is clicked. */
    onVeilClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

    /** Optional callback function that is called when the escape key is pressed, if the drawer is open. */
    onEscape?: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
    className,
    children,
    style,
    onVeilClick,
    onEscape,
    preventScrollBody = true,
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

    return (
        <Transition
            in={someItemVisible}
            timeout={{enter: 0, exit: TIMEOUT}}
            mountOnEnter
            unmountOnExit
            nodeRef={containerRef}
        >
            {(state) => {
                const childrenVisible = someItemVisible && state === 'entered';
                return (
                    <div ref={containerRef} className={b(null, className)} style={style}>
                        <CSSTransition
                            in={childrenVisible}
                            timeout={TIMEOUT}
                            unmountOnExit
                            classNames={b('veil-transition')}
                            nodeRef={veilRef}
                        >
                            <div ref={veilRef} className={b('veil')} onClick={onVeilClick} />
                        </CSSTransition>
                        {React.Children.map(children, (child) => {
                            if (
                                React.isValidElement<DrawerItemProps>(child) &&
                                child.type === DrawerItem
                            ) {
                                const childVisible = Boolean(child.props.visible);
                                return React.cloneElement(child, {
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
};
