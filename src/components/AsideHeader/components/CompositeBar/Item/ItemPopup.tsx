import React from 'react';

import {List, Popover, PopupProps} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import {AsideHeaderItem} from '../../../types';
import {getPopupItemHeight, getPopupItemsHeight, getSelectedItemIndex} from '../utils';

import {Item} from './Item';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};

const DEFAULT_POPUP_DELAY = 100;

interface Props {
    items: AsideHeaderItem[];
    /** Optional title rendered at the top of the popup. */
    title?: string;
    open?: boolean;
    disabled?: boolean;
    type?: string;
    collapsed?: boolean;
    hideIcon?: boolean;
    itemClassName?: string;
    children: React.ReactElement;
    onOpenChange?: (open: boolean) => void;
    onItemClick?: AsideHeaderItem['onItemClick'];
}

export const ItemPopup: React.FC<Props> = ({
    items,
    itemClassName,
    title,
    open,
    disabled,
    type,
    collapsed = false,
    hideIcon = false,
    children,
    onItemClick,
    onOpenChange,
}) => {
    if (!items.length) {
        return children;
    }

    const content = (
        <div className={b('popup-content', {collapsed})}>
            {title && <div className={b('popup-title')}>{title}</div>}
            <List
                items={items}
                selectedItemIndex={getSelectedItemIndex(items)}
                itemHeight={getPopupItemHeight}
                itemsHeight={getPopupItemsHeight}
                itemClassName={b('root-menu-item', itemClassName)}
                virtualized={false}
                filterable={false}
                sortable={false}
                renderItem={(item) => (
                    <Item
                        {...item}
                        qa={undefined}
                        compact={false}
                        className={b('popup-item')}
                        hideIcon={hideIcon}
                        stopClickPropagation
                        enableTooltip={false}
                        bringForward={false}
                        popupVisible={false}
                        renderPopupContent={undefined}
                        onOpenChangePopup={undefined}
                        popupRef={undefined}
                        onItemClick={(_innerItem, _innerCollapsed, event) => {
                            onOpenChange?.(false);
                            onItemClick?.(item, collapsed, event);
                        }}
                    />
                )}
            />
        </div>
    );

    return (
        <Popover
            disabled={disabled}
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen && disabled) return;
                onOpenChange?.(nextOpen);
            }}
            placement="right-start"
            strategy="fixed"
            openDelay={DEFAULT_POPUP_DELAY}
            closeDelay={DEFAULT_POPUP_DELAY}
            offset={defaultPopupOffset}
            enableSafePolygon
            className={b('icon-popover', {'item-type': type})}
            content={content}
        >
            {children}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
