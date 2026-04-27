import React from 'react';

import {Gear, Xmark} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text, spacing} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react';

import {MenuGroup} from '../../types';
import {AsideHeader} from '../AsideHeader';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {AsideHeaderProps} from '../types';

import {AsideHeaderShowcase, AsideHeaderShowcaseProps} from './AsideHeaderShowcase';
import {DEFAULT_LOGO, menuItemsClamped, menuItemsShowcase} from './moc';

import logoIcon from '../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/AsideHeader',
    component: AsideHeader,
    parameters: {
        a11y: {
            element: '#storybook-root',
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
    {id: 'analytics', title: 'Analytics', icon: Gear, popupTitle: 'Analytics'},
    {id: 'settings', title: 'Settings', icon: Gear},
];

const menuItemsWithGroups: AsideHeaderProps['menuItems'] = [
    {id: 'home', title: 'Home', icon: Gear},
    {id: 'analytics-overview', title: 'Overview', icon: Gear, groupId: 'analytics'},
    {id: 'analytics-reports', title: 'Reports', icon: Gear, groupId: 'analytics'},
    {id: 'analytics-dashboards', title: 'Dashboards', icon: Gear, groupId: 'analytics'},
    {id: 'general-settings', title: 'General', icon: Gear, groupId: 'settings'},
    {id: 'user-settings', title: 'Users', icon: Gear, groupId: 'settings'},
    {id: 'help', title: 'Help', icon: Gear},
];

const MenuGroupsTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact ?? false);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                logo={DEFAULT_LOGO}
                menuItems={menuItemsWithGroups}
                menuGroups={menuGroupsData}
                onChangeCompact={setCompact}
            />
            <PageLayout.Content>
                <div style={{padding: 16}}>Menu Groups Demo</div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const MenuGroups = MenuGroupsTemplate.bind({});
MenuGroups.args = {
    initialCompact: false,
};

export const MenuGroupsCompact = MenuGroupsTemplate.bind({});
MenuGroupsCompact.args = {
    initialCompact: true,
};

const menuGroupsWithPopupTitle: MenuGroup[] = [
    {id: 'analytics', title: 'Analytics', icon: Gear, popupTitle: 'Analytics'},
    {id: 'settings', title: 'Settings', icon: Gear, popupTitle: 'Settings'},
];

const MenuGroupsWithPopupTitleTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact ?? true);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                logo={DEFAULT_LOGO}
                menuItems={menuItemsWithGroups}
                menuGroups={menuGroupsWithPopupTitle}
                onChangeCompact={setCompact}
            />
            <PageLayout.Content>
                <div style={{padding: 16}}>
                    Hover the group icon in the compact sidebar to see the popup heading
                    `MenuGroup.popupTitle`.
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const MenuGroupsWithPopupTitle = MenuGroupsWithPopupTitleTemplate.bind({});
MenuGroupsWithPopupTitle.args = {
    initialCompact: true,
};

const MenuGroupsScrollbarTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact ?? false);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                logo={DEFAULT_LOGO}
                menuItems={menuItemsWithGroups}
                menuGroups={menuGroupsData}
                menuOverflow="scroll"
                onChangeCompact={setCompact}
            />
            <PageLayout.Content>
                <div style={{padding: 16}}>
                    Expanded sidebar with <code>menuOverflow=&quot;scroll&quot;</code>: groups
                    render as nested lists with tree connectors.
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const MenuGroupsScrollbar = MenuGroupsScrollbarTemplate.bind({});
MenuGroupsScrollbar.args = {
    initialCompact: false,
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
