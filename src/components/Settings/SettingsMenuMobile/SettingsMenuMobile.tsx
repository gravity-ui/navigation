import React from 'react';

import {Tab, TabList, TabProps} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';
import {SettingsMenuMobileProps} from '../types';

import styles from './SettingsMenuMobile.module.scss';

const b = createBlock('settings-menu-mobile', styles);

export const SettingsMenuMobile = ({
    items,
    className,
    enableTabsScroll,
}: SettingsMenuMobileProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const tabItems = React.useMemo(() => {
        const result: TabProps[] = [];

        items.forEach((firstLevelItem) => {
            if ('groupTitle' in firstLevelItem) {
                result.push(
                    ...firstLevelItem.items.map(({id, title, disabled, withBadge}) => ({
                        value: id,
                        children: title,
                        disabled,
                        className: b('item', {badge: withBadge}),
                    })),
                );
            } else {
                const {id, title, disabled, withBadge} = firstLevelItem;
                result.push({
                    value: id,
                    children: title,
                    disabled,
                    className: b('item', {badge: withBadge}),
                });
            }
        });
        return result;
    }, [items]);

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div ref={ref} onTouchMove={handleTouchMove}>
            <TabList
                size="l"
                className={b(null, className)}
                contentOverflow={enableTabsScroll ? 'scroll' : 'wrap'}
            >
                {tabItems.map((item) => (
                    <Tab key={item.value} {...item} />
                ))}
            </TabList>
        </div>
    );
};
