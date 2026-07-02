import React from 'react';

import {
    AntennaSignal,
    Bell,
    BookOpen,
    Bucket,
    ChartColumn,
    ChartLine,
    ChartPie,
    CircleQuestion,
    Cloud,
    CloudArrowUpIn,
    CopyCheck,
    CreditCard,
    Database,
    FileText,
    Gear,
    HardDrive,
    House,
    Key,
    Layers,
    LayoutHeaderCellsLarge,
    ListTimeline,
    Magnifier,
    Person,
    Persons,
    PlugConnection,
    Route,
    ShieldCheck,
    ShieldKeyhole,
    Sliders,
    Terminal,
    Xmark,
} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text, spacing} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {MenuGroup} from '../../types';
import {AsideHeader} from '../AsideHeader';
import {FooterItem} from '../components/FooterItem/FooterItem';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {AsideHeaderItem, AsideHeaderProps} from '../types';

import {AsideHeaderShowcase, AsideHeaderShowcaseProps} from './AsideHeaderShowcase';
import {DEFAULT_LOGO, menuItemsClamped, menuItemsShowcase} from './moc';

import logoIcon from '../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/AsideHeader',
    component: AsideHeader,
    parameters: {
        a11y: {
            context: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'duplicate-id',
                        enabled: false,
                        selector: 'defs', // one may use same id in different <defs>
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

const ShowcaseTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const Showcase = ShowcaseTemplate.bind({});

const CompactTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const Compact = CompactTemplate.bind({});
Compact.args = {
    initialCompact: true,
    hideCollapseButton: true,
};

const CustomThemeTemplate: StoryFn = (args) => (
    <React.Fragment>
        <style>
            {`.g-root {
                --gn-aside-header-decoration-collapsed-background-color: #c8c8ff;
                --gn-aside-header-decoration-expanded-background-color: #8585fc;
                --gn-aside-header-divider-vertical-color: #b5b5b5;
                --gn-aside-header-divider-horizontal-color: #8e8e8e;
                --gn-aside-header-background-color: #fadfb2;
                --gn-aside-header-item-background-color-hover: #2626f75c;
                --gn-aside-header-general-item-icon-color: #4a4a4a;
                --gn-aside-header-item-icon-color: var(--g-color-text-primary);
                --gn-aside-header-item-current-background-color: #f8ca7d;
                --gn-aside-header-item-current-background-color-hover: #ffc665;
                --gn-aside-header-item-current-icon-color: #8e4f34;
                --gn-aside-header-item-current-text-color: #8e4f34;
            }`}
        </style>
        <AsideHeaderShowcase {...args} />
    </React.Fragment>
);
export const CustomTheme = CustomThemeTemplate.bind({});
CustomTheme.args = {
    headerDecoration: true,
};

const CustomBackgroundTemplate: StoryFn = (args) => (
    <React.Fragment>
        <style>
            {`.g-root {
                --gn-aside-header-item-icon-color: var(--g-color-text-primary);
            }`}
        </style>
        <AsideHeaderShowcase {...args} />
    </React.Fragment>
);
export const CustomBackground = CustomBackgroundTemplate.bind({});
CustomBackground.args = {
    headerDecoration: false,
    customBackground: <img src="custom-theme-background.png" width="100%" alt="" />,
    customBackgroundClassName: 'aside-header-showcase__custom-background',
};

const AdvancedUsageTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                onChangeCompact={setCompact}
                qa={'pl-aside'}
                {...args}
            />

            <PageLayout.Content>PageContent</PageLayout.Content>
        </PageLayout>
    );
};

export const AdvancedUsage = AdvancedUsageTemplate.bind({});

AdvancedUsage.args = {
    initialCompact: true,
};

const TopAlertTemplate: StoryFn<AsideHeaderShowcaseProps> = (args) => (
    <AsideHeaderShowcase {...args} />
);
export const HeaderAlert = TopAlertTemplate.bind({});
HeaderAlert.args = {
    topAlert: {
        title: 'Maintenance',
        view: 'filled',
        message:
            'Scheduled maintenance is being performed Scheduled maintenance is being performed Scheduled maintenance is being performed Scheduled maintenance is being performed  Scheduled maintenance is being performed Scheduled maintenance is being performed Scheduled mainten',
        closable: true,
    },
};

