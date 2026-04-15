import React from 'react';

import {ActionTooltip, Icon, Popover, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {ASIDE_HEADER_ICON_SIZE} from '../../../../constants';
import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {COLLAPSE_ITEM_ID, ITEM_TYPE_REGULAR} from '../constants';

import {CollapsedPopup} from './CollapsedPopup';
import {ItemInnerProps, ItemProps} from './Item.types';
import {renderItemTitle} from './renderItemTitle';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        className,
        collapseItems,
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
    } = props;

    const [open, toggleOpen] = React.useState<boolean>(false);

    const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const current = props.current || false;
    const tooltipText = props.tooltipText || props.title;
    const icon = props.icon;
    const iconSize = props.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = props.iconQa;
    const collapsedItem = props.id === COLLAPSE_ITEM_ID;

    const handleOpenChangePopup = React.useCallback<NonNullable<ItemProps['onOpenChangePopup']>>(
        (newOpen, event, reason) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onOpenChangePopup?.(newOpen, event, reason);
        },
        [onOpenChangePopup],
    );

    if (type === 'divider') {
        return <div className={b('menu-divider')} />;
    }

    const compactPopoverDisabled = !enableTooltip || (collapsedItem && open) || popupVisible;

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

        if (collapsedItem) {
            return (
                <ActionTooltip
                    title=""
                    description={tooltipText}
                    disabled={compactPopoverDisabled}
                    placement="right"
                    className={b('icon-tooltip', {'item-type': type})}
                >
                    {iconButton}
                </ActionTooltip>
            );
        }

        return (
            <Popover
                disabled={compactPopoverDisabled}
                placement="right"
                strategy="fixed"
                offset={defaultPopupOffset}
                enableSafePolygon
                openDelay={100}
                closeDelay={100}
                className={b('icon-popover', {'item-type': type})}
                content={
                    <div className={b('compact-popover-content')}>
                        <Item
                            {...props}
                            qa={undefined}
                            compact={false}
                            className={b('compact-popover-item', props.className)}
                            hideIcon
                            stopClickPropagation
                            enableTooltip={false}
                            bringForward={false}
                            popupVisible={false}
                            renderPopupContent={undefined}
                            onOpenChangePopup={undefined}
                            popupRef={undefined}
                        />
                    </div>
                }
            >
                {iconButton}
            </Popover>
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const [Tag, tagProps] = href ? ['a' as const, {href}] : ['button' as const, {}];

        const createdNode = (
            <React.Fragment>
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

                        if (collapsedItem) {
                            /**
                             * This is the "more" button (three dots) that shows additional menu items in a popup.
                             * We call onItemClick with collapsed=true to indicate this is a collapse action.
                             */
                            toggleOpen(!open);
                            onItemClick?.(props, true, event);
                        } else {
                            onItemClick?.(props, false, event);
                        }
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
                    <div className={b('icon-place')} ref={highlightedRef}>
                        {makeIconNode(iconEl)}
                    </div>

                    <div
                        className={b('title')}
                        title={typeof title === 'string' ? title : undefined}
                    >
                        {titleEl}
                    </div>
                </Tag>
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
            {open && collapsedItem && collapseItems?.length && Boolean(anchorRef?.current) && (
                <CollapsedPopup
                    {...props}
                    anchorRef={anchorRef}
                    onOpenChange={() => toggleOpen(false)}
                />
            )}
        </React.Fragment>
    );
};

Item.displayName = 'Item';
