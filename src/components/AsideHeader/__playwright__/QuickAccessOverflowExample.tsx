import React from 'react';

import {Gear} from '@gravity-ui/icons';

import type {MenuGroup} from '../../types';
import {AsideHeaderContextProvider} from '../AsideHeaderContext';
import {
    fullNavigationCollapsedGroupIds,
    fullNavigationMenuGroups,
    fullNavigationMenuItems,
} from '../__stories__/fullNavigationMoc';
import {CompositeBar} from '../components/CompositeBar/CompositeBar';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {isQuickAccessPinEligible} from '../quickAccess';
import type {AsideHeaderItem} from '../types';

const quickAccessOverflowItems: AsideHeaderItem[] = fullNavigationMenuItems.map((item) => ({
    ...item,
    quickAccess:
        isQuickAccessPinEligible(item) &&
        [
            'home',
            'analytics-overview',
            'analytics-reports',
            'analytics-dashboards',
            'analytics-metrics',
            'monitoring-alerts',
            'monitoring-logs',
            'monitoring-traces',
            'monitoring-uptime',
            'storage-buckets',
            'storage-databases',
            'storage-volumes',
        ].includes(item.id),
}));

export function QuickAccessOverflowExample({
    unifiedMenuScroll = false,
    compact = false,
}: {
    unifiedMenuScroll?: boolean;
    compact?: boolean;
}) {
    return (
        <PageLayout compact={compact} menuDensity="compact">
            <PageLayoutAside
                logo={{text: 'Navigation'}}
                menuItems={quickAccessOverflowItems}
                menuGroups={fullNavigationMenuGroups}
                menuOverflow="scroll"
                defaultCollapsedMenuGroupIds={fullNavigationCollapsedGroupIds}
                enableQuickAccess
                onQuickAccessChange={() => {}}
                unifiedMenuScroll={unifiedMenuScroll}
                renderFooter={
                    compact
                        ? () => <div data-qa="quick-access-overflow-footer">Footer</div>
                        : undefined
                }
                hideCollapseButton
            />
            <PageLayout.Content>
                <div />
            </PageLayout.Content>
        </PageLayout>
    );
}

const wrappedItem: AsideHeaderItem = {
    id: 'wrapped-item',
    title: 'Wrapped item',
    itemWrapper: (params, makeItem) => (
        <a data-qa="quick-access-anchor-wrapper" href="#wrapped-item">
            {makeItem(params)}
        </a>
    ),
};

export function QuickAccessWrappedItemExample() {
    return (
        <PageLayout compact={false} menuDensity="compact">
            <PageLayoutAside
                logo={{text: 'Navigation'}}
                menuItems={[wrappedItem]}
                enableQuickAccess
                onQuickAccessChange={() => {}}
                hideCollapseButton
            />
            <PageLayout.Content>
                <div />
            </PageLayout.Content>
        </PageLayout>
    );
}

const nestedMorePopupItems: AsideHeaderItem[] = [
    {id: 'first', title: 'First', icon: Gear},
    {id: 'second', title: 'Second', icon: Gear},
    {id: 'group-child-a', title: 'Group child A', icon: Gear, groupId: 'nested-group'},
    {id: 'group-child-b', title: 'Group child B', icon: Gear, groupId: 'nested-group'},
];

const nestedMorePopupGroups: MenuGroup[] = [
    {id: 'nested-group', title: 'Nested group', icon: Gear, popupTitle: 'Nested group'},
];

export function NestedMorePopupExample() {
    return (
        <AsideHeaderContextProvider value={{compact: true, size: 44, menuDensity: 'compact'}}>
            <div style={{display: 'flex', width: 44, height: 80}}>
                <CompositeBar
                    type="menu"
                    items={nestedMorePopupItems}
                    menuGroups={nestedMorePopupGroups}
                    compact
                    menuMoreTitle="More"
                />
            </div>
        </AsideHeaderContextProvider>
    );
}
