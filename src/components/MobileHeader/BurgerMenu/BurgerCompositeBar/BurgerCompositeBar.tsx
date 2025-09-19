import React from 'react';

import {Icon, List} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {MOBILE_HEADER_ICON_SIZE} from '../../constants';
import {MobileMenuItem} from '../../types';
import {getItemHeight, getSelectedItemIndex} from '../../utils';

import './BurgerCompositeBar.scss';

const b = block('burger-composite-bar');

interface ItemProps {
    item: MobileMenuItem;
    onItemClick?: (item: MobileMenuItem) => void;
}

const Item = ({item, onItemClick}: ItemProps) => {
    const {icon, type = 'regular', iconSize = MOBILE_HEADER_ICON_SIZE} = item;

    if (type === 'divider') {
        return <div className={b('menu-divider')} />;
    }

    const node = (
        <div
            className={b('item', {type})}
            onClick={() => {
                if (typeof item.onItemClick === 'function') {
                    item.onItemClick(item);
                }

                if (type === 'regular') {
                    onItemClick?.(item);
                }
            }}
        >
            <div className={b('item-icon-place')}>
                {icon && <Icon data={icon} size={iconSize} className={b('item-icon')} />}
            </div>
            <div className={b('item-title')}>{item.title}</div>
        </div>
    );

    if (typeof item.itemWrapper === 'function') {
        return item.itemWrapper(node, item) as React.ReactElement;
    }

    return item.href ? (
        <a href={item.href} className={b('link')}>
            {node}
        </a>
    ) : (
        node
    );
};
Item.displayName = 'Item';

interface BurgerCompositeBarProps {
    items: MobileMenuItem[];
    onItemClick?: (item: MobileMenuItem) => void;
}

export const BurgerCompositeBar = React.memo(({items, onItemClick}: BurgerCompositeBarProps) => {
    return (
        <nav className={b()}>
            <List<MobileMenuItem>
                items={items}
                selectedItemIndex={getSelectedItemIndex(items)}
                itemHeight={getItemHeight}
                itemClassName={b('root-menu-item')}
                virtualized={false}
                filterable={false}
                sortable={false}
                renderItem={(item) => <Item item={item} onItemClick={onItemClick} />}
            />
        </nav>
    );
});

BurgerCompositeBar.displayName = 'BurgerCompositeBar';
