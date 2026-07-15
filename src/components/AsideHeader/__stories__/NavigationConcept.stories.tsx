import React from 'react';

import {Bell, CircleQuestion, Gear, Layers, Magnifier, Person} from '@gravity-ui/icons';
import {Flex, Text} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {AsideHeader} from '../AsideHeader';
import {FooterItem} from '../components/FooterItem/FooterItem';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {AsideHeaderItem, AsideHeaderProps} from '../types';

import {
    defaultCollapsedMenuGroupIdsExceptFirst,
    menuGroupsData,
    menuGroupsStoryArgTypes,
    menuItemsForNavigationConcept,
    menuItemsForNavigationConceptFlat,
} from './menuGroupsMoc';
import {DEFAULT_LOGO} from './moc';

export default {
    title: 'Navigation concept',
    component: AsideHeader,
    parameters: {
        a11y: {
            context: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'duplicate-id',
                        enabled: false,
                        selector: 'defs',
                    },
                    {
                        id: 'aria-allowed-attr',
                        enabled: false,
                    },
                    {
                        id: 'color-contrast',
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta;

const NAVIGATION_CONCEPT_STATS = [
    {label: 'Active users', value: '12.4k', delta: '+8.2%'},
    {label: 'Requests / min', value: '842', delta: '+3.1%'},
    {label: 'Error rate', value: '0.12%', delta: '-0.04%'},
    {label: 'P95 latency', value: '186 ms', delta: '-12 ms'},
];

const NAVIGATION_CONCEPT_ACTIVITY = [
    {time: '09:41', event: 'Dashboard "Revenue Q1" refreshed', status: 'OK'},
    {time: '09:38', event: 'Alert rule "High CPU" triggered', status: 'Warning'},
    {time: '09:22', event: 'Export "Weekly report" completed', status: 'OK'},
    {time: '08:57', event: 'New dataset ingested from S3', status: 'OK'},
    {time: '08:15', event: 'User session spike in eu-central', status: 'Info'},
];

function NavigationConceptPageContent({category, title}: {category?: string; title: string}) {
    return (
        <div
            style={{
                minHeight: '100vh',
                boxSizing: 'border-box',
                padding: '24px 32px 48px',
                background: 'var(--g-color-base-background)',
            }}
        >
            <Text variant="caption-2" color="secondary">
                {category ?? 'General'}
            </Text>
            <Text variant="header-1" style={{display: 'block', marginTop: 4}}>
                {title}
            </Text>
            <Text color="secondary" style={{display: 'block', marginTop: 8}}>
                Sample page content to evaluate aside visibility against a realistic layout.
            </Text>

            <Flex gap={3} wrap="wrap" style={{marginTop: 28}}>
                {NAVIGATION_CONCEPT_STATS.map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            flex: '1 1 180px',
                            minWidth: 180,
                            padding: '16px 20px',
                            borderRadius: 12,
                            background: 'var(--g-color-base-generic)',
                            border: '1px solid var(--g-color-line-generic)',
                        }}
                    >
                        <Text variant="caption-2" color="secondary">
                            {stat.label}
                        </Text>
                        <Text variant="subheader-3" style={{display: 'block', marginTop: 8}}>
                            {stat.value}
                        </Text>
                        <Text
                            variant="caption-2"
                            color="positive"
                            style={{display: 'block', marginTop: 4}}
                        >
                            {stat.delta}
                        </Text>
                    </div>
                ))}
            </Flex>

            <div
                style={{
                    marginTop: 32,
                    padding: '20px 24px',
                    borderRadius: 12,
                    background: 'var(--g-color-base-generic)',
                    border: '1px solid var(--g-color-line-generic)',
                }}
            >
                <Text variant="subheader-2">Recent activity</Text>
                <div style={{marginTop: 16, display: 'grid', gap: 12}}>
                    {NAVIGATION_CONCEPT_ACTIVITY.map((row) => (
                        <Flex key={row.time + row.event} gap={3} alignItems="center">
                            <Text
                                variant="caption-2"
                                color="secondary"
                                style={{width: 48, flexShrink: 0}}
                            >
                                {row.time}
                            </Text>
                            <Text style={{flex: 1}}>{row.event}</Text>
                            <Text variant="caption-2" color="complementary">
                                {row.status}
                            </Text>
                        </Flex>
                    ))}
                </div>
            </div>

            <div
                style={{
                    marginTop: 32,
                    height: 240,
                    borderRadius: 12,
                    background:
                        'linear-gradient(135deg, var(--g-color-base-info-light) 0%, var(--g-color-base-generic) 100%)',
                    border: '1px solid var(--g-color-line-generic)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text color="secondary">Chart placeholder</Text>
            </div>
        </div>
    );
}

function NavigationConceptDemo(props: {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderProps['menuDensity'];
    menuGroupNestedIcons?: AsideHeaderProps['menuGroupNestedIcons'];
    quickAccessHighlightInMainMenu?: AsideHeaderProps['quickAccessHighlightInMainMenu'];
    showQuickAccessSection?: AsideHeaderProps['showQuickAccessSection'];
    unifiedMenuScroll?: AsideHeaderProps['unifiedMenuScroll'];
    flatMenu?: boolean;
}) {
    const [compact, setCompact] = React.useState(props.initialCompact ?? false);
    const [currentPageId, setCurrentPageId] = React.useState('analytics-overview');
    const [menuItemsBase, setMenuItemsBase] = React.useState<AsideHeaderItem[]>(
        props.flatMenu ? menuItemsForNavigationConceptFlat : menuItemsForNavigationConcept,
    );

    const menuItems = React.useMemo<AsideHeaderItem[]>(
        () =>
            menuItemsBase.map((item) => ({
                ...item,
                current: item.id === currentPageId,
                onItemClick: (
                    clicked: AsideHeaderItem,
                    _collapsed: boolean,
                    _event: React.MouseEvent<HTMLElement, MouseEvent>,
                ) => {
                    if (clicked.type !== 'divider') {
                        setCurrentPageId(clicked.id);
                    }
                },
            })),
        [menuItemsBase, currentPageId],
    );

    const currentItem = menuItems.find((item) => item.current && item.type !== 'divider');
    const pageTitle = typeof currentItem?.title === 'string' ? currentItem.title : 'Overview';

    return (
        <PageLayout compact={compact} menuDensity={props.menuDensity}>
            <PageLayoutAside
                headerDecoration={false}
                logo={DEFAULT_LOGO}
                menuItems={menuItems}
                menuGroups={props.flatMenu ? undefined : menuGroupsData}
                enableQuickAccess
                showQuickAccessSection={props.showQuickAccessSection}
                quickAccessHighlightInMainMenu={props.quickAccessHighlightInMainMenu}
                enableAllPages={false}
                onMenuItemsChanged={setMenuItemsBase}
                onChangeCompact={setCompact}
                menuOverflow="scroll"
                unifiedMenuScroll={props.unifiedMenuScroll}
                defaultCollapsedMenuGroupIds={
                    props.flatMenu ? undefined : defaultCollapsedMenuGroupIdsExceptFirst
                }
                menuGroupNestedIcons={props.menuGroupNestedIcons}
                subheaderItems={[
                    {
                        id: 'search',
                        title: 'Search',
                        icon: Magnifier,
                        onItemClick: () => alert('Search'),
                    },
                    {
                        id: 'services',
                        title: 'Services',
                        icon: Layers,
                        onItemClick: () => alert('Services'),
                    },
                ]}
                renderFooter={({compact}) => (
                    <React.Fragment>
                        <FooterItem
                            compact={compact}
                            id={'support'}
                            title={'Support'}
                            icon={CircleQuestion}
                            tooltipText={'Support'}
                            onItemClick={() => alert('Support')}
                        />
                        <FooterItem
                            compact={compact}
                            id={'notifications'}
                            title={'Notifications'}
                            icon={Bell}
                            tooltipText={'Notifications'}
                            onItemClick={() => alert('Notifications')}
                        />
                        <FooterItem
                            compact={compact}
                            id={'settings'}
                            title={'Settings'}
                            icon={Gear}
                            tooltipText={'Settings'}
                            onItemClick={() => alert('Settings')}
                        />
                        <FooterItem
                            compact={compact}
                            id={'account'}
                            title={'Account'}
                            icon={Person}
                            tooltipText={'Account'}
                            onItemClick={() => alert('Account')}
                        />
                    </React.Fragment>
                )}
            />
            <PageLayout.Content>
                <NavigationConceptPageContent category={currentItem?.category} title={pageTitle} />
            </PageLayout.Content>
        </PageLayout>
    );
}

const MenuGroupsTemplate: StoryFn = (args) => (
    <NavigationConceptDemo
        initialCompact={args.initialCompact}
        menuDensity="compact"
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        quickAccessHighlightInMainMenu={args.quickAccessHighlightInMainMenu}
        showQuickAccessSection={args.showQuickAccessSection}
        unifiedMenuScroll={args.unifiedMenuScroll}
    />
);

export const MenuGroups = MenuGroupsTemplate.bind({});
MenuGroups.storyName = 'Menu Groups';
MenuGroups.argTypes = menuGroupsStoryArgTypes;
MenuGroups.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
    showQuickAccessSection: true,
    quickAccessHighlightInMainMenu: false,
    unifiedMenuScroll: false,
};

const MenuGroupsFlatTemplate: StoryFn = (args) => (
    <NavigationConceptDemo
        initialCompact={args.initialCompact}
        menuDensity="compact"
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        quickAccessHighlightInMainMenu={args.quickAccessHighlightInMainMenu}
        showQuickAccessSection={args.showQuickAccessSection}
        unifiedMenuScroll={args.unifiedMenuScroll}
        flatMenu
    />
);

export const MenuGroupsFlat = MenuGroupsFlatTemplate.bind({});
MenuGroupsFlat.storyName = 'Menu Groups (Flat)';
MenuGroupsFlat.argTypes = menuGroupsStoryArgTypes;
MenuGroupsFlat.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
    showQuickAccessSection: true,
    quickAccessHighlightInMainMenu: false,
    unifiedMenuScroll: false,
};
