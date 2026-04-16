import React from 'react';

import {List, Popover, PopupProps} from '@gravity-ui/uikit';

import {ITEM_HEIGHT} from '../../../../constants';
import {createBlock} from '../../../../utils/cn';
import {AsideHeaderItem} from '../../../types';
import {getSelectedItemIndex} from '../utils';

import {Item} from './Item';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};

interface Props {
    items: AsideHeaderItem[];
    open?: boolean;
    disabled?: boolean;
    type?: string;
    collapsed?: boolean;
    hideIcon?: boolean;
    children: React.ReactElement;
    onOpenChange?: (open: boolean) => void;
    onItemClick?: AsideHeaderItem['onItemClick'];
}

export const ItemPopup: React.FC<Props> = ({
    items,
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
            <List
                items={items}
                selectedItemIndex={getSelectedItemIndex(items)}
                itemHeight={ITEM_HEIGHT}
                itemsHeight={items.length * ITEM_HEIGHT}
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
            placement="right"
            strategy="fixed"
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
