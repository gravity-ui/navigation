import React from 'react';

import {Gear, Plus} from '@gravity-ui/icons';

import {AsideHeader} from '../AsideHeader';
import {FooterItem} from '../components/FooterItem/FooterItem';
import type {AsideHeaderMenuDensity} from '../density';

export function AsideTransitionExample({
    initialCompact = true,
    menuDensity = 'default',
    withDividers = false,
    withGroupedDivider = false,
}: {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderMenuDensity;
    withDividers?: boolean;
    withGroupedDivider?: boolean;
}) {
    const [compact, setCompact] = React.useState(initialCompact);
    return (
        <AsideHeader
            compact={compact}
            menuDensity={menuDensity}
            onChangeCompact={setCompact}
            menuOverflow={withGroupedDivider ? 'scroll' : undefined}
            menuGroups={
                withGroupedDivider ? [{id: 'group', title: 'Group', icon: Gear}] : undefined
            }
            logo={{text: 'Transitions', icon: Gear}}
            subheaderItems={
                withDividers ? [{id: 'shared', type: 'divider', title: '-'}] : undefined
            }
            menuItems={[
                {
                    id: 'long',
                    title: 'A long menu title on two lines',
                    titleLines: 2,
                    icon: Gear,
                    current: true,
                    pinned: true,
                },
                {id: 'other', title: 'Another item', icon: Gear, pinned: true},
                ...(withDividers ? [{id: 'shared', type: 'divider' as const, title: '-'}] : []),
                ...(withGroupedDivider
                    ? [
                          {id: 'group-item', title: 'Grouped item', icon: Gear, groupId: 'group'},
                          {id: 'nested', title: '-', type: 'divider' as const, groupId: 'group'},
                      ]
                    : []),
                {
                    id: 'action',
                    title: 'Create resource',
                    type: 'action',
                    icon: Plus,
                    afterMoreButton: true,
                },
            ]}
            renderFooter={
                withDividers ? () => <FooterItem id="shared" type="divider" title="-" /> : undefined
            }
            renderContent={() => <div>Transition example</div>}
        />
    );
}
