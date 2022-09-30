import React from 'react';
import {CSSTransition, Transition} from 'react-transition-group';
import block from 'bem-cn-lite';

import './Drawer.scss';

const b = block('drawer');
const TIMEOUT = 300;

export interface DrawerItemProps {
    id: string;
    content: React.ReactNode;
    visible: boolean;
    className?: string;
}

export const DrawerItem: React.FC<DrawerItemProps> = ({visible, content, className}) => {
    const itemRef = React.useRef<HTMLDivElement>(null);
    return (
        <CSSTransition
            in={visible}
            timeout={TIMEOUT}
            unmountOnExit={true}
            classNames={b('item-transition')}
            nodeRef={itemRef}
        >
            <div ref={itemRef} className={b('item', className)}>
                {content}
            </div>
        </CSSTransition>
    );
};

type DrawerChild = React.ReactElement<DrawerItemProps>;

export interface DrawerProps {
    children: DrawerChild | DrawerChild[];
    preventSrcollBody?: boolean;
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
    preventSrcollBody = true,
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

    React.useEffect(() => {
        const prevPreventSrcollBody = preventSrcollBody;
        const cleanupPreventScrollBody = () => {
            document.body.style.paddingRight = '';
            document.body.style.paddingBottom = '';
            document.body.style.overflow = '';
        };
        const setPreventScrollBody = () => {
            const vw = window.innerWidth - document.documentElement.clientWidth;
            const hw = window.innerHeight - document.documentElement.clientHeight;
            document.body.style.paddingRight = vw + 'px';
            document.body.style.paddingBottom = hw + 'px';
            document.body.style.overflow = 'hidden';
        };
        if (prevPreventSrcollBody) {
            if (someItemVisible) {
                setPreventScrollBody();
            } else {
                cleanupPreventScrollBody();
            }
        }
        return () => {
            if (prevPreventSrcollBody) {
                cleanupPreventScrollBody();
            }
        };
    }, [someItemVisible, preventSrcollBody]);

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
