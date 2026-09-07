import React from 'react';

import {Gear} from '@gravity-ui/icons';

import {AsideHeader} from '../AsideHeader';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import type {AsideHeaderMenuDensity} from '../density';

export function CompactTransitionExample({
    initialCompact = false,
    initialTransition = false,
    menuDensity = 'default',
    layout = 'aside',
    grouped = true,
    direction = 'ltr',
    overflowing = false,
}: {
    initialCompact?: boolean;
    initialTransition?: boolean;
    menuDensity?: AsideHeaderMenuDensity;
    layout?: 'aside' | 'page' | 'fallback';
    grouped?: boolean;
    direction?: 'ltr' | 'rtl';
    overflowing?: boolean;
}) {
    const [compact, setCompact] = React.useState(initialCompact);
    const [compactTransition, setTransition] = React.useState(initialTransition);
    const [open, setOpen] = React.useState(true);
    const [changes, setChanges] = React.useState(0);
    const props = {
        logo: {text: 'Transitions', icon: Gear},
        menuOverflow: 'scroll' as const,
        customBackground: <div>Background</div>,
        menuGroups: grouped ? [{id: 'group', title: 'Group', icon: Gear}] : undefined,
        menuItems: [
            {
                id: 'current',
                title: 'Current item',
                icon: Gear,
                current: true,
                pinned: true,
                groupId: grouped ? 'group' : undefined,
            },
            {id: 'other', title: 'Other item', icon: Gear, pinned: true},
            {id: 'divider', title: '-', type: 'divider' as const},
            ...(overflowing
                ? Array.from({length: 30}, (_, index) => ({
                      id: `extra-${index}`,
                      title: `Extra ${index}`,
                      icon: Gear,
                      pinned: true,
                  }))
                : []),
        ],
        panelItems: [{id: 'drawer', open, children: <div>Drawer content</div>}],
        onChangeCompact: (value: boolean) => {
            setCompact(value);
            setChanges((count) => count + 1);
        },
    };
    const content = <input aria-label="Persistent input" defaultValue="Preserved" />;
    const layoutProps = {compact, compactTransition, menuDensity};
    return (
        <div dir={direction} style={{width: 1000}}>
            <button onClick={() => setCompact((value) => !value)}>Toggle compact</button>
            <button onClick={() => setTransition((value) => !value)}>Toggle transition</button>
            <button
                onClick={() => {
                    setTransition((value) => !value);
                    setCompact((value) => !value);
                }}
            >
                Toggle both
            </button>
            <button onClick={() => setOpen((value) => !value)}>Toggle drawer</button>
            <output aria-label="Compact changes">{changes}</output>
            {layout === 'aside' ? (
                <AsideHeader {...layoutProps} {...props} renderContent={() => content} />
            ) : (
                <PageLayout {...layoutProps}>
                    {layout === 'fallback' ? <AsideFallback /> : <PageLayoutAside {...props} />}
                    <PageLayout.Content>{content}</PageLayout.Content>
                </PageLayout>
            )}
        </div>
    );
}

export function CompactTransitionIsolationExample() {
    return (
        <PageLayout compact={false} compactTransition={false}>
            <AsideFallback qa="outer-fallback" />
            <PageLayout.Content>
                <PageLayout compact={false}>
                    <AsideFallback qa="inner-fallback" />
                </PageLayout>
            </PageLayout.Content>
        </PageLayout>
    );
}
