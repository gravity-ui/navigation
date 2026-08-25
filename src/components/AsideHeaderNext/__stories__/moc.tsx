import * as React from 'react';

import {Gear, Plus} from '@gravity-ui/icons';

import type {AsideHeaderNextItemListEntry} from '../index';

import logoIcon from '../../../../.storybook/assets/logo.svg';

export const DEFAULT_LOGO = {
    text: 'Service',
    icon: logoIcon,
    href: '#',
    onClick: () => alert('click on logo'),
    'aria-label': 'Service',
};

export function Tag({children}: {children: React.ReactNode}) {
    return (
        <span
            style={{
                padding: '0 6px',
                borderRadius: 4,
                fontSize: 11,
                lineHeight: '18px',
                color: 'var(--g-color-text-info)',
                backgroundColor: 'var(--g-color-base-info-light)',
            }}
        >
            {String(children).toUpperCase()}
        </span>
    );
}

/** Mirror of the old `menuItemsShowcase`, mapped onto the compound row API. */
export const menuItemsShowcase: AsideHeaderNextItemListEntry[] = [
    {id: 'overview', icon: Gear, children: 'Overview'},
    {id: 'operations', icon: Gear, children: 'Operations', rightAdornment: <Tag>New</Tag>},
    {id: 'templates', icon: Gear, children: 'Main notifications long menu title'},
    {kind: 'divider', id: 'divider'},
    {
        id: 'notifications',
        icon: Gear,
        children: 'Main notifications long long long long menu title',
        current: true,
        onClick: () => alert(JSON.stringify({id: 'notifications', current: true})),
    },
    {
        id: 'dashboard',
        icon: Gear,
        children: 'Dashboard',
        rightAdornment: <Tag>New</Tag>,
        onClick: () => alert(JSON.stringify({id: 'dashboard'})),
    },
    {kind: 'divider', id: 'divider2'},
    {
        id: 'objects',
        icon: Gear,
        children: 'Objects',
        tooltipText: 'Custom tooltip text',
        onClick: () => alert(JSON.stringify({id: 'objects'})),
    },
    {
        id: 'action2',
        icon: Plus,
        children: 'Create smth',
        onClick: () => alert(JSON.stringify({id: 'action2'})),
    },
];

const CLAMPED_TITLE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

export const menuItemsClamped: AsideHeaderNextItemListEntry[] = [
    {id: 'text', icon: Gear, children: CLAMPED_TITLE},
    {id: 'text-action', icon: Gear, children: CLAMPED_TITLE},
    {id: 'text-link', icon: Gear, children: CLAMPED_TITLE, href: 'about:blank'},
    {id: 'text-link-action', icon: Gear, children: CLAMPED_TITLE, href: 'about:blank'},
    {kind: 'divider', id: 'divider'},
    {id: 'text-new', icon: Gear, children: CLAMPED_TITLE, rightAdornment: <Tag>new</Tag>},
    {id: 'text-action-new', icon: Gear, children: CLAMPED_TITLE, rightAdornment: <Tag>new</Tag>},
];

export const manyMenuItems: AsideHeaderNextItemListEntry[] = Array.from(
    {length: 25},
    (_, index) => ({
        id: `item-${index + 1}`,
        icon: Gear,
        children: `Item ${index + 1}`,
        current: index === 0,
    }),
);

export const text = `
Did you attend? He sang by grove ripe -
The bard of love, the singer of his mourning.
When fields were silent by the early morning,
To sad and simple sounds of a pipe
Did you attend?

Did you behold in dark of forest leaf
The bard of love, the singer of his sadness?
The trace of tears, the smile, the utter paleness,
The quiet look, full of eternal grief,
Did you behold?
`;
