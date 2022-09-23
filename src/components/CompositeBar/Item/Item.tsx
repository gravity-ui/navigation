import React from 'react';
import block from 'bem-cn-lite';

import {List, Popup, Icon} from '@gravity-ui/uikit';

import {ItemTooltip} from '../../ItemTooltip/ItemTooltip';
import {MenuItem} from '../../types';
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

interface ItemProps {
    item: MenuItem;
    compact: boolean;
    collapseItems: MenuItem[] | null;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
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

export const Item: React.FC<ItemProps> = ({
    item,
    compact,
    collapseItems,
    onClick,
    onMouseLeave,
    onMouseEnter,
}) => {
    const [tooltipAnchor, setTooltipAnchor] = React.useState<HTMLDivElement | null>(null);
    const [open, toggleOpen] = React.useState<boolean>(false);
    const popupAnchor = React.useRef<HTMLDivElement>(null);

    const type = item.type || ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || ICON_SIZE;
    const collapsedItem = item.id === COLLAPSE_ITEM_ID;

    const node = (
        <div
            className={b({type, selected: current, compact})}
            ref={popupAnchor}
            onClick={() => {
                if (typeof item.onItemClick === 'function') {
                    item.onItemClick(item, false);
                }
                if (collapsedItem) {
                    toggleOpen(!open);
                    setTooltipAnchor(null);
                }
                onClick?.();
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
                    <React.Fragment>
                        <div
                            onMouseEnter={(event) => {
                                if (!open) {
                                    setTooltipAnchor(event.currentTarget);
                                }
                                onMouseEnter?.();
                            }}
                            onMouseLeave={() => {
                                setTooltipAnchor(null);
                                onMouseLeave?.();
                            }}
                            className={b('btn-icon')}
                        >
                            {icon && <Icon data={icon} size={iconSize} className={b('icon')} />}
                        </div>
                        <ItemTooltip anchor={tooltipAnchor} text={tooltipText} />
                    </React.Fragment>
                ) : (
                    icon && <Icon data={icon} size={iconSize} className={b('icon')} />
                )}
            </div>
            <div className={b('title')} title={item.title}>
                {renderItemTitle(item)}
            </div>
            {collapsedItem && Array.isArray(collapseItems) && Boolean(popupAnchor.current) && (
                <Popup
                    placement={POPUP_PLACEMENT}
                    open={open}
                    anchorRef={popupAnchor}
                    onClose={() => toggleOpen(false)}
                >
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
                                const collapseNode = (
                                    <div
                                        className={b('collapse-item')}
                                        onClick={() => {
                                            if (typeof collapseItem.onItemClick === 'function') {
                                                collapseItem.onItemClick(collapseItem, true);
                                            }
                                        }}
                                    >
                                        {renderItemTitle(collapseItem)}
                                    </div>
                                );
                                if (typeof collapseItem.itemWrapper === 'function') {
                                    return collapseItem.itemWrapper(
                                        collapseNode,
                                        collapseItem,
                                        true,
                                        compact,
                                    );
                                }

                                return collapseItem.link ? (
                                    <a href={collapseItem.link} className={b('link')}>
                                        {collapseNode}
                                    </a>
                                ) : (
                                    collapseNode
                                );
                            }}
                        />
                    </div>
                </Popup>
            )}
        </div>
    );

    if (typeof item.itemWrapper === 'function') {
        return item.itemWrapper(node, item, false, compact) as React.ReactElement;
    }

    return item.link ? (
        <a href={item.link} className={b('link')}>
            {node}
        </a>
    ) : (
        node
    );
};
Item.displayName = 'Item';
