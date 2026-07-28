import * as React from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {useLayoutContext} from './LayoutContext';
import {withSlot} from './internal/slots';

import styles from './Panel.module.scss';

const b = createBlock('aside-header-next-panel', styles);

export interface PanelProps {
    id: string;
    open?: boolean;
    onClose?: () => void;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    children?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    keepMounted?: boolean;
}

/**
 * A drawer panel anchored next to the navigation (e.g. search / settings).
 * In `slots` layout it can be a direct child of `Root`.
 */
function PanelComponent(props: PanelProps) {
    const {
        open,
        onClose,
        placement = 'left',
        children,
        className,
        contentClassName,
        keepMounted,
    } = props;
    const {size} = useLayoutContext();

    return (
        <Drawer
            open={Boolean(open)}
            placement={placement}
            keepMounted={keepMounted}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    onClose?.();
                }
            }}
            className={b(null, className)}
            contentClassName={b('content', contentClassName)}
            style={{left: size, top: 'var(--gn-top-alert-height, 0px)'}}
        >
            {children}
        </Drawer>
    );
}

export const Panel = withSlot(PanelComponent, 'panels');
