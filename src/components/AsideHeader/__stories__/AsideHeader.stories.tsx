import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text, spacing} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react';

import {AsideHeader} from '../AsideHeader';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {useIsExpanded} from '../hooks/useIsExpanded';

import {AsideHeaderShowcase, AsideHeaderShowcaseProps} from './AsideHeaderShowcase';
import {DEFAULT_LOGO, menuItemsClamped, menuItemsMany, menuItemsShowcase} from './moc';

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

const MultipleTooltipTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const MultipleTooltip = MultipleTooltipTemplate.bind({});
MultipleTooltip.args = {
    multipleTooltip: true,
    initialCompact: true,
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
    const {isExpanded, setIsExpanded, handleMouseEnter, handleMouseLeave} = useIsExpanded(compact);

    return (
        <PageLayout compact={compact} isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                onChangeCompact={setCompact}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
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
    const {isExpanded, setIsExpanded} = useIsExpanded(compact);

    return (
        <PageLayout compact={compact} isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
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
    const {isExpanded, setIsExpanded, handleMouseEnter, handleMouseLeave} = useIsExpanded(compact);
    return (
        <PageLayout compact={compact} isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
            <PageLayoutAside
                logo={{icon: logoIcon, text: 'Line clamp', 'aria-label': 'Line clamp'}}
                menuItems={menuItemsClamped}
                onChangeCompact={setCompact}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                headerDecoration
            />
        </PageLayout>
    );
}

const CollapseButtonWrapperTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact);
    const {isExpanded, setIsExpanded, handleMouseEnter, handleMouseLeave} = useIsExpanded(compact);

    return (
        <PageLayout compact={compact} isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={DEFAULT_LOGO}
                onChangeCompact={setCompact}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
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

const ManyItemsTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState<boolean>(args.initialCompact);

    return (
        <PageLayout compact={compact}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsMany}
                logo={DEFAULT_LOGO}
                onChangeCompact={setCompact}
                {...args}
            />

            <PageLayout.Content>
                <div style={{padding: 16}}>
                    <Button onClick={() => setCompact((prev) => !prev)}>Toggle compact</Button>
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
    initialCompact: false,
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
