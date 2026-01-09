import React from 'react';

import {Gear, Magnifier, Xmark} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text, spacing} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react';

import {AsideHeader} from '../AsideHeader';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';

import {AsideHeaderShowcase, AsideHeaderShowcaseProps} from './AsideHeaderShowcase';
import {
    DEFAULT_LOGO,
    menuGroupsWithIcons,
    menuItemsClamped,
    menuItemsMany,
    menuItemsShowcase,
    menuItemsWithGroups,
} from './moc';

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

const CollapsedTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const Collapsed = CollapsedTemplate.bind({});
Collapsed.args = {
    initialPinned: false,
    hideCollapseButton: true,
};

const MultipleTooltipTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const MultipleTooltip = MultipleTooltipTemplate.bind({});
MultipleTooltip.args = {
    multipleTooltip: true,
    initialPinned: false,
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
    const [pinned, setPinned] = React.useState(args.initialPinned);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                qa={'pl-aside'}
                {...args}
            />

            <PageLayout.Content>PageContent</PageLayout.Content>
        </PageLayout>
    );
};

export const AdvancedUsage = AdvancedUsageTemplate.bind({});

AdvancedUsage.args = {
    multipleTooltip: false,
    initialPinned: false,
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
    const [pinned, setPinned] = React.useState(true);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned}>
            <AsideFallback
                headerDecoration={headerDecoration}
                subheaderItemsCount={subheaderItemsCount}
                qa="pl-aside-fallback"
            />

            <PageLayout.Content>
                <div style={{padding: 16}}>
                    <Button onClick={() => setPinned((prev) => !prev)}>Toggle pinned</Button>
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const Fallback = FallbackTemplate.bind({});
Fallback.args = fallbackArgs;

/** @type {StoryFn} */
export function LineClamp() {
    const [pinned, setPinned] = React.useState(true);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned}>
            <PageLayoutAside
                logo={{icon: logoIcon, text: 'Line clamp', 'aria-label': 'Line clamp'}}
                menuItems={menuItemsClamped}
                headerDecoration
            />
        </PageLayout>
    );
}

const CollapseButtonWrapperTemplate: StoryFn = (args) => {
    const [pinned, setPinned] = React.useState(args.initialPinned);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                collapseButtonWrapper={(defaultButton, {isExpanded}) => (
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
                                        className={isExpanded ? spacing({mr: 1}) : undefined}
                                    />
                                }
                                {isExpanded ? <Text color="secondary">{'Gravity UI'}</Text> : null}
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
    initialPinned: true,
};

const ManyItemsTemplate: StoryFn = (args) => {
    const [pinned, setPinned] = React.useState<boolean>(args.initialPinned);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsMany}
                logo={DEFAULT_LOGO}
                {...args}
            />

            <PageLayout.Content>
                <div style={{padding: 16}}>
                    <Button onClick={() => setPinned((prev) => !prev)}>Toggle pinned</Button>
                    <div style={{marginTop: 16}}>
                        <Text variant="subheader-2">
                            Scroll demonstration with many navigation items
                        </Text>
                        <Text color="secondary" style={{marginTop: 8}}>
                            Total items: {menuItemsMany?.length || 0}. On low screens, items scroll
                            with invisible scrollbar instead of collapsing into &quot;...&quot;
                        </Text>
                    </div>
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
};

export const ManyItems = ManyItemsTemplate.bind({});
ManyItems.args = {
    initialPinned: true,
};
ManyItems.parameters = {
    docs: {
        description: {
            story:
                'Demonstration of scroll functionality with many navigation items. ' +
                'On low screens, all items remain accessible through scrolling with invisible scrollbar.',
        },
    },
};

