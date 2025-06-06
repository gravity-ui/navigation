import React from 'react';

import {
    Tabs as LegacyTabs,
    type TabsItemProps as LegacyTabsItemProps,
} from '@gravity-ui/uikit/legacy';

import {createBlock} from '../../utils/cn';
import {SettingsMenuProps} from '../types';

import styles from './SettingsMenuMobile.scss';

const b = createBlock('settings-menu-mobile', styles);

export const SettingsMenuMobile = ({
    items,
    onChange,
    activeItemId,
    className,
}: SettingsMenuProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const tabItems = React.useMemo(() => {
        const tabItems: LegacyTabsItemProps[] = [];

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
            <LegacyTabs
                items={tabItems}
                className={b(null, className)}
                size="l"
                activeTab={activeItemId}
                onSelectTab={onChange}
            />
        </div>
    );
};