export const HeaderAlertCentered = TopAlertTemplate.bind({});
HeaderAlertCentered.args = {
    topAlert: {
        view: 'filled',
        message: 'Scheduled maintenance is being performed',
        centered: true,
        dense: true,
    },
};

export const HeaderAlertCustom = TopAlertTemplate.bind({});
HeaderAlertCustom.args = {
    topAlert: {
        render: ({handleClose}) => (
            <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                gap={4}
                style={{
                    position: 'relative',
                    padding: '8px',
                    background:
                        ' linear-gradient(120deg, #191654, #43cea2 40%, #185a9d 70%, #f857a6 100%)',
                }}
            >
                <Text variant="subheader-2" style={{color: 'var(--g-color-text-light-primary)'}}>
                    We&apos;ve got something new for you to try!
                </Text>
                <Button view="normal-contrast" size="m">
                    Try Now
                </Button>
                <Button view="outlined-contrast" size="m">
                    Learn More
                </Button>
                <Button
                    style={{position: 'absolute', right: '8px'}}
                    view="flat-contrast"
                    aria-label="Close"
                    onClick={handleClose}
                >
                    <Icon data={Xmark} size={18} />
                </Button>
            </Flex>
        ),
    },
};

const fallbackArgs = {
    headerDecoration: true,
    subheaderItemsCount: 2,
};

const FallbackTemplate: StoryFn<typeof fallbackArgs> = ({
    headerDecoration,
    subheaderItemsCount,
}) => {
    const [compact, setCompact] = React.useState(false);

    return (
        <PageLayout compact={compact}>
            <AsideFallback
                headerDecoration={headerDecoration}
                subheaderItemsCount={subheaderItemsCount}
                qa="pl-aside-fallback"
            />

            <PageLayout.Content>
                <div style={{padding: 16}}>
                    <Button onClick={() => setCompact((prev) => !prev)}>Toggle compact</Button>
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const Fallback = FallbackTemplate.bind({});
Fallback.args = fallbackArgs;

/** @type {StoryFn} */
export function LineClamp() {
    const [compact, setCompact] = React.useState(false);
    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                logo={{icon: logoIcon, text: 'Line clamp', 'aria-label': 'Line clamp'}}
                menuItems={menuItemsClamped}
                onChangeCompact={setCompact}
                headerDecoration
            />
        </PageLayout>
    );
}

const CollapseButtonWrapperTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                onChangeCompact={setCompact}
                collapseButtonWrapper={(defaultButton, {compact}) => (
                    <React.Fragment>
                        {defaultButton}
                        <div
                            style={{
                                backgroundColor: 'var(--g-color-base-generic)',
                                padding: '5px',
                            }}
                        >
                            <Flex justifyContent="center" alignItems="center">
                                {
                                    <Icon
                                        size={14}
                                        data={logoIcon}
                                        className={compact ? undefined : spacing({mr: 1})}
                                    />
                                }
                                {compact ? null : <Text color="secondary">{'Gravity UI'}</Text>}
                            </Flex>
                        </div>
                    </React.Fragment>
                )}
                qa={'pl-aside-collapse-wrapper'}
                {...args}
            />
        </PageLayout>
    );
};

export const CollapseButtonWrapper = CollapseButtonWrapperTemplate.bind({});
CollapseButtonWrapper.args = {
    initialCompact: false,
};

const menuGroupsData: MenuGroup[] = [
    {id: 'analytics', title: 'Analytics', icon: ChartColumn, popupTitle: 'Analytics'},
    {id: 'monitoring', title: 'Monitoring', icon: Cloud, popupTitle: 'Monitoring'},
    {id: 'storage', title: 'Storage', icon: Database, popupTitle: 'Storage'},
    {id: 'security', title: 'Security', icon: ShieldKeyhole, popupTitle: 'Security'},
    {id: 'settings', title: 'Settings', icon: Gear, popupTitle: 'Settings'},
];

/** First group expanded; remaining groups collapsed (menuOverflow="scroll" inline groups). */
const defaultCollapsedMenuGroupIdsExceptFirst: AsideHeaderProps['defaultCollapsedMenuGroupIds'] =
    Object.fromEntries(menuGroupsData.slice(1).map((group) => [group.id, true]));