const GroupedMenuCollapsibleTemplate: StoryFn = (args) => {
    const [pinned, setPinned] = React.useState(true);
    const [menuItems, setMenuItems] = React.useState(menuItemsWithGroups);
    const [currentMenuGroups, setCurrentMenuGroups] = React.useState(menuGroupsWithIcons);

    return (
        <PageLayout pinned={pinned} onChangePinned={setPinned} isCompactMode={args.isCompactMode}>
            <PageLayoutAside
                headerDecoration
                logo={DEFAULT_LOGO}
                menuItems={menuItems}
                defaultMenuItems={menuItemsWithGroups}
                editMenuProps={{enableSorting: true}}
                menuGroups={currentMenuGroups}
                defaultMenuGroups={menuGroupsWithIcons}
                subheaderItems={[
                    {
                        id: 'services',
                        title: 'Services',
                        icon: Gear,
                        popupPlacement: ['right-start'],
                        popupOffset: {mainAxis: 10, crossAxis: 10},
                    },
                    {
                        id: 'search',
                        title: 'Search',
                        qa: 'subheader-item-search',
                        icon: Magnifier,
                    },
                ]}
                onMenuItemsChanged={setMenuItems}
                onMenuGroupsChanged={setCurrentMenuGroups}
                {...args}
            />
        </PageLayout>
    );
};

export const GroupedMenuCollapsible = GroupedMenuCollapsibleTemplate.bind({});
GroupedMenuCollapsible.args = {
    multipleTooltip: false,
    initialPinned: true,
};

export const CompactMode = GroupedMenuCollapsibleTemplate.bind({});
CompactMode.args = {
    isCompactMode: true,
};

const CustomThemesWithNewColorsTemplate: StoryFn = (args) => {
    return (
        <>
            <style>
                {`.g-root {
                    /* Top zone (subheader) */
                    --gn-aside-top-item-icon-color: #ff0000;
                    --gn-aside-top-item-text-color: #ff6600;
                    --gn-aside-top-item-background-color: rgba(255, 255, 0, 0.3);
                    --gn-aside-top-item-background-color-hover: rgba(255, 255, 0, 0.7);
                    --gn-aside-top-item-current-icon-color: #00ff00;
                    --gn-aside-top-item-current-text-color: #00cc00;
                    --gn-aside-top-item-current-background-color: rgba(0, 255, 0, 0.2);
                    --gn-aside-top-item-current-background-color-hover: rgba(0, 255, 0, 0.4);

                    /* Main zone (groups) */
                    --gn-aside-main-background-color: transparent;
                    --gn-aside-main-group-item-background-color: rgba(255, 255, 255, 0.6);
                    --gn-aside-main-group-item-background-color-hover: rgba(0, 255, 255, 0.7);
                    --gn-aside-main-group-item-current-background-color: rgba(0, 0, 255, 0.2);
                    --gn-aside-main-group-item-current-background-color-hover: rgba(0, 0, 255, 0.4);

                    /* Bottom zone (footer) */
                    --gn-aside-bottom-background-color: rgba(128, 0, 128, 0.1);
                    --gn-aside-bottom-divider-color: #ff00ff;
                    --gn-aside-bottom-item-icon-color: #ff00ff;
                    --gn-aside-bottom-item-text-color: #cc00cc;
                    --gn-aside-bottom-item-background-color-hover: rgba(255, 0, 255, 0.3);
                    --gn-aside-bottom-item-current-icon-color: #00ffff;
                    --gn-aside-bottom-item-current-text-color: #00cccc;
                    --gn-aside-bottom-item-current-background-color: rgba(0, 255, 255, 0.2);
                    --gn-aside-bottom-item-current-background-color-hover: rgba(0, 255, 255, 0.4);
            }`}
            </style>

            <AsideHeaderShowcase
                {...args}
                externalMenuItems={menuItemsWithGroups}
                externalMenuGroups={menuGroupsWithIcons}
            >
                <div>
                    <Text>Custom content</Text>
                </div>
            </AsideHeaderShowcase>
        </>
    );
};

export const CustomThemesWithNewColors = CustomThemesWithNewColorsTemplate.bind({});
CustomThemesWithNewColors.args = {
    multipleTooltip: false,
    initialCompact: false,
};
