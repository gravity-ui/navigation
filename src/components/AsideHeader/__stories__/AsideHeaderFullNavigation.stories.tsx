import React from 'react';

import {Bell, CircleQuestion, Gear, Layers, Magnifier, Person} from '@gravity-ui/icons';
import {Flex, Text} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {FooterItem} from '../components/FooterItem/FooterItem';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import type {AsideHeaderItem, AsideHeaderProps} from '../types';

import {
    fullNavigationCollapsedGroupIds,
    fullNavigationMenuGroups,
    fullNavigationMenuItems,
} from './fullNavigationMoc';
import {DEFAULT_LOGO} from './moc';

interface FullNavigationProps {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderProps['menuDensity'];
    menuGroupNestedIcons?: AsideHeaderProps['menuGroupNestedIcons'];
}

export default {
    title: 'components/AsideHeader/Examples',
    component: FullNavigationDemo,
    argTypes: {
        initialCompact: {
            control: 'boolean',
            description: 'Initial collapsed state; use the sidebar control to switch at runtime',
        },
        menuDensity: {
            control: 'inline-radio',
            options: ['default', 'compact'],
            description: 'Menu density',
        },
        menuGroupNestedIcons: {
            control: 'boolean',
            description: 'Show icons on nested group items',
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Full-page interactive example combining compact density, collapsible menu groups, popup navigation, footer actions, and page content.',
            },
        },
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
} as Meta<FullNavigationProps>;

const PAGE_SUMMARY = [
    {label: 'Documents', value: '24'},
    {label: 'Members', value: '8'},
    {label: 'Updates', value: '12'},
    {label: 'Open tasks', value: '5'},
];

const PAGE_ACTIVITY = [
    {time: '09:41', event: 'Workspace information updated', status: 'Updated'},
    {time: '09:38', event: 'New item added to the collection', status: 'New'},
    {time: '09:22', event: 'Access settings changed', status: 'Updated'},
    {time: '08:57', event: 'Scheduled task completed', status: 'Completed'},
    {time: '08:15', event: 'Comment added to an item', status: 'New'},
];

function FullNavigationPageContent({category, title}: {category?: string; title: string}) {
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
                Overview and recent activity for {title}.
            </Text>

            <Flex gap={3} wrap="wrap" style={{marginTop: 28}}>
                {PAGE_SUMMARY.map((item) => (
                    <div
                        key={item.label}
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
                            {item.label}
                        </Text>
                        <Text variant="subheader-3" style={{display: 'block', marginTop: 8}}>
                            {item.value}
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
                    {PAGE_ACTIVITY.map((row) => (
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
        </div>
    );
}

function FullNavigationDemo(props: FullNavigationProps) {
    const [compact, setCompact] = React.useState(props.initialCompact ?? false);
    const [currentPageId, setCurrentPageId] = React.useState('analytics-overview');

    const menuItems = React.useMemo<AsideHeaderItem[]>(
        () =>
            fullNavigationMenuItems.map((item) => ({
                ...item,
                current: item.id === currentPageId,
                onItemClick: (clicked: AsideHeaderItem) => {
                    if (clicked.type === 'action') {
                        alert('Create');
                    } else if (clicked.type !== 'divider') {
                        setCurrentPageId(clicked.id);
                    }
                },
            })),
        [currentPageId],
    );

    const currentItem = menuItems.find((item) => item.current);
    const pageTitle = typeof currentItem?.title === 'string' ? currentItem.title : 'Overview';

    return (
        <PageLayout compact={compact} menuDensity={props.menuDensity}>
            <PageLayoutAside
                headerDecoration={false}
                logo={DEFAULT_LOGO}
                menuItems={menuItems}
                menuGroups={fullNavigationMenuGroups}
                onChangeCompact={setCompact}
                menuOverflow="scroll"
                defaultCollapsedMenuGroupIds={fullNavigationCollapsedGroupIds}
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
                renderFooter={({compact: footerCompact}) => (
                    <React.Fragment>
                        <FooterItem
                            compact={footerCompact}
                            id="support"
                            title="Support"
                            icon={CircleQuestion}
                            tooltipText="Support"
                        />
                        <FooterItem
                            compact={footerCompact}
                            id="notifications"
                            title="Notifications"
                            icon={Bell}
                            tooltipText="Notifications"
                        />
                        <FooterItem
                            compact={footerCompact}
                            id="settings"
                            title="Settings"
                            icon={Gear}
                            tooltipText="Settings"
                        />
                        <FooterItem
                            compact={footerCompact}
                            id="account"
                            title="Account"
                            icon={Person}
                            tooltipText="Account"
                        />
                    </React.Fragment>
                )}
            />
            <PageLayout.Content>
                <FullNavigationPageContent category={currentItem?.category} title={pageTitle} />
            </PageLayout.Content>
        </PageLayout>
    );
}

const FullNavigationTemplate: StoryFn<FullNavigationProps> = (args) => (
    <FullNavigationDemo {...args} />
);

export const FullNavigation = FullNavigationTemplate.bind({});
FullNavigation.storyName = 'Full navigation';
FullNavigation.args = {
    initialCompact: false,
    menuDensity: 'compact',
    menuGroupNestedIcons: true,
};
