import React from 'react';
import {block} from '../../utils/cn';

import {List, Icon, Popup, PopupPlacement, PopupProps, Tooltip} from '@gravity-ui/uikit';

import {MakeItemParams, MenuItem} from '../../types';
import {getSelectedItemIndex} from '../utils';
import {
    COLLAPSE_ITEM_ID,
    POPUP_ITEM_HEIGHT,
    POPUP_PLACEMENT,
    ICON_SIZE,
    ITEM_TYPE_REGULAR,
} from '../constants';

import './Item.scss';

const b = block('composite-bar-item');

interface ItemPopup {
    popupVisible?: boolean;
    popupAnchor?: React.RefObject<HTMLElement>;
    popupPlacement?: PopupPlacement;
    popupOffset?: PopupProps['offset'];
    popupKeepMounted?: boolean;
    renderPopupContent?: () => React.ReactNode;
    onClosePopup?: () => void;
}

export interface ItemProps extends ItemPopup {
    item: MenuItem;
    enableTooltip?: boolean;
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
}

interface ItemInnerProps extends ItemProps {
    compact: boolean;
    className?: string;
    collapseItems?: MenuItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

function renderItemTitle(item: MenuItem) {
    let titleNode = <div className={b('title-text')}>{item.title}</div>;

    if (item.rightAdornment) {
        titleNode = (
            <React.Fragment>
                {titleNode}
                <div className={b('title-adornment')}>{item.rightAdornment}</div>
            </React.Fragment>
        );
    }

    return titleNode;
}

export const defaultPopupPlacement: PopupPlacement = ['right-end'];
export const defaultPopupOffset: NonNullable<PopupProps['offset']> = [-20, 8];

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        item,
        compact,
        className,
        collapseItems,
        onMouseLeave,
        onMouseEnter,
        enableTooltip = true,
        popupVisible = false,
        popupAnchor,
        popupPlacement = defaultPopupPlacement,
        popupOffset = defaultPopupOffset,
        popupKeepMounted,
        renderPopupContent,
        onClosePopup,
        onItemClick,
    } = props;

    if (item.type === 'divider') {
        return <div className={b('menu-divider')} />;
    }

    const [open, toggleOpen] = React.useState<boolean>(false);

    const ref = React.useRef<HTMLDivElement>(null);
    const anchorRef = popupAnchor || ref;

    const type = item.type || ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || ICON_SIZE;
    const collapsedItem = item.id === COLLAPSE_ITEM_ID;

    const onClose = React.useCallback(
        (event: MouseEvent | KeyboardEvent) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onClosePopup?.();
        },
        [onClosePopup],
    );

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const createdNode = (
            <div
                className={b({type, current, compact}, className)}
                ref={ref}
                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    if (collapsedItem) {
                        /**
                         * If we call onItemClick for collapsedItem then:
                         * - User get unexpected item in onItemClick callback
                         * - onClosePanel calls twice for each popuped item, as result it will prevent opening of panelItems
                         */
                        toggleOpen(!open);
                    } else {
                        onItemClick?.(item, false, event);
                    }
                }}
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
                <div className={b('icon-place')}>
                    {compact ? (
                        <Tooltip
                            content={tooltipText}
                            disabled={!enableTooltip || (collapsedItem && open)}
                            placement="right"
                            className={b('icon-tooltip', {'item-type': type})}
                        >
                            <div
                                onMouseEnter={() => onMouseEnter?.()}
                                onMouseLeave={() => onMouseLeave?.()}
                                className={b('btn-icon')}
                            >
                                {iconEl}
                            </div>
                        </Tooltip>
                    ) : (
                        iconEl
                    )}
                </div>

                <div
                    className={b('title')}
                    title={typeof item.title === 'string' ? item.title : undefined}
                >
                    {titleEl}
                </div>

                {renderPopupContent && Boolean(anchorRef?.current) && (
                    <Popup
                        contentClassName={b('popup')}
                        open={popupVisible}
                        keepMounted={popupKeepMounted}
                        placement={popupPlacement}
                        offset={popupOffset}
                        anchorRef={anchorRef}
                        onClose={onClose}
                    >
                        {renderPopupContent()}
                    </Popup>
                )}
            </div>
        );

        return item.link ? (
            <a href={item.link} className={b('link')}>
                {createdNode}
            </a>
        ) : (
            createdNode
        );
    };

    const iconNode = icon ? <Icon data={icon} size={iconSize} className={b('icon')} /> : null;
    const titleNode = renderItemTitle(item);
    const params = {icon: iconNode, title: titleNode};
    let node;

    const opts = {compact, collapsed: false, item};

    if (typeof item.itemWrapper === 'function') {
        node = item.itemWrapper(params, makeNode, opts) as React.ReactElement;
    } else {
        node = makeNode(params);
    }

    return (
        <>
            {node}
            {open && collapsedItem && collapseItems?.length && Boolean(anchorRef?.current) && (
                <CollapsedPopup {...props} anchorRef={ref} onClose={() => toggleOpen(false)} />
            )}
        </>
    );
};

Item.displayName = 'Item';

interface CollapsedPopupProps {
    anchorRef?: React.RefObject<HTMLElement>;
    onClose: () => void;
}

function CollapsedPopup({
    compact,
    onItemClick,
    collapseItems,
    anchorRef,
    onClose,
}: ItemInnerProps & CollapsedPopupProps) {
    return collapseItems?.length ? (
        <Popup placement={POPUP_PLACEMENT} open={true} anchorRef={anchorRef} onClose={onClose}>
            <div className={b('collapse-items-popup-content')}>
                <List
                    itemClassName={b('root-collapse-item')}
                    items={collapseItems}
                    selectedItemIndex={getSelectedItemIndex(collapseItems)}
                    itemHeight={POPUP_ITEM_HEIGHT}
                    itemsHeight={collapseItems.length * POPUP_ITEM_HEIGHT}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    renderItem={(collapseItem) => {
                        const makeCollapseNode = ({title: titleEl}: MakeItemParams) => {
                            const res = (
                                <div
                                    className={b('collapse-item')}
                                    onClick={(
                                        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                                    ) => {
                                        onItemClick?.(collapseItem, true, event);
                                    }}
                                >
                                    {titleEl}
                                </div>
                            );

                            return collapseItem.link ? (
                                <a href={collapseItem.link} className={b('link')}>
                                    {res}
                                </a>
                            ) : (
                                res
                            );
                        };

                        const titleNode = renderItemTitle(collapseItem);
                        const params = {title: titleNode};
                        const opts = {compact, collapsed: true, item: collapseItem};
                        if (typeof collapseItem.itemWrapper === 'function') {
                            return collapseItem.itemWrapper(params, makeCollapseNode, opts);
                        } else {
                            return makeCollapseNode(params);
                        }
                    }}
                />
            </div>
        </Popup>
    ) : null;
}
