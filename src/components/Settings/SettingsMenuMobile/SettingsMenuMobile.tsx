import React from 'react';

import {Tabs, TabsItemProps} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {SettingsMenuProps} from '../types';

import './SettingsMenuMobile.scss';

const b = block('settings-menu-mobile');

export const SettingsMenuMobile = ({
    items,
    onChange,
    activeItemId,
    className,
}: SettingsMenuProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const tabItems = React.useMemo(() => {
        const tabItems: TabsItemProps[] = [];

        items.forEach((firstLevelItem) => {
            if ('groupTitle' in firstLevelItem) {
                tabItems.push(
                    ...firstLevelItem.items.map(({id, title, disabled, withBadge}) => ({
                        id,
                        title,
                        disabled,
                        className: b('item', {badge: withBadge}),
                    })),
                );
            } else {
                const {id, title, disabled, withBadge} = firstLevelItem;
                tabItems.push({id, title, disabled, className: b('item', {badge: withBadge})});
            }
        });
        return tabItems;
    }, [items]);

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div ref={ref} onTouchMove={handleTouchMove}>
            <Tabs
                items={tabItems}
                className={b(null, className)}
                size="l"
                activeTab={activeItemId}
                onSelectTab={onChange}
            />
        </div>
    );
};