/** Demo menu with `groupId`/`category` for All pages grouping; default matches `defaultMenuItems`. */
const menuItemsWithGroupsForAllPages: AsideHeaderProps['menuItems'] = [
    {id: 'home', title: 'Home', icon: Gear, category: 'General'},
    {
        id: 'analytics-overview',
        title: 'Overview',
        icon: ChartPie,
        groupId: 'analytics',
        category: 'Analytics',
        current: true,
    },
    {
        id: 'analytics-reports',
        title: 'Reports',
        icon: FileText,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'analytics-dashboards',
        title: 'Dashboards',
        icon: LayoutHeaderCellsLarge,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'analytics-metrics',
        title: 'Metrics',
        icon: ChartLine,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'monitoring-alerts',
        title: 'Alerts',
        icon: Bell,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-logs',
        title: 'Logs',
        icon: Terminal,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-traces',
        title: 'Traces',
        icon: Route,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-uptime',
        title: 'Uptime',
        icon: AntennaSignal,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'storage-buckets',
        title: 'Buckets',
        icon: Bucket,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-databases',
        title: 'Databases',
        icon: Database,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-volumes',
        title: 'Volumes',
        icon: HardDrive,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-snapshots',
        title: 'Snapshots',
        icon: CopyCheck,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-backups',
        title: 'Backups',
        icon: CloudArrowUpIn,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'security-access',
        title: 'Access keys',
        icon: Key,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-roles',
        title: 'Roles',
        icon: Persons,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-audit',
        title: 'Audit log',
        icon: ListTimeline,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-policies',
        title: 'Policies',
        icon: ShieldCheck,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'general-settings',
        title: 'General',
        icon: Sliders,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'user-settings',
        title: 'Users',
        icon: Person,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'billing-settings',
        title: 'Billing',
        icon: CreditCard,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'integrations-settings',
        title: 'Integrations',
        icon: PlugConnection,
        groupId: 'settings',
        category: 'Settings',
    },
    {id: 'help', title: 'Help', icon: Gear, category: 'General'},
];

const menuItemsForMenuGroupsNewIdea: AsideHeaderItem[] = menuItemsWithGroupsForAllPages.map(
    (item) => {
        if (item.id === 'home') {
            return {...item, icon: House};
        }
        if (item.id === 'analytics-reports') {
            return {...item, quickAccess: true};
        }
        if (item.id === 'analytics-dashboards') {
            return {
                ...item,
                title: 'Weekly operational performance',
                titleLines: 2,
            };
        }
        if (item.id === 'help') {
            return {...item, icon: BookOpen};
        }
        return item;
    },
);

const menuItemsForMenuGroupsNewIdeaFlat: AsideHeaderItem[] = menuItemsForMenuGroupsNewIdea.map(
    ({groupId: _groupId, ...item}) => item,
);

const MENU_GROUPS_NEW_IDEA_STATS = [
    {label: 'Active users', value: '12.4k', delta: '+8.2%'},
    {label: 'Requests / min', value: '842', delta: '+3.1%'},
    {label: 'Error rate', value: '0.12%', delta: '-0.04%'},
    {label: 'P95 latency', value: '186 ms', delta: '-12 ms'},
];

const MENU_GROUPS_NEW_IDEA_ACTIVITY = [
    {time: '09:41', event: 'Dashboard "Revenue Q1" refreshed', status: 'OK'},
    {time: '09:38', event: 'Alert rule "High CPU" triggered', status: 'Warning'},
    {time: '09:22', event: 'Export "Weekly report" completed', status: 'OK'},
    {time: '08:57', event: 'New dataset ingested from S3', status: 'OK'},
    {time: '08:15', event: 'User session spike in eu-central', status: 'Info'},
];

