import React from 'react';

import {Bug, Gear, Magnifier} from '@gravity-ui/icons';
import {
    Button,
    EventBrokerData,
    Icon,
    Modal,
    Popup,
    SegmentedRadioGroup,
    eventBroker,
} from '@gravity-ui/uikit';

import {AsideHeader, AsideHeaderProps, FooterItem} from '../..';
import {ASIDE_HEADER_ICON_SIZE} from '../../constants';
import {OpenModalSubscriber, TopAlertProps} from '../../types';
import {cn} from '../../utils/cn';

import {menuItemsShowcase, text as placeholderText} from './moc';

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

export interface AsideHeaderShowcaseProps {
    initialPinned?: boolean;
    topAlert?: TopAlertProps;
    customBackground?: React.ReactNode;
    customBackgroundClassName?: string;
    headerDecoration?: boolean;
    hideCollapseButton?: boolean;
    isCompactMode?: boolean;
    externalMenuItems?: AsideHeaderProps['menuItems'];
    externalMenuGroups?: AsideHeaderProps['menuGroups'];
}

export const AsideHeaderShowcase: React.FC<React.PropsWithChildren<AsideHeaderShowcaseProps>> = ({
    initialPinned = true,
    topAlert,
    customBackground,
    customBackgroundClassName,
    headerDecoration,
    hideCollapseButton,
    isCompactMode,
    externalMenuItems,
    externalMenuGroups,
    children,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [subheaderPopupVisible, setSubheaderPopupVisible] = React.useState(false);
    const [openPanel, setOpenPanel] = React.useState<Panel>();
    const [pinned, setPinned] = React.useState(initialPinned);
    const [addonHeaderDecoration, setHeaderDecoration] = React.useState<string>(
        BOOLEAN_OPTIONS.Yes,
    );
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [currentMenuGroups, setCurrentMenuGroups] = React.useState(externalMenuGroups);

    const openModalSubscriber = (callback: OpenModalSubscriber) => {
        // @ts-ignore
        eventBroker.subscribe((data: EventBrokerData<{layers: {type: string}[]}>) => {
            if (data?.eventId === 'layerschange') {
                const openModalCount = data?.meta?.layers?.filter(
                    ({type}) => type === 'modal',
                ).length;
                callback(openModalCount !== 0);
            }
        });
    };

    const [menuItems, setMenuItems] = React.useState<AsideHeaderProps['menuItems']>(
        externalMenuItems || menuItemsShowcase,
    );

    return (
        <div className={b()}>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={b('content')}>
                    <pre>{placeholderText}</pre>
                </div>
            </Modal>
            <AsideHeader
                ref={ref}
                qa={'ah-aside'}
                logo={{
                    text: 'Service',
                    icon: logoIcon,
                    href: '#',
                    onClick: () => alert('click on logo'),
                    'aria-label': 'Service',
                }}
                headerDecoration={
                    headerDecoration === undefined
                        ? addonHeaderDecoration === BOOLEAN_OPTIONS.No
                        : headerDecoration
                }
                onMenuItemsChanged={setMenuItems}
                menuItems={menuItems}
                menuGroups={currentMenuGroups}
                onMenuGroupsChanged={setCurrentMenuGroups}
                defaultMenuItems={menuItemsShowcase}
                customBackground={customBackground}
                customBackgroundClassName={customBackgroundClassName}
                subheaderItems={[
                    {
                        id: 'services',
                        title: 'Services',
                        icon: Gear,
                        onItemClick: () => {
                            setOpenPanel(undefined);
                            setSubheaderPopupVisible(!subheaderPopupVisible);
                        },
                        popupRef: ref,
                        popupPlacement: ['right-start'],
                        popupOffset: {mainAxis: 10, crossAxis: 10},
                        popupVisible: subheaderPopupVisible,
                        onOpenChangePopup: () => setSubheaderPopupVisible(false),
                        renderPopupContent: () => {
                            return (
                                <div className={b('settings')}>
                                    <ul className={b('settings-ul')}>
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
                        id: 'search',
                        title: 'Search',
                        qa: 'subheader-item-search',
                        icon: Magnifier,
                        current: openPanel === Panel.Search,
                        onItemClick: () =>
                            setOpenPanel(openPanel === Panel.Search ? undefined : Panel.Search),
                    },
                ]}
                pinned={pinned}
                hideCollapseButton={hideCollapseButton}
                isCompactMode={isCompactMode}
                openModalSubscriber={openModalSubscriber}
                topAlert={topAlert}
                renderFooter={({asideRef}) => (
                    <React.Fragment>
                        <FooterItem
                            id={'infra'}
                            icon={Gear}
                            current={popupVisible}
                            qa={'footer-item-gear'}
                            iconQa={'footer-item-icon-gear'}
                            title={
                                <div className={b('infra-text')}>
                                    <span className={b('infra-label')}>Minor issue</span>
                                    <span className={b('infra-period')}>Now</span>
                                </div>
                            }
                            tooltipText={'Minor issue (Now)'}
                            onItemClick={() => {
                                setOpenPanel(undefined);
                                setPopupVisible(!popupVisible);
                            }}
                            enableTooltip={false}
                            itemWrapper={(params, makeItem) => (
                                <React.Fragment>
                                    {makeItem(params)}
                                    <Popup
                                        strategy="fixed"
                                        open={popupVisible}
                                        keepMounted={true}
                                        placement={['right-end']}
                                        offset={{mainAxis: 10, crossAxis: 10}}
                                        anchorElement={asideRef.current}
                                        onOpenChange={(open) => {
                                            if (!open) setPopupVisible(false);
                                        }}
                                    >
                                        <div className={b('settings')}>
                                            <ul className={b('settings-ul')}>
                                                <li>Set 1</li>
                                                <li>Set 2</li>
                                                <li>Set 3</li>
                                                <li>Set 4</li>
                                            </ul>
                                        </div>
                                    </Popup>
                                </React.Fragment>
                            )}
                        />
                        <FooterItem
                            id={'project-settings'}
                            title={'Settings with panel'}
                            tooltipText={
                                <div>
                                    <b>Settings with panel</b>
                                </div>
                            }
                            current={openPanel === Panel.ProjectSettings}
                            itemWrapper={(params, makeItem) =>
                                makeItem({
                                    ...params,
                                    icon: <Icon data={Bug} size={ASIDE_HEADER_ICON_SIZE} />,
                                })
                            }
                            onItemClick={() => {
                                setOpenPanel(
                                    openPanel === Panel.ProjectSettings
                                        ? undefined
                                        : Panel.ProjectSettings,
                                );
                            }}
                            bringForward
                        />
                        <FooterItem
                            id={'user-settings'}
                            icon={Gear}
                            title={'User Settings with panel'}
                            tooltipText={'User Settings with panel'}
                            current={openPanel === Panel.UserSettings}
                            onItemClick={() => {
                                setOpenPanel(
                                    openPanel === Panel.UserSettings
                                        ? undefined
                                        : Panel.UserSettings,
                                );
                            }}
                        />
                    </React.Fragment>
                )}
                renderContent={() => {
                    return (
                        children || (
                            <div className={b('content')}>
                                <pre>{placeholderText}</pre>
                                <SegmentedRadioGroup
                                    value={addonHeaderDecoration}
                                    onChange={(event) => {
                                        setHeaderDecoration(event.target.value);
                                    }}
                                >
                                    <SegmentedRadioGroup.Option value={BOOLEAN_OPTIONS.No}>
                                        No
                                    </SegmentedRadioGroup.Option>
                                    <SegmentedRadioGroup.Option value={BOOLEAN_OPTIONS.Yes}>
                                        Yes
                                    </SegmentedRadioGroup.Option>
                                </SegmentedRadioGroup>
                                <br />
                                <br />
                                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                            </div>
                        )
                    );
                }}
                panelItems={[
                    {
                        id: 'search',
                        children: <div className={b('search-panel')}>Search panel</div>,
                        open: openPanel === Panel.Search,
                    },
                    {
                        id: 'project-settings',
                        children: <div className={b('settings-panel')}>Project Settings</div>,
                        open: openPanel === Panel.ProjectSettings,
                    },
                    {
                        id: 'user-settings',
                        children: (
                            <div className={b('settings-panel')}>
                                <div className={b('user-settings-content')}>User Settings</div>
                            </div>
                        ),
                        open: openPanel === Panel.UserSettings,
                    },
                    {
                        id: 'components',
                        children: <div className={b('components-panel')}>Components</div>,
                        open: openPanel === Panel.Components,
                    },
                ]}
                onClosePanel={() => setOpenPanel(undefined)}
                onChangePinned={(v) => {
                    setPinned(v);
                }}
                onMenuMoreClick={() => console.log('onMenuMoreClick')}
                onAllPagesClick={() => console.log('onAllPagesClick')}
                editMenuProps={{
                    enableSorting: true,
                }}
            />
        </div>
    );
};
