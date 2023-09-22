import React from 'react';
import {CSSTransition, Transition} from 'react-transition-group';

import {useBodyScrollLock} from '@gravity-ui/uikit';

import {block} from '../utils/cn';

import './Drawer.scss';

const b = block('drawer');
const TIMEOUT = 300;

export interface DrawerItemProps {
    id: string;
    content: React.ReactNode;
    visible: boolean;
    direction?: 'right' | 'left';
    className?: string;
}

export const DrawerItem: React.FC<DrawerItemProps> = ({visible, content, direction, className}) => {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const cssDirection = direction === 'left' ? undefined : direction;

    return (
        <CSSTransition
            in={visible}
            timeout={TIMEOUT}
            unmountOnExit={true}
            classNames={b('item-transition', {direction: cssDirection})}
            nodeRef={itemRef}
        >
            <div ref={itemRef} className={b('item', {direction: cssDirection}, className)}>
                {content}
            </div>
        </CSSTransition>
    );
};

type DrawerChild = React.ReactElement<DrawerItemProps>;

export interface DrawerProps {
    children: DrawerChild | DrawerChild[];
    preventScrollBody?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onVeilClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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
        const childElem = child as DrawerChild;
        if (childElem.type === DrawerItem) {
            const childVisible = Boolean(childElem.props.visible);
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
                            unmountOnExit={true}
                            classNames={b('veil-transition')}
                            nodeRef={veilRef}
                        >
                            <div ref={veilRef} className={b('veil')} onClick={onVeilClick} />
                        </CSSTransition>
                        {React.Children.map(children, (child) => {
                            const childElem = child as DrawerChild;
                            if (childElem.type === DrawerItem) {
                                const childVisible = Boolean(childElem.props.visible);
                                return React.cloneElement(childElem, {
                                    ...childElem.props,
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