function MenuGroupsNewIdeaPageContent({category, title}: {category?: string; title: string}) {
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
                {MENU_GROUPS_NEW_IDEA_STATS.map((stat) => (
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
                    {MENU_GROUPS_NEW_IDEA_ACTIVITY.map((row) => (
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

function MenuGroupsWithAllPagesDemo(props: {
    initialCompact?: boolean;
    menuOverflow?: AsideHeaderProps['menuOverflow'];
    menuGroupNestedIcons?: AsideHeaderProps['menuGroupNestedIcons'];
    description: React.ReactNode;
}) {
    const [compact, setCompact] = React.useState(props.initialCompact ?? false);
    const [menuItems, setMenuItems] = React.useState<AsideHeaderProps['menuItems']>(
        menuItemsWithGroupsForAllPages,
    );
    const [menuGroupsState, setMenuGroupsState] =
        React.useState<AsideHeaderProps['menuGroups']>(menuGroupsData);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration={false}
                logo={DEFAULT_LOGO}
                menuItems={menuItems}
                defaultMenuItems={menuItemsWithGroupsForAllPages}
                onMenuItemsChanged={setMenuItems}
                menuGroups={menuGroupsState}
                onMenuGroupsChanged={setMenuGroupsState}
                editMenuProps={{enableSorting: true}}
                onChangeCompact={setCompact}
                menuOverflow={props.menuOverflow}
                defaultCollapsedMenuGroupIds={
                    props.menuOverflow === 'scroll'
                        ? defaultCollapsedMenuGroupIdsExceptFirst
                        : undefined
                }
                menuGroupNestedIcons={props.menuGroupNestedIcons}
            />
            <PageLayout.Content>
                <div style={{padding: 16}}>{props.description}</div>
            </PageLayout.Content>
        </PageLayout>
    );
}

const menuGroupsStoryArgTypes = {
    menuGroupNestedIcons: {
        control: 'boolean' as const,
        description: 'Show icons on nested menu group items',
    },
    quickAccessHighlightInMainMenu: {
        control: 'boolean' as const,
        description:
            'Keep the active item highlighted in the main menu when it is also in quick access',
    },
};

/** Default overflow (collapse / &quot;More&quot;). Includes All pages + group popupTitle in data. */
const MenuGroupsTemplate: StoryFn = (args) => (
    <MenuGroupsWithAllPagesDemo
        initialCompact={args.initialCompact}
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        description={
            <>
                Default menuOverflow (overflow items move under &quot;More&quot;). Groups use
                MenuGroup.popupTitle as the compact popup heading. Open <strong>All pages</strong>,
                then edit mode: pin items or group headers (with onMenuGroupsChanged).
            </>
        }
    />
);

export const MenuGroups = MenuGroupsTemplate.bind({});
MenuGroups.argTypes = menuGroupsStoryArgTypes;
MenuGroups.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
};

const MenuGroupsCompactTemplate: StoryFn = (args) => (
    <MenuGroupsWithAllPagesDemo
        initialCompact={args.initialCompact}
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        description={
            <>
                Compact sidebar: same overflow behavior as MenuGroups when the rail is narrow. Hover
                a group icon to see MenuGroup.popupTitle. <strong>All pages</strong> editing matches
                the non-compact story.
            </>
        }
    />
);

export const MenuGroupsCompact = MenuGroupsCompactTemplate.bind({});
MenuGroupsCompact.argTypes = menuGroupsStoryArgTypes;
MenuGroupsCompact.args = {
    initialCompact: true,
    menuGroupNestedIcons: true,
};

const MenuGroupsScrollbarTemplate: StoryFn = (args) => (
    <MenuGroupsWithAllPagesDemo
        menuOverflow="scroll"
        initialCompact={args.initialCompact}
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        description={
            <>
                Non-compact: menuOverflow=&quot;scroll&quot; — groups render as nested lists with
                tree connectors (in compact, behavior matches the collapse stories). Open{' '}
                <strong>All pages</strong> for the same edit flow; popupTitle applies when you
                switch to compact via the header control.
            </>
        }
    />
);

export const MenuGroupsScrollbar = MenuGroupsScrollbarTemplate.bind({});
MenuGroupsScrollbar.argTypes = menuGroupsStoryArgTypes;
MenuGroupsScrollbar.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
};

function MenuGroupsWithSubheaderAndFooterDemo(props: {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderProps['menuDensity'];
    menuGroupNestedIcons?: AsideHeaderProps['menuGroupNestedIcons'];
    quickAccessHighlightInMainMenu?: AsideHeaderProps['quickAccessHighlightInMainMenu'];
    description: React.ReactNode;
    withPageContent?: boolean;
    flatMenu?: boolean;
}) {
    const [compact, setCompact] = React.useState(props.initialCompact ?? false);
    const [currentPageId, setCurrentPageId] = React.useState('analytics-overview');
    const [menuItemsBase, setMenuItemsBase] = React.useState<AsideHeaderItem[]>(
        props.flatMenu ? menuItemsForMenuGroupsNewIdeaFlat : menuItemsForMenuGroupsNewIdea,
    );

    const menuItems = React.useMemo<AsideHeaderItem[]>(
        () =>
            menuItemsBase.map((item) => ({
                ...item,
                current: props.withPageContent ? item.id === currentPageId : item.current,
                onItemClick: props.withPageContent
                    ? (
                          clicked: AsideHeaderItem,
                          _collapsed: boolean,
                          _event: React.MouseEvent<HTMLElement, MouseEvent>,
                      ) => {
                          if (clicked.type !== 'divider') {
                              setCurrentPageId(clicked.id);
                          }
                      }
                    : item.onItemClick,
            })),
        [menuItemsBase, currentPageId, props.withPageContent],
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
                quickAccessHighlightInMainMenu={props.quickAccessHighlightInMainMenu}
                enableAllPages={false}
                onMenuItemsChanged={setMenuItemsBase}
                onChangeCompact={setCompact}
                menuOverflow="scroll"
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
                {props.withPageContent ? (
                    <MenuGroupsNewIdeaPageContent
                        category={currentItem?.category}
                        title={pageTitle}
                    />
                ) : (
                    <div style={{padding: 16}}>{props.description}</div>
                )}
            </PageLayout.Content>
        </PageLayout>
    );
}

const MenuGroupsNewIdeaTemplate: StoryFn = (args) => (
    <MenuGroupsWithSubheaderAndFooterDemo
        initialCompact={args.initialCompact}
        menuDensity="compact"
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        quickAccessHighlightInMainMenu={args.quickAccessHighlightInMainMenu}
        withPageContent
        description={null}
    />
);

export const MenuGroupsNewIdea = MenuGroupsNewIdeaTemplate.bind({});
MenuGroupsNewIdea.argTypes = menuGroupsStoryArgTypes;
MenuGroupsNewIdea.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
    quickAccessHighlightInMainMenu: false,
};

const MenuGroupsNewIdeaFlatTemplate: StoryFn = (args) => (
    <MenuGroupsWithSubheaderAndFooterDemo
        initialCompact={args.initialCompact}
        menuDensity="compact"
        menuGroupNestedIcons={args.menuGroupNestedIcons}
        quickAccessHighlightInMainMenu={args.quickAccessHighlightInMainMenu}
        withPageContent
        flatMenu
        description={null}
    />
);

export const MenuGroupsNewIdeaFlat = MenuGroupsNewIdeaFlatTemplate.bind({});
MenuGroupsNewIdeaFlat.storyName = 'Menu Groups New Idea (Flat)';
MenuGroupsNewIdeaFlat.argTypes = menuGroupsStoryArgTypes;
MenuGroupsNewIdeaFlat.args = {
    initialCompact: false,
    menuGroupNestedIcons: true,
    quickAccessHighlightInMainMenu: false,
};

const manyMenuItems: AsideHeaderProps['menuItems'] = Array.from({length: 25}, (_, index) => ({
    id: `item-${index + 1}`,
    title: `Item ${index + 1}`,
    icon: Gear,
    current: index === 0,
}));

const ScrollableModeTemplate: StoryFn<{initialCompact?: boolean}> = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact ?? false);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                logo={DEFAULT_LOGO}
                menuItems={manyMenuItems}
                menuOverflow="scroll"
                onChangeCompact={setCompact}
            />
            <PageLayout.Content>
                <div style={{padding: 16}}>
                    Scrollable navigation (menuOverflow=&quot;scroll&quot;)
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const MenuScrollbar = ScrollableModeTemplate.bind({});
MenuScrollbar.args = {
    initialCompact: false,
};
