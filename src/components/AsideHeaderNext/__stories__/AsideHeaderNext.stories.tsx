import * as React from 'react';

import {Bug, Gear, Magnifier, Xmark} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {AsideHeaderNext} from '../AsideHeaderNext';

import {
    DEFAULT_LOGO,
    manyMenuItems,
    menuItemsClamped,
    menuItemsShowcase,
    text as placeholderText,
} from './moc';

export default {
    title: 'AsideHeaderNext',
    component: AsideHeaderNext.Root,
    parameters: {layout: 'fullscreen'},
} as Meta;

const Frame = ({children}: {children: React.ReactNode}) => (
    <div style={{height: '100vh'}}>{children}</div>
);

enum Panel {
    Search = 'search',
    ProjectSettings = 'projectSettings',
    UserSettings = 'userSettings',
}

interface ShowcaseProps {
    initialCompact?: boolean;
    hideCollapseButton?: boolean;
    headerDecoration?: boolean;
    customBackground?: React.ReactNode;
    topAlert?: React.ReactNode;
}

/**
 * Direct port of the old `AsideHeader` Showcase onto the compound API:
 * logo + subheader (with a flyout) + menu + footer (panels & a flyout) +
 * content + drawer panels — composed explicitly instead of via props/render callbacks.
 */
