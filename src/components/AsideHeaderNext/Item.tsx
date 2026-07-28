import * as React from 'react';

import {ChevronRight} from '@gravity-ui/icons';
import {
    ActionTooltip,
    Icon,
    IconProps,
    Popover,
    PopupPlacement,
    PopupProps,
} from '@gravity-ui/uikit';

import {ASIDE_HEADER_ICON_SIZE} from '../constants';
import {createBlock} from '../utils/cn';

import {ItemDefaultsProvider, useItemDefaults, useLayoutContext} from './LayoutContext';
import {useCompositeItem} from './internal/composite/useCompositeItem';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './Item.module.scss';

const b = createBlock('aside-header-next-item', styles);

const DEFAULT_POPUP_PLACEMENT: PopupPlacement = ['right-start', 'right'];
const DEFAULT_POPUP_OFFSET: NonNullable<PopupProps['offset']> = {mainAxis: 14};

export interface ItemState extends Record<string, unknown> {
    current: boolean;
    disabled: boolean;
    compact: boolean;
}

export interface ItemProps {
    id: string;
    icon?: IconProps['data'];
    iconSize?: number;
    /** Item title. */
    children?: React.ReactNode;
    current?: boolean;
    disabled?: boolean;
    href?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    /** `divider` renders a horizontal separator instead of an interactive row. */
    type?: 'item' | 'divider';
    /** Content rendered at the trailing edge of the row (e.g. a "New" tag). */
    rightAdornment?: React.ReactNode;
    /** Replace/compose the rendered element (e.g. router `Link`). */
    render?: RenderProp<ItemState>;
    /** Tooltip text. In compact mode the title is used as a fallback. */
    tooltipText?: React.ReactNode;
    /** Nested items shown in a flyout popup (collapsible item / "More"). */
    items?: ItemProps[];
    /** Optional title rendered above the popup items. */
    popupTitle?: string;
    /** Popup anchoring relative to the item (see base-ui Positioner concept). */
    popupPlacement?: PopupPlacement;
    popupOffset?: PopupProps['offset'];
    ref?: React.Ref<HTMLElement>;
}

function PopupItems({items, title}: {items: ItemProps[]; title?: string}) {
    return (
        <ItemDefaultsProvider value={{place: 'popup'}}>
            <div className={b('popup-content')}>
                {title && <div className={b('popup-title')}>{title}</div>}
                {items.map((item) => (
                    <Item key={item.id} {...item} />
                ))}
            </div>
        </ItemDefaultsProvider>
    );
}

function useItemElement(
    props: ItemProps,
    extra: {ref?: React.Ref<HTMLElement>; extraProps?: Record<string, unknown>},
): React.ReactElement {
    const {
        id,
        icon,
        iconSize,
        children,
        current,
        disabled,
        href,
        target,
        onClick,
        className,
        rightAdornment,
        render,
        tooltipText,
        items,
        popupTitle,
        popupPlacement = DEFAULT_POPUP_PLACEMENT,
        popupOffset = DEFAULT_POPUP_OFFSET,
        ref,
    } = props;
    const {compact} = useLayoutContext();
    const defaults = useItemDefaults();

    const resolvedIconSize = iconSize ?? defaults.iconSize ?? ASIDE_HEADER_ICON_SIZE;
    const hasPopup = Boolean(items?.length);

    const state: ItemState = {
        current: Boolean(current),
        disabled: Boolean(disabled),
        compact,
    };

    const content = (
        <React.Fragment>
            {icon && (
                <span className={b('icon')}>
                    <Icon data={icon} size={resolvedIconSize} />
                </span>
            )}
            <span className={b('title')}>{children}</span>
            {rightAdornment && <span className={b('right-adornment')}>{rightAdornment}</span>}
            {hasPopup && (
                <span className={b('chevron')}>
                    <Icon data={ChevronRight} size={compact ? 10 : 16} />
                </span>
            )}
        </React.Fragment>
    );

    const tag = href ? 'a' : 'button';

    let node = useRenderElement<ItemState>(tag, {
        render,
        ref: [ref, extra.ref],
        state,
        props: [
            {
                'data-id': id,
                className: b(
                    {
                        current: state.current,
                        disabled: state.disabled,
                        compact,
                        place: defaults.place,
                    },
                    className,
                ),
                children: content,
                onClick: disabled ? undefined : onClick,
                'aria-current': state.current ? 'page' : undefined,
                'aria-disabled': state.disabled || undefined,
                ...(href ? {href, target} : {type: 'button', disabled}),
            },
            extra.extraProps,
        ],
    });

    if (hasPopup && items) {
        node = (
            <Popover
                placement={popupPlacement}
                offset={popupOffset}
                content={<PopupItems items={items} title={popupTitle} />}
                className={b('popup')}
            >
                {node}
            </Popover>
        );
    } else {
        const tooltip = compact
            ? (tooltipText ?? (typeof children === 'string' ? children : undefined))
            : tooltipText;

        if (tooltip) {
            node = (
                <ActionTooltip title={String(tooltip)} placement="right">
                    {node}
                </ActionTooltip>
            );
        }
    }

    return node;
}

function MenuItem(props: ItemProps) {
    const composite = useCompositeItem();
    return useItemElement(props, {ref: composite.ref, extraProps: composite.props});
}

function PlainItem(props: ItemProps) {
    return useItemElement(props, {});
}

export function Item(props: ItemProps) {
    const defaults = useItemDefaults();
    if (props.type === 'divider') {
        return <div className={b('divider', undefined, props.className)} role="separator" />;
    }
    return defaults.place === 'menu' ? <MenuItem {...props} /> : <PlainItem {...props} />;
}
