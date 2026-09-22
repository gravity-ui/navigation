import React from 'react';

import {Gear} from '@gravity-ui/icons';

import {AsideHeaderContextProvider} from '../AsideHeaderContext';
import {CompositeBar} from '../components/CompositeBar/CompositeBar';
import {FooterItem} from '../components/FooterItem/FooterItem';
import {AsideHeaderMenuDensity, getAsideHeaderDensityCssProperties} from '../density';
import {AsideHeaderItem, AsideHeaderMenuOverflow} from '../types';

export function AutomaticTitleExample({
    width = 220,
    height = 500,
    compact = false,
    menuDensity = 'compact',
    menuOverflow = 'scroll',
    title = 'Синтетический мониторинг',
    grouped = false,
    quickAccess = false,
    adornment = false,
    groupTitle = 'Group',
}: {
    width?: number;
    height?: number;
    compact?: boolean;
    menuDensity?: AsideHeaderMenuDensity;
    menuOverflow?: AsideHeaderMenuOverflow;
    title?: React.ReactNode;
    grouped?: boolean;
    quickAccess?: boolean;
    adornment?: boolean;
    groupTitle?: string;
}) {
    const items = React.useMemo<AsideHeaderItem[]>(
        () => [
            {id: 'short', title: 'Overview', icon: Gear, pinned: true},
            {
                id: 'long',
                title,
                icon: Gear,
                groupId: grouped ? 'group' : undefined,
                rightAdornment: adornment ? <span data-qa="badge">123</span> : undefined,
            },
            {id: 'last', title: 'Settings', icon: Gear},
        ],
        [title, grouped, adornment],
    );
    const onToggleQuickAccess = () => {};
    return (
        <React.StrictMode>
            <AsideHeaderContextProvider
                value={{
                    compact,
                    size: width,
                    menuDensity,
                }}
            >
                <div style={{...getAsideHeaderDensityCssProperties(menuDensity), width}}>
                    {quickAccess && (
                        <div data-qa="quick-access">
                            <CompositeBar
                                type="quick-access"
                                compact={compact}
                                items={[items[1]]}
                                enableQuickAccessPin
                                onToggleQuickAccess={onToggleQuickAccess}
                            />
                        </div>
                    )}
                    <div data-qa="menu" style={{height, display: 'flex', flexDirection: 'column'}}>
                        <CompositeBar
                            type="menu"
                            compact={compact}
                            items={items}
                            menuOverflow={menuOverflow}
                            menuMoreTitle="More"
                            menuGroups={
                                grouped
                                    ? [{id: 'group', title: groupTitle, icon: Gear, href: '#group'}]
                                    : undefined
                            }
                            enableQuickAccessPin={quickAccess}
                            onToggleQuickAccess={onToggleQuickAccess}
                        />
                    </div>
                    <FooterItem id="footer" title={title} icon={Gear} compact={compact} />
                </div>
            </AsideHeaderContextProvider>
        </React.StrictMode>
    );
}
