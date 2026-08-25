import * as React from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {Item, ItemProps} from './Item';
import {useLayoutContext} from './LayoutContext';
import {OverlayContextValue, OverlayProvider, useOverlayContext} from './OverlayContext';
import {withPart} from './internal/parts';
import {withSlot} from './internal/slots';

import styles from './Panel.module.scss';

const b = createBlock('aside-header-next-panel', styles);

export interface PanelProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * A drawer next to the rail. Declared where its trigger belongs (inside a
 * list); only `Panel.Content` travels — it is portaled into the panels
 * container on `Root`.
 *
 * A panel without a trigger (opened from page content) can stay a direct child
 * of `Root`, where the `panels` slot picks it up.
 */
function PanelComponent(props: PanelProps) {
    const {children, open: openProp, defaultOpen = false, onOpenChange} = props;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const reactId = React.useId();

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (openProp === undefined) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.(next);
        },
        [openProp, onOpenChange],
    );

    const noop = React.useCallback(() => {}, []);

    const value = React.useMemo<OverlayContextValue>(
        () => ({
            kind: 'panel',
            open,
            setOpen,
            triggerId: `${reactId}-trigger`,
            contentId: `${reactId}-content`,
            anchor: null,
            setAnchor: noop,
            onPointerEnter: noop,
            onPointerLeave: noop,
        }),
        [open, setOpen, reactId, noop],
    );

    return <OverlayProvider value={value}>{children}</OverlayProvider>;
}

/** Renders as a regular `Item` by default, plus the panel wiring. */
function PanelTriggerComponent(props: ItemProps) {
    const overlay = useOverlayContext('AsideHeaderNext.Panel.Trigger');

    return (
        <Item
            {...props}
            id={props.id ?? overlay.triggerId}
            active={props.active ?? (overlay.open || undefined)}
            data-open={overlay.open || undefined}
            aria-expanded={overlay.open}
            aria-controls={overlay.open ? overlay.contentId : undefined}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
                props.onClick?.(event);
                overlay.setOpen(!overlay.open);
            }}
        />
    );
}

export const PanelTrigger = withPart(PanelTriggerComponent, 'trigger');

export interface PanelContentProps {
    children?: React.ReactNode;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    keepMounted?: boolean;
    className?: string;
    contentClassName?: string;
}

function PanelContentComponent(props: PanelContentProps) {
    const {children, placement = 'left', keepMounted, className, contentClassName} = props;
    const overlay = useOverlayContext('AsideHeaderNext.Panel.Content');
    const {size, panelContainer} = useLayoutContext();

    return (
        <Drawer
            open={overlay.open}
            placement={placement}
            keepMounted={keepMounted}
            container={panelContainer ?? undefined}
            onOpenChange={(next) => {
                if (!next) {
                    overlay.setOpen(false);
                }
            }}
            className={b(null, className)}
            contentClassName={b('content', contentClassName)}
            style={{left: size, top: 'var(--gn-top-alert-height, 0px)'}}
        >
            <div id={overlay.contentId}>{children}</div>
        </Drawer>
    );
}

export const PanelContent = withPart(PanelContentComponent, 'content');

export const Panel = Object.assign(withSlot(PanelComponent, 'panels'), {
    Trigger: PanelTrigger,
    Content: PanelContent,
});
