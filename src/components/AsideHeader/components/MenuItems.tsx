import React from 'react';

import {MenuItem} from '../../types';
import {MenuGroupWithItems} from '../hooks/useGroupedMenuItems';
import {b} from '../utils';

import {CompositeBar} from './CompositeBar/CompositeBar';

interface Props {
    compact: boolean;
    compositeIdBase: string;
    groupedMenuItems: MenuGroupWithItems[];
    visibleMenuItems: MenuItem[];
    menuMoreTitle?: string;
    multipleTooltip?: boolean;
    onItemClick: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onMoreClick?: () => void;
}

export const MenuItems: React.FC<Props> = ({
    compositeIdBase,
    groupedMenuItems,
    visibleMenuItems,
    multipleTooltip,
    compact,
    onItemClick,
    onMoreClick,
}) => {
    if (groupedMenuItems.length > 0) {
        return (
            <CompositeBar
                compositeId={compositeIdBase}
                className={b('menu-items')}
                compact={compact}
                type="menu"
                groupedItems={groupedMenuItems}
                items={visibleMenuItems}
                onItemClick={onItemClick}
                onMoreClick={onMoreClick}
                multipleTooltip={multipleTooltip}
            />
        );
    }

    if (visibleMenuItems.length > 0) {
        return (
            <CompositeBar
                compositeId={compositeIdBase}
                type="menu"
                compact={compact}
                items={visibleMenuItems}
                onItemClick={onItemClick}
                onMoreClick={onMoreClick}
                multipleTooltip={multipleTooltip}
            />
        );
    }

    return <div className={b('menu-items')} />;
};
