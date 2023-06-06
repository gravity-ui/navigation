import React from 'react';
import block from 'bem-cn-lite';

import {AsideHeader, FooterItem} from '../..';
import {text as placeholderText} from './moc';
import {menuItemsShowcase} from './../../CompositeBar/__stories__/moc';
import {RadioButton, Radio} from '@gravity-ui/uikit';

import logoIcon from '../../../../.storybook/assets/logo.svg';
import menuItemIcon from '../../../../.storybook/assets/settings.svg';

import './AsideHeaderShowcase.scss';

const b = block('aside-header-showcase');

const BOOLEAN_OPTIONS = {
    Yes: 'yes',
    No: 'no',
};

enum Panel {
    ProjectSettings = 'projectSettings',
    Search = 'search',
    UserSettings = 'userSettings',
    Components = 'components',
}

export function AsideHeaderShowcase() {
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [visiblePanel, setVisiblePanel] = React.useState<Panel>();
    const [compact, setCompact] = React.useState(false);
    const [headerDecoration, setHeaderDecoration] = React.useState<string>(BOOLEAN_OPTIONS.Yes);

    const navRef = React.useRef<AsideHeader>(null);

    return (
        <div className={b()}>
            <AsideHeader
                ref={navRef}
                logo={{
                    text: 'Service',
                    icon: logoIcon,
                    href: '#',
                    onClick: () => alert('click on logo'),
                }}
                headerDecoration={headerDecoration === BOOLEAN_OPTIONS.Yes}
                menuItems={[
                    ...menuItemsShowcase,
                    {
                        id: 'components',
                        title: 'Components',
                        icon: menuItemIcon,
                        current: visiblePanel === Panel.Components,
                        iconSize: 20,
                        onItemClick: () =>
                            setVisiblePanel(
                                visiblePanel === Panel.Components ? undefined : Panel.Components,
                            ),
                    },
                ]}
                subheaderItems={[
                    {
                        id: 'services',
                        title: 'Services',
                        icon: menuItemIcon,
                        iconSize: 20,
                    },
                    {
                        id: 'search',
                        title: 'Search',
                        icon: menuItemIcon,
                        current: visiblePanel === Panel.Search,
                        iconSize: 20,
                        onItemClick: () =>
                            setVisiblePanel(
                                visiblePanel === Panel.Search ? undefined : Panel.Search,
                            ),
                    },
                ]}
                compact={compact}
                renderFooter={({compact}) => (
                    <React.Fragment>
                        <FooterItem
                            compact={compact}
                            item={{
                                id: 'infra',
                                icon: menuItemIcon,
                                iconSize: 20,
                                current: popupVisible,
                                title: (
                                    <div className={b('infra-text')}>
                                        <span className={b('infra-label')}>Minor issue</span>
                                        <span className={b('infra-period')}>Now</span>
                                    </div>
                                ),
                                tooltipText: 'Minor issue (Now)',
                                onItemClick: () => {
                                    setVisiblePanel(undefined);
                                    setPopupVisible(!popupVisible);
                                },
                            }}
                            enableTooltip={!popupVisible}
                            popupVisible={popupVisible}
                            popupOffset={[0, 8]}
                            onClosePopup={() => setPopupVisible(false)}
                            renderPopupContent={() => {
                                return (
                                    <div className={b('settings-ul')}>
                                        <ul>
                                            <li>Set 1</li>
                                            <li>Set 2</li>
                                            <li>Set 3</li>
                                            <li>Set 4</li>
                                        </ul>
                                    </div>
                                );
                            }}
                        />
                        <FooterItem
                            item={{
                                id: 'project-settings',
                                icon: menuItemIcon,
                                iconSize: 20,
                                title: 'Settings with panel',
                                tooltipText: 'Settings with panel',
                                current: visiblePanel === Panel.ProjectSettings,
                                onItemClick: () => {
                                    setVisiblePanel(
                                        visiblePanel === Panel.ProjectSettings
                                            ? undefined
                                            : Panel.ProjectSettings,
                                    );
                                },
                            }}
                            compact={compact}
                        />
                        <FooterItem
                            item={{
                                id: 'user-settings',
                                icon: menuItemIcon,
                                iconSize: 20,
                                title: 'User Settings with panel',
                                tooltipText: 'User Settings with panel',
                                current: visiblePanel === Panel.UserSettings,
                                onItemClick: () => {
                                    setVisiblePanel(
                                        visiblePanel === Panel.UserSettings
                                            ? undefined
                                            : Panel.UserSettings,
                                    );
                                },
                            }}
                            compact={compact}
                        />
                    </React.Fragment>
                )}
                renderContent={() => {
                    return (
                        <div className={b('content')}>
                            <pre>{placeholderText}</pre>
                            <RadioButton
                                value={headerDecoration}
                                onChange={(event) => {
                                    setHeaderDecoration(event.target.value);
                                }}
                            >
                                <Radio value={BOOLEAN_OPTIONS.No}>No</Radio>
                                <Radio value={BOOLEAN_OPTIONS.Yes}>Yes</Radio>
                            </RadioButton>
                        </div>
                    );
                }}
                panelItems={[
                    {
                        id: 'search',
                        content: <div className={b('search-panel')}>Search panel</div>,
                        visible: visiblePanel === Panel.Search,
                    },
                    {
                        id: 'project-settings',
                        content: <div className={b('settings-panel')}>Project Settings</div>,
                        visible: visiblePanel === Panel.ProjectSettings,
                    },
                    {
                        id: 'user-settings',
                        content: <div className={b('settings-panel')}>User Settings</div>,
                        visible: visiblePanel === Panel.UserSettings,
                    },
                    {
                        id: 'components',
                        content: <div className={b('components-panel')}>Components</div>,
                        visible: visiblePanel === Panel.Components,
                    },
                ]}
                onClosePanel={() => setVisiblePanel(undefined)}
                onChangeCompact={setCompact}
            />
        </div>
    );
}