const ShowcaseView: React.FC<ShowcaseProps> = ({
    initialCompact = false,
    hideCollapseButton = false,
    customBackground,
    topAlert,
}) => {
    const [compact, setCompact] = React.useState(initialCompact);
    const [openPanel, setOpenPanel] = React.useState<Panel>();

    const togglePanel = (panel: Panel) =>
        setOpenPanel((current) => (current === panel ? undefined : panel));

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                {topAlert ? <AsideHeaderNext.Alert>{topAlert}</AsideHeaderNext.Alert> : null}

                {customBackground ? (
                    <AsideHeaderNext.Background>{customBackground}</AsideHeaderNext.Background>
                ) : null}

                <AsideHeaderNext.Logo {...DEFAULT_LOGO} />

                <AsideHeaderNext.Subheader>
                    <AsideHeaderNext.Item
                        id="services"
                        icon={Gear}
                        popupTitle="Services"
                        items={[
                            {id: 'set-1', children: 'Set 1'},
                            {id: 'set-2', children: 'Set 2'},
                            {id: 'set-3', children: 'Set 3'},
                            {id: 'set-4', children: 'Set 4'},
                        ]}
                    >
                        Services
                    </AsideHeaderNext.Item>
                    <AsideHeaderNext.Item
                        id="search"
                        icon={Magnifier}
                        current={openPanel === Panel.Search}
                        onClick={() => togglePanel(Panel.Search)}
                    >
                        Search
                    </AsideHeaderNext.Item>
                </AsideHeaderNext.Subheader>

                <AsideHeaderNext.Menu items={menuItemsShowcase} aria-label="Main navigation" />

                <AsideHeaderNext.Footer>
                    <AsideHeaderNext.Item
                        id="infra"
                        icon={Gear}
                        popupTitle="Status"
                        items={[
                            {id: 'set-1', children: 'Set 1'},
                            {id: 'set-2', children: 'Set 2'},
                            {id: 'set-3', children: 'Set 3'},
                            {id: 'set-4', children: 'Set 4'},
                        ]}
                    >
                        Minor issue
                    </AsideHeaderNext.Item>
                    <AsideHeaderNext.Item
                        id="project-settings"
                        icon={Bug}
                        tooltipText="Settings with panel"
                        current={openPanel === Panel.ProjectSettings}
                        onClick={() => togglePanel(Panel.ProjectSettings)}
                    >
                        Settings with panel
                    </AsideHeaderNext.Item>
                    <AsideHeaderNext.Item
                        id="user-settings"
                        icon={Gear}
                        tooltipText="User Settings with panel"
                        current={openPanel === Panel.UserSettings}
                        onClick={() => togglePanel(Panel.UserSettings)}
                    >
                        User Settings with panel
                    </AsideHeaderNext.Item>
                </AsideHeaderNext.Footer>

                {hideCollapseButton ? null : <AsideHeaderNext.CollapseButton />}

                <AsideHeaderNext.Content>
                    <div style={{padding: 20, maxWidth: 720}}>
                        <pre>{placeholderText}</pre>
                    </div>
                </AsideHeaderNext.Content>

                <AsideHeaderNext.Panel
                    id="search"
                    open={openPanel === Panel.Search}
                    onClose={() => setOpenPanel(undefined)}
                >
                    <div style={{padding: 20, width: 300}}>Search panel</div>
                </AsideHeaderNext.Panel>
                <AsideHeaderNext.Panel
                    id="project-settings"
                    open={openPanel === Panel.ProjectSettings}
                    onClose={() => setOpenPanel(undefined)}
                >
                    <div style={{padding: 20, width: 300}}>Project Settings</div>
                </AsideHeaderNext.Panel>
                <AsideHeaderNext.Panel
                    id="user-settings"
                    open={openPanel === Panel.UserSettings}
                    onClose={() => setOpenPanel(undefined)}
                >
                    <div style={{padding: 20, width: 300}}>User Settings</div>
                </AsideHeaderNext.Panel>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

const ShowcaseTemplate: StoryFn<ShowcaseProps> = (args) => <ShowcaseView {...args} />;

export const Showcase = ShowcaseTemplate.bind({});

export const Compact = ShowcaseTemplate.bind({});
Compact.args = {
    initialCompact: true,
    hideCollapseButton: true,
};

/** Same showcase, themed entirely via the existing `--gn-aside-header-*` CSS variables. */
export const CustomTheme: StoryFn<ShowcaseProps> = (args) => (
    <React.Fragment>
        <style>
            {`.g-root {
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
        <ShowcaseView {...args} />
    </React.Fragment>
);

/** Custom background element via the `Background` slot (replaces `customBackground` prop). */
export const CustomBackground = ShowcaseTemplate.bind({});
CustomBackground.args = {
    customBackground: <img src="custom-theme-background.png" width="100%" alt="" />,
};

/**
 * The old `AdvancedUsage` (PageLayout / PageLayoutAside) maps to `layout="manual"`:
 * you place the aside parts yourself, with no slot magic.
 */
export const AdvancedUsage: StoryFn = () => {
    const [compact, setCompact] = React.useState(true);

    return (
        <Frame>
            <AsideHeaderNext.Root layout="manual" compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Aside>
                    <AsideHeaderNext.Logo {...DEFAULT_LOGO} />
                    <div style={{flex: '1 1 auto', minHeight: 0, overflowY: 'auto'}}>
                        <AsideHeaderNext.Menu
                            items={menuItemsShowcase}
                            aria-label="Main navigation"
                        />
                    </div>
                    <AsideHeaderNext.CollapseButton />
                </AsideHeaderNext.Aside>
                <AsideHeaderNext.Content>
                    <div style={{padding: 20}}>PageContent</div>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

const banner = (background: string, content: React.ReactNode): React.ReactNode => (
    <div style={{padding: 8, color: 'var(--g-color-text-light-primary)', background}}>
        {content}
    </div>
);

export const HeaderAlert = ShowcaseTemplate.bind({});
HeaderAlert.args = {
    topAlert: banner(
        'var(--g-color-base-warning-medium)',
        <Flex justifyContent="space-between" alignItems="center" gap={2}>
            <Text style={{color: 'var(--g-color-text-light-primary)'}}>
                Maintenance: Scheduled maintenance is being performed
            </Text>
        </Flex>,
    ),
};

export const HeaderAlertCentered = ShowcaseTemplate.bind({});
HeaderAlertCentered.args = {
    topAlert: banner(
        'var(--g-color-base-warning-medium)',
        <Flex justifyContent="center">
            <Text style={{color: 'var(--g-color-text-light-primary)'}}>
                Scheduled maintenance is being performed
            </Text>
        </Flex>,
    ),
};

export const HeaderAlertCustom = ShowcaseTemplate.bind({});
HeaderAlertCustom.args = {
    topAlert: (
        <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={4}
            style={{
                position: 'relative',
                padding: '8px',
                background:
                    'linear-gradient(120deg, #191654, #43cea2 40%, #185a9d 70%, #f857a6 100%)',
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
            >
                <Icon data={Xmark} size={18} />
            </Button>
        </Flex>
    ),
};

/** Long titles ellipsis (the old `LineClamp` story). */
export const LineClamp: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo text="Line clamp" icon={DEFAULT_LOGO.icon} href="#" />
                <AsideHeaderNext.Menu items={menuItemsClamped} aria-label="Main navigation" />
                <AsideHeaderNext.CollapseButton />
                <AsideHeaderNext.Content>
                    <div style={{padding: 20}}>Line clamp</div>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/**
 * The old `collapseButtonWrapper` callback becomes the standard `render` prop:
 * wrap/extend the default button without a bespoke API.
 */
export const CollapseButtonWrapper: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo {...DEFAULT_LOGO} />
                <AsideHeaderNext.Menu items={menuItemsShowcase} aria-label="Main navigation" />
                <AsideHeaderNext.CollapseButton
                    render={(props, {compact: isCompact}) => (
                        <React.Fragment>
                            <button {...props} />
                            <div
                                style={{
                                    backgroundColor: 'var(--g-color-base-generic)',
                                    padding: 5,
                                }}
                            >
                                <Flex justifyContent="center" alignItems="center" gap={1}>
                                    <Icon size={14} data={DEFAULT_LOGO.icon} />
                                    {isCompact ? null : <Text color="secondary">Gravity UI</Text>}
                                </Flex>
                            </div>
                        </React.Fragment>
                    )}
                />
                <AsideHeaderNext.Content>
                    <div style={{padding: 20}}>Collapse button wrapper</div>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/** Many items — the menu region scrolls (old `MenuScrollbar`). */
export const MenuScrollbar: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo {...DEFAULT_LOGO} />
                <AsideHeaderNext.Menu items={manyMenuItems} aria-label="Main navigation" />
                <AsideHeaderNext.CollapseButton />
                <AsideHeaderNext.Content>
                    <div style={{padding: 20}}>Scrollable navigation</div>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};
