import * as React from 'react';

import {ActionTooltip, Icon, IconProps} from '@gravity-ui/uikit';

import {ASIDE_HEADER_ICON_SIZE} from '../constants';

import {useReportActive} from './ActiveScope';
import {ItemPlace, useItemListContext, useLayoutContext} from './LayoutContext';
import {useIsCurrent} from './NavigationContext';
import {RowBody, RowLeading, RowTrailing, rowBlock} from './Row';
import {useCompositeItem} from './internal/composite/useCompositeItem';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

export interface ItemState extends Record<string, unknown> {
    current: boolean;
    active: boolean;
    disabled: boolean;
    compact: boolean;
    place: ItemPlace;
}

export interface ItemProps extends React.AriaAttributes {
    id: string;
    icon?: IconProps['data'];
    iconSize?: number;
    /** Item title. */
    children?: React.ReactNode;
    /** Trailing content, e.g. a "New" label. Hidden in compact. */
    rightAdornment?: React.ReactNode;
    href?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    /** Matches the current URL. Falls back to `Root.currentPath` + `href`. */
    current?: boolean;
    /** Hard override for the highlight. Overlay triggers use it. */
    active?: boolean;
    disabled?: boolean;
    /** Tooltip text; in compact the title is used as a fallback. */
    tooltipText?: React.ReactNode;
    className?: string;
    qa?: string;
    /** Replace/compose the rendered element (e.g. a router `Link`). */
    render?: RenderProp<ItemState>;
    ref?: React.Ref<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
    /** Set by overlay triggers and `GroupItem`; not part of the row's own API. */
    'data-open'?: boolean;
    'data-expanded'?: boolean;
    'data-has-active-descendant'?: boolean;
}

/**
 * A single navigation row. Knows nothing about overlays: no `open`, no `panel`,
 * no `popup*` props — those live in `Popup` / `Panel`, whose triggers render an
 * `Item` by default.
 */
export function Item(props: ItemProps) {
    const {
        id,
        icon,
        iconSize,
        children,
        rightAdornment,
        href,
        target,
        onClick,
        current: currentProp,
        active: activeProp,
        disabled,
        tooltipText,
        className,
        qa,
        render,
        ref,
        ...rest
    } = props;

    const {compact: railCompact} = useLayoutContext();
    const list = useItemListContext();
    const matchedByPath = useIsCurrent(href);

    // A popup always has room, so its rows stay expanded even in a compact rail.
    const compact = railCompact && list.place !== 'popup';
    const overlayOpen = props['data-open'];

    const current = currentProp ?? matchedByPath;
    const active = activeProp ?? current;

    useReportActive(id, active && !disabled);

    // Rows only join a roving scope where one exists (i.e. inside overlays).
    const composite = useCompositeItem(list.keyboard === 'roving');

    const resolvedIconSize = iconSize ?? list.iconSize ?? ASIDE_HEADER_ICON_SIZE;
    const state: ItemState = {
        current,
        active,
        disabled: Boolean(disabled),
        compact,
        place: list.place,
    };

    const tag = href ? 'a' : 'button';

    const node = useRenderElement<ItemState>(tag, {
        render,
        ref: [ref, composite.ref],
        state,
        props: [
            {
                className: rowBlock({interactive: true}, className),
                'data-id': id,
                'data-qa': qa,
                'data-place': list.place,
                'data-compact': compact || undefined,
                'data-current': current || undefined,
                'data-active': active || undefined,
                'data-disabled': disabled || undefined,
                'aria-current': current ? 'page' : undefined,
                'aria-disabled': disabled || undefined,
                onClick: disabled ? undefined : onClick,
                ...(href ? {href, target} : {type: 'button', disabled}),
                children: (
                    <React.Fragment>
                        <RowLeading>
                            {icon ? <Icon data={icon} size={resolvedIconSize} /> : null}
                        </RowLeading>
                        <RowBody>
                            <span className={rowBlock('title')}>{children}</span>
                        </RowBody>
                        {rightAdornment ? <RowTrailing>{rightAdornment}</RowTrailing> : null}
                    </React.Fragment>
                ),
            },
            composite.props,
            rest,
        ],
    });

    const tooltip = compact
        ? (tooltipText ?? (typeof children === 'string' ? children : undefined))
        : tooltipText;

    // Never tooltip on top of the overlay this row has just opened.
    if (tooltip && !overlayOpen) {
        return (
            <ActionTooltip title={String(tooltip)} placement="right">
                {node}
            </ActionTooltip>
        );
    }

    return node;
}
