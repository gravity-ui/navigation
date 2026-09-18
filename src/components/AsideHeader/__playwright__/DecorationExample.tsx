import React from 'react';

import {Gear} from '@gravity-ui/icons';

import {AsideHeader} from '../AsideHeader';
import type {AsideHeaderProps} from '../types';

type Props = Pick<
    AsideHeaderProps,
    'compact' | 'menuDensity' | 'enableQuickAccess' | 'hideSectionDividers'
> & {quickAccess?: boolean};

export function DecorationExample({quickAccess, ...props}: Props) {
    return (
        <AsideHeader
            {...props}
            compactTransition={false}
            headerDecoration
            logo={{text: 'Logo', icon: Gear}}
            subheaderItems={[{id: 'settings', title: 'Settings', icon: Gear}]}
            menuItems={[{id: 'home', title: 'Home', icon: Gear, quickAccess}]}
            onQuickAccessChange={() => {}}
        />
    );
}
