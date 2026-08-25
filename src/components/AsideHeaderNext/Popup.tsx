import * as React from 'react';

import {PopupPlacement, Popup as UikitPopup} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {Item, ItemProps} from './Item';
import {useLayoutContext} from './LayoutContext';
import {OverlayContextValue, OverlayProvider, useOverlayContext} from './OverlayContext';
import {withPart} from './internal/parts';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './Popup.module.scss';

const b = createBlock('aside-header-next-popup', styles);

/**
 * Defaults lifted from the old `ItemPopup`, where they were private constants:
 * `POPUP_MAIN_AXIS_OFFSET`, `DEFAULT_POPUP_DELAY`, `placement: right-start`.
 */
const DEFAULT_SIDE_OFFSET = 14;
const DEFAULT_ALIGN_OFFSET = 0;
const DEFAULT_OPEN_DELAY = 100;
const DEFAULT_CLOSE_DELAY = 150;

export type PopupSide = 'top' | 'right' | 'bottom' | 'left';
export type PopupAlign = 'start' | 'center' | 'end';

export interface PopupProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** `hover` in a collapsed rail, `click` otherwise. */
    trigger?: 'hover' | 'click';
    disabled?: boolean;
}

function toPlacement(side: PopupSide, align: PopupAlign): PopupPlacement {
    return (align === 'center' ? side : `${side}-${align}`) as PopupPlacement;
}

/**
 * Overlay primitive that knows about the rail (offsets, side, hover intent,
 * nesting) and nothing about navigation. `Item` deliberately has no popup props.
 */
export function Popup(props: PopupProps) {
    const {children, open: openProp, defaultOpen = false, onOpenChange, trigger, disabled} = props;
    const {compact} = useLayoutContext();

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;

    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
    const reactId = React.useId();

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    React.useEffect(() => () => clearTimeout(timerRef.current), []);

    const setOpen = React.useCallback(
        (next: boolean) => {
            clearTimeout(timerRef.current);
            if (disabled && next) {
                return;
            }
            if (openProp === undefined) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.(next);
        },
        [disabled, openProp, onOpenChange],
    );

    const resolvedTrigger = trigger ?? (compact ? 'hover' : 'click');

    const scheduleOpen = React.useCallback(() => {
        if (resolvedTrigger !== 'hover') {
            return;
        }
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(true), DEFAULT_OPEN_DELAY);
    }, [resolvedTrigger, setOpen]);

    const scheduleClose = React.useCallback(() => {
        if (resolvedTrigger !== 'hover') {
            return;
        }
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(false), DEFAULT_CLOSE_DELAY);
    }, [resolvedTrigger, setOpen]);

    const value = React.useMemo<OverlayContextValue>(
        () => ({
            kind: 'popup',
            open,
            setOpen,
            triggerId: `${reactId}-trigger`,
            contentId: `${reactId}-content`,
            anchor,
            setAnchor,
            onPointerEnter: scheduleOpen,
            onPointerLeave: scheduleClose,
        }),
        [open, setOpen, reactId, anchor, scheduleOpen, scheduleClose],
    );

    return <OverlayProvider value={value}>{children}</OverlayProvider>;
}

/** Renders as a regular `Item` by default, plus the overlay wiring. */
function PopupTriggerComponent(props: ItemProps) {
    const overlay = useOverlayContext('AsideHeaderNext.Popup.Trigger');

    return (
        <Item
            {...props}
            ref={overlay.setAnchor}
            id={props.id ?? overlay.triggerId}
            active={props.active ?? (overlay.open || undefined)}
            data-open={overlay.open || undefined}
            aria-haspopup="menu"
            aria-expanded={overlay.open}
            aria-controls={overlay.open ? overlay.contentId : undefined}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
                props.onClick?.(event);
                overlay.setOpen(!overlay.open);
            }}
            onMouseEnter={overlay.onPointerEnter}
            onMouseLeave={overlay.onPointerLeave}
        />
    );
}

export const PopupTrigger = withPart(PopupTriggerComponent, 'trigger');

export interface PopupContentState extends Record<string, unknown> {
    open: boolean;
}

export interface PopupContentProps {
    children?: React.ReactNode;
    /** Optional heading above the content. */
    title?: React.ReactNode;
    side?: PopupSide;
    align?: PopupAlign;
    sideOffset?: number;
    alignOffset?: number;
    strategy?: 'absolute' | 'fixed';
    keepMounted?: boolean;
    /** Anchor override, e.g. the whole rail instead of the row. */
    anchor?: HTMLElement | null;
    className?: string;
    render?: RenderProp<PopupContentState>;
}

function PopupContentComponent(props: PopupContentProps) {
    const {
        children,
        title,
        side = 'right',
        align = 'start',
        sideOffset = DEFAULT_SIDE_OFFSET,
        alignOffset = DEFAULT_ALIGN_OFFSET,
        strategy = 'fixed',
        keepMounted = false,
        anchor,
        className,
        render,
    } = props;

    const overlay = useOverlayContext('AsideHeaderNext.Popup.Content');

    const body = useRenderElement<PopupContentState>('div', {
        state: {open: overlay.open},
        render,
        props: [
            {
                id: overlay.contentId,
                className: b('content', className),
                onMouseEnter: overlay.onPointerEnter,
                onMouseLeave: overlay.onPointerLeave,
                children: (
                    <React.Fragment>
                        {title ? <div className={b('title')}>{title}</div> : null}
                        {children}
                    </React.Fragment>
                ),
            },
        ],
    });

    return (
        <UikitPopup
            open={overlay.open}
            onOpenChange={(next) => overlay.setOpen(next)}
            anchorElement={anchor ?? overlay.anchor}
            placement={toPlacement(side, align)}
            offset={{mainAxis: sideOffset, crossAxis: alignOffset}}
            strategy={strategy}
            keepMounted={keepMounted}
        >
            {body}
        </UikitPopup>
    );
}

export const PopupContent = withPart(PopupContentComponent, 'content');

Popup.Trigger = PopupTrigger;
Popup.Content = PopupContent;
