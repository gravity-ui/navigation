import React from 'react';

import {ChevronDown, ChevronRight, ChevronUp} from '@gravity-ui/icons';
import {Icon, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {ASIDE_HEADER_ICON_SIZE} from '../../../../constants';
import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {COLLAPSE_ITEM_ID, ITEM_TYPE_REGULAR} from '../constants';

import {ItemInnerProps, ItemProps} from './Item.types';
import {ItemPopup} from './ItemPopup';
import {ItemPopupNestContext} from './ItemPopupNestContext';
import {renderItemTitle} from './renderItemTitle';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};
const CHEVRON_SIZE = 16;
const CHEVRON_SIZE_COMPACT = 10;

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        className,
        popupItemClassName,
        menuPopupItems,
        menuPopupTitle,
        groupHeaderExpanded,
        compact,
        onMouseLeave,
        onMouseEnter,
        enableTooltip = true,
        popupVisible = false,
        popupRef: anchoreRefProp,
        popupPlacement = defaultPopupPlacement,
        popupOffset = defaultPopupOffset,
        popupKeepMounted,
        renderPopupContent,
        onOpenChangePopup,
        onItemClick,
        onItemClickCapture,
        itemWrapper,
        bringForward,
        rightAdornment,
        title,
        href,
        qa,
        hideIcon = false,
        stopClickPropagation = false,
        menuGroupNestedTreeConnector,
    } = props;

    const [compactNavPopoverOpen, setCompactNavPopoverOpen] = React.useState(false);

    const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const current = props.current || false;
    const icon = props.icon;
    const iconSize = props.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = props.iconQa;
    const collapsedItem = props.id === COLLAPSE_ITEM_ID;
    const inlineGroupHeader = groupHeaderExpanded !== undefined;
    const resolvedMenuPopupItems = menuPopupItems ?? props.compositeBarMenuPopupItems;
    const resolvedMenuPopupTitle = menuPopupTitle ?? props.compositeBarMenuPopupTitle;

    const handleOpenChangePopup = React.useCallback<NonNullable<ItemProps['onOpenChangePopup']>>(
        (newOpen, event, reason) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }

            if (newOpen) {
                setCompactNavPopoverOpen(false);
            }

            onOpenChangePopup?.(newOpen, event, reason);
        },
        [onOpenChangePopup],
    );

    const isDivider = type === 'divider';
    const showMenuPopup =
        !isDivider &&
        Boolean(resolvedMenuPopupItems?.length) &&
        (collapsedItem || !inlineGroupHeader);

    const submenuNest = React.useContext(ItemPopupNestContext);

    React.useEffect(() => {
        if (!submenuNest || !showMenuPopup || !compactNavPopoverOpen) {
            return undefined;
        }

        submenuNest.registerNestedOpen(1);

        return () => {
            submenuNest.registerNestedOpen(-1);
        };
    }, [submenuNest, showMenuPopup, compactNavPopoverOpen]);

    if (isDivider) {
        return <div className={b('menu-divider')} />;
    }

    const compactPopoverDisabled = !enableTooltip || popupVisible || type === 'action';

    const makeIconNode = (iconEl: React.ReactNode): React.ReactNode => {
        if (!compact) {
            return iconEl;
        }

        const iconButton = (
            <div
                onMouseEnter={() => onMouseEnter?.()}
                onMouseLeave={() => onMouseLeave?.()}
                className={b('btn-icon')}
            >
                {iconEl}
            </div>
        );

        if (resolvedMenuPopupItems?.length) {
            return iconButton;
        }

        return (
            <ItemPopup
                items={[props]}
                open={compactNavPopoverOpen}
                onOpenChange={(nextOpen) => {
                    if (nextOpen && compactPopoverDisabled) return;
                    setCompactNavPopoverOpen(nextOpen);
                }}
                hideIcon
                itemClassName={popupItemClassName}
                disabled={compactPopoverDisabled}
                type={type}
                collapsed={compact}
                onItemClick={onItemClick}
            >
                {iconButton}
            </ItemPopup>
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const [Tag, tagProps] = href ? ['a' as const, {href}] : ['button' as const, {}];

        const tagNode = (
            <Tag
                {...tagProps}
                className={b({type, current, compact, 'hide-icon': hideIcon}, className)}
                ref={ref}
                data-type={type}
                data-qa={qa}
                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    if (stopClickPropagation) {
                        event.stopPropagation();
                    }

                    if (compact && !collapsedItem) {
                        setCompactNavPopoverOpen(false);
                    }

                    onItemClick?.(props, collapsedItem, event);
                }}
                onClickCapture={onItemClickCapture}
                onMouseEnter={() => {
                    if (!compact) {
                        onMouseEnter?.();
                    }
                }}
                onMouseLeave={() => {
                    if (!compact) {
                        onMouseLeave?.();
                    }
                }}
            >
                {menuGroupNestedTreeConnector}
                <div className={b('icon-place')} ref={highlightedRef}>
                    {makeIconNode(iconEl)}
                </div>

                <div className={b('title')} title={typeof title === 'string' ? title : undefined}>
                    {titleEl}
                </div>

                {inlineGroupHeader ? (
                    <div className={b('chevron')}>
                        <Icon
                            data={groupHeaderExpanded ? ChevronUp : ChevronDown}
                            size={compact ? CHEVRON_SIZE_COMPACT : CHEVRON_SIZE}
                        />
                    </div>
                ) : (
                    Boolean(resolvedMenuPopupItems?.length) && (
                        <div className={b('chevron')}>
                            <Icon
                                data={ChevronRight}
                                size={compact ? CHEVRON_SIZE_COMPACT : CHEVRON_SIZE}
                            />
                        </div>
                    )
                )}
            </Tag>
        );

        const expandedMenuRows = resolvedMenuPopupItems;

        const wrappedTagNode =
            showMenuPopup && expandedMenuRows ? (
                <ItemPopup
                    items={expandedMenuRows}
                    title={resolvedMenuPopupTitle}
                    open={compactNavPopoverOpen}
                    itemClassName={popupItemClassName}
                    onOpenChange={setCompactNavPopoverOpen}
                    collapsed={collapsedItem ? true : compact}
                    onItemClick={onItemClick}
                >
                    {tagNode}
                </ItemPopup>
            ) : (
                tagNode
            );

        const createdNode = (
            <React.Fragment>
                {wrappedTagNode}
                {renderPopupContent && Boolean(anchorRef?.current) && (
                    <Popup
                        strategy="fixed"
                        open={popupVisible}
                        keepMounted={popupKeepMounted}
                        placement={popupPlacement}
                        offset={popupOffset}
                        anchorElement={anchorRef.current}
                        onOpenChange={handleOpenChangePopup}
                    >
                        {renderPopupContent()}
                    </Popup>
                )}
            </React.Fragment>
        );

        return createdNode;
    };

    const iconNode =
        hideIcon || !icon ? null : (
            <Icon qa={iconQa} data={icon} size={iconSize} className={b('icon')} />
        );
    const titleNode = renderItemTitle({title, rightAdornment});
    const params = {icon: iconNode, title: titleNode};
    let highlightedNode = null;
    let node;

    const opts = {compact: Boolean(compact), collapsed: false, item: props, ref};

    if (typeof itemWrapper === 'function') {
        node = itemWrapper(params, makeNode, opts) as React.ReactElement;
        highlightedNode =
            bringForward &&
            (itemWrapper(
                params,
                ({icon: iconEl}) => makeIconNode(iconEl),
                opts,
            ) as React.ReactElement);
    } else {
        node = makeNode(params);
        highlightedNode = bringForward && makeIconNode(iconNode);
    }

    return (
        <React.Fragment>
            {bringForward && (
                <HighlightedItem
                    iconNode={highlightedNode}
                    iconRef={highlightedRef}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        onItemClick?.(props, false, event)
                    }
                    onClickCapture={onItemClickCapture}
                />
            )}
            {node}
        </React.Fragment>
    );
};

Item.displayName = 'Item';
