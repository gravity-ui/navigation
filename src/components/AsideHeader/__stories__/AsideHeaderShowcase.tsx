import React, {FC} from 'react';

import {RadioButton, Radio, Modal, Button, eventBroker, EventBrokerData} from '@gravity-ui/uikit';
import {Gear, Magnifier} from '@gravity-ui/icons';

import {AsideHeader, FooterItem} from '../..';
import {cn} from '../../utils/cn';
import {menuItemsShowcase, text as placeholderText} from './moc';
import {OpenModalSubscriber} from 'src/components/CompositeBar/HighlightedItem/HighlightedItem';

import logoIcon from '../../../../.storybook/assets/logo.svg';

import './AsideHeaderShowcase.scss';

const b = cn('aside-header-showcase');

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

interface AsideHeaderShowcaseProps {
    multipleTooltip?: boolean;
    initialCompact?: boolean;
}

export const AsideHeaderShowcase: FC<AsideHeaderShowcaseProps> = ({
    multipleTooltip = false,
    initialCompact = false,
}) => {
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [subheaderPopupVisible, setSubheaderPopupVisible] = React.useState(false);
    const [visiblePanel, setVisiblePanel] = React.useState<Panel>();
    const [compact, setCompact] = React.useState(initialCompact);
    const [headerDecoration, setHeaderDecoration] = React.useState<string>(BOOLEAN_OPTIONS.Yes);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const navRef = React.useRef<AsideHeader>(null);

    const openModalSubscriber = (callback: OpenModalSubscriber) => {
        // @ts-ignore
        eventBroker.subscribe((data: EventBrokerData<{layersCount: number}>) => {
            if (data?.eventId === 'layerschange') {
                callback(data?.meta?.layersCount !== 0 && isModalOpen);
            }
        });
    };

    return (
        <div className={b()}>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={b('content')}>
                    <pre>{placeholderText}</pre>
                </div>
            </Modal>
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
                        icon: Gear,
                        current: visiblePanel === Panel.Components,
                        onItemClick: () =>
                            setVisiblePanel(
                                visiblePanel === Panel.Components ? undefined : Panel.Components,
                            ),
                    },
                ]}
                subheaderItems={[
                    {
                        item: {
                            id: 'services',
                            title: 'Services',
                            icon: Gear,
                            onItemClick: () => {
                                setVisiblePanel(undefined);
                                setSubheaderPopupVisible(!subheaderPopupVisible);
                            },
                        },
                        popupVisible: subheaderPopupVisible,
                        onClosePopup: () => setSubheaderPopupVisible(false),
                        renderPopupContent: () => {
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
                        },
                    },
                    {
                        item: {
                            id: 'search',
                            title: 'Search',
                            icon: Magnifier,
                            current: visiblePanel === Panel.Search,
                            onItemClick: () =>
                                setVisiblePanel(
                                    visiblePanel === Panel.Search ? undefined : Panel.Search,
                                ),
                        },
                    },
                ]}
                compact={compact}
                multipleTooltip={multipleTooltip}
                renderFooter={({compact}) => (
                    <React.Fragment>
                        <FooterItem
                            compact={compact}
                            item={{
                                id: 'infra',
                                icon: Gear,
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
                            enableTooltip={false}
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
                                icon: Gear,
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
                            bringForward
                            openModalSubscriber={openModalSubscriber}
                            compact={compact}
                        />
                        <FooterItem
                            item={{
                                id: 'user-settings',
                                icon: Gear,
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
                            <br />
                            <br />
                            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
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
};
