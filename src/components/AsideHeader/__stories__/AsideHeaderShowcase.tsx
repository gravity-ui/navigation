import React from 'react';

import {Bug, Gear, Magnifier} from '@gravity-ui/icons';
import {
    Button,
    EventBrokerData,
    Icon,
    Modal,
    Radio,
    SegmentedRadioGroup,
    eventBroker,
} from '@gravity-ui/uikit';

import {AsideHeader, AsideHeaderProps, FooterItem, TopAlertProps} from '../..';
import {ASIDE_HEADER_ICON_SIZE} from '../../constants';
import {OpenModalSubscriber} from '../../types';
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

interface AsideHeaderShowcaseProps {
    multipleTooltip?: boolean;
    initialCompact?: boolean;
    topAlert?: TopAlertProps;
    customBackground?: React.ReactNode;
    customBackgroundClassName?: string;
    headerDecoration?: boolean;
    hideCollapseButton?: boolean;
}

export const AsideHeaderShowcase: React.FC<AsideHeaderShowcaseProps> = ({
    multipleTooltip = false,
    initialCompact = false,
    topAlert,
    customBackground,
    customBackgroundClassName,
    headerDecoration,
    hideCollapseButton,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [subheaderPopupVisible, setSubheaderPopupVisible] = React.useState(false);
    const [visiblePanel, setVisiblePanel] = React.useState<Panel>();
    const [compact, setCompact] = React.useState(initialCompact);
    const [addonHeaderDecoration, setHeaderDecoration] = React.useState<string>(
        BOOLEAN_OPTIONS.Yes,
    );
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

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

    const [menuItems, setMenuItems] =
        React.useState<AsideHeaderProps['menuItems']>(menuItemsShowcase);

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
                defaultMenuItems={menuItemsShowcase}
                customBackground={customBackground}
                customBackgroundClassName={customBackgroundClassName}
                subheaderItems={[
                    {
                        id: 'services',
                        title: 'Services',
                        icon: Gear,
                        onItemClick: () => {
                            setVisiblePanel(undefined);
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
                        current: visiblePanel === Panel.Search,
                        onItemClick: () =>
                            setVisiblePanel(
                                visiblePanel === Panel.Search ? undefined : Panel.Search,
                            ),
                    },
                ]}
                compact={compact}
                hideCollapseButton={hideCollapseButton}
                multipleTooltip={multipleTooltip}
                openModalSubscriber={openModalSubscriber}
                topAlert={topAlert}
                renderFooter={({compact, asideRef}) => (
                    <React.Fragment>
                        <FooterItem
                            compact={compact}
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
                                setVisiblePanel(undefined);
                                setPopupVisible(!popupVisible);
                            }}
                            enableTooltip={false}
                            popupVisible={popupVisible}
                            popupRef={asideRef}
                            popupPlacement={['right-end']}
                            popupOffset={{mainAxis: 10, crossAxis: 10}}
                            onOpenChangePopup={() => setPopupVisible(false)}
                            popupKeepMounted={true}
                            renderPopupContent={() => {
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
                            }}
                        />
                        <FooterItem
                            id={'project-settings'}
                            title={'Settings with panel'}
                            tooltipText={
                                <div>
                                    <b>Settings with panel</b>
                                </div>
                            }
                            current={visiblePanel === Panel.ProjectSettings}
                            itemWrapper={(params, makeItem) =>
                                makeItem({
                                    ...params,
                                    icon: <Icon data={Bug} size={ASIDE_HEADER_ICON_SIZE} />,
                                })
                            }
                            onItemClick={() => {
                                setVisiblePanel(
                                    visiblePanel === Panel.ProjectSettings
                                        ? undefined
                                        : Panel.ProjectSettings,
                                );
                            }}
                            bringForward
                            compact={compact}
                        />
                        <FooterItem
                            id={'user-settings'}
                            icon={Gear}
                            title={'User Settings with panel'}
                            tooltipText={'User Settings with panel'}
                            current={visiblePanel === Panel.UserSettings}
                            onItemClick={() => {
                                setVisiblePanel(
                                    visiblePanel === Panel.UserSettings
                                        ? undefined
                                        : Panel.UserSettings,
                                );
                            }}
                            compact={compact}
                        />
                    </React.Fragment>
                )}
                renderContent={() => {
                    return (
                        <div className={b('content')}>
                            <pre>{placeholderText}</pre>
                            <SegmentedRadioGroup
                                value={addonHeaderDecoration}
                                onChange={(event) => {
                                    setHeaderDecoration(event.target.value);
                                }}
                            >
                                <Radio value={BOOLEAN_OPTIONS.No}>No</Radio>
                                <Radio value={BOOLEAN_OPTIONS.Yes}>Yes</Radio>
                            </SegmentedRadioGroup>
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
                        content: (
                            <div className={b('settings-panel')}>
                                <div className={b('user-settings-content')}>User Settings</div>
                            </div>
                        ),
                        visible: visiblePanel === Panel.UserSettings,
                    },
                    {
                        id: 'components',
                        content: <div className={b('components-panel')}>Components</div>,
                        visible: visiblePanel === Panel.Components,
                    },
                ]}
                onClosePanel={() => setVisiblePanel(undefined)}
                onChangeCompact={(v) => {
                    setCompact(v);
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
