import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Icon, MobileProvider, TextInput} from '@gravity-ui/uikit';

import {
    MobileHeader,
    MobileHeaderEventOptions,
    MobileHeaderFooterItem,
    MobileHeaderProps,
} from '../';
import {SettingsMobileComponent} from '../../Settings/__stories__/SettingsMobileDemo';
import {cn} from '../../utils/cn';

import {text as placeholderText} from './moc';

import logoIcon from '../../../../.storybook/assets/logo.svg';

import './MobileHeaderShowcase.scss';

const b = cn('mobile-header-demo');

function getCustomEvent(eventName: string, detail?: MobileHeaderEventOptions) {
    return new CustomEvent<MobileHeaderEventOptions>(eventName, {detail});
}

export function MobileHeaderShowcase() {
    const ref = React.useRef<HTMLDivElement>(null);

    const [searchModalVisible, setSearchModalVisible] = React.useState(false);
    const [favModalVisible, setFavModalVisible] = React.useState(false);
    const [fbModalVisible, setFbModalVisible] = React.useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);

    const toggleSearchModal = React.useCallback(() => setSearchModalVisible((prev) => !prev), []);
    const closeSearchModal = React.useCallback(() => setSearchModalVisible(false), []);

    const toggleSettingsModal = React.useCallback(
        () => setSettingsModalVisible((prev) => !prev),
        [],
    );
    const toggleFavModal = React.useCallback(() => setFavModalVisible((prev) => !prev), []);
    const toggleFbModal = React.useCallback(() => setFbModalVisible((prev) => !prev), []);

    const menuItems: MobileHeaderProps['burgerMenu']['items'] = [
        {
            id: 'all',
            title: 'All',
            icon: Gear,
            onItemClick(item) {
                alert(JSON.stringify(item));
            },
            itemWrapper(...[node, _item]) {
                return <div className={b('item-accent')}>{node}</div>;
            },
            current: true,
        },
        {
            id: 'search',
            title: 'Search modal',
            icon: Gear,
            closeMenuOnClick: false,
            onItemClick() {
                toggleSearchModal();
            },
        },
        {
            id: 'divider',
            title: '-',
            type: 'divider',
        },
        {
            id: 'id3',
            title: 'Favorite',
            icon: Gear,
            onItemClick(item) {
                alert(JSON.stringify(item));
            },
        },
        {
            id: 'id4',
            title: 'Item with wrapper',
            icon: Gear,
            itemWrapper(node, item) {
                return (
                    <a href={`https://ya.ru?a=${item.id}`} className={b('link')}>
                        {node}
                    </a>
                );
            },
        },
    ];

    const sideItem = (
        <div
            className={b('side-item')}
            onClick={() => {
                ref?.current?.dispatchEvent(
                    getCustomEvent('MOBILE_PANEL_TOGGLE', {panelName: 'settings'}),
                );
            }}
        >
            <Icon data={Gear} size={20} />
        </div>
    );

    return (
        <MobileProvider mobile={'ontouchstart' in document.documentElement}>
            <div className={b()}>
                <MobileHeader
                    ref={ref}
                    logo={{
                        href: '#',
                        icon: logoIcon,
                        iconSize: 32,
                        text: 'Gravity UI Service',
                        textSize: 17,
                        onClick: () => alert('Click on logo'),
                    }}
                    sideItemRenderContent={() => sideItem}
                    burgerMenu={{
                        items: menuItems,
                        modalItem: {
                            id: 'search',
                            title: 'Search',
                            visible: searchModalVisible,
                            contentClassName: b('modal-search'),
                            onClose: closeSearchModal,
                            renderContent: () => <TextInput />,
                        },
                        renderFooter: () => (
                            <React.Fragment>
                                <MobileHeaderFooterItem
                                    icon={Gear}
                                    modalItem={{
                                        visible: settingsModalVisible,
                                        title: 'Settings',
                                        onClose: () => setSettingsModalVisible(false),
                                        renderContent: () => {
                                            return <SettingsMobileComponent />;
                                        },
                                    }}
                                    onClick={toggleSettingsModal}
                                />
                                <MobileHeaderFooterItem
                                    icon={Gear}
                                    modalItem={{
                                        visible: favModalVisible,
                                        title: 'Favorites',
                                        onClose: () => setFavModalVisible(false),
                                        renderContent: () => {
                                            return (
                                                <div className={b('modal-footer')}>
                                                    Form content here
                                                </div>
                                            );
                                        },
                                    }}
                                    onClick={toggleFavModal}
                                />
                                <MobileHeaderFooterItem
                                    icon={Gear}
                                    modalItem={{
                                        visible: fbModalVisible,
                                        title: 'Feedback',
                                        onClose: () => setFbModalVisible(false),
                                        renderContent: () => {
                                            return (
                                                <div className={b('modal-footer')}>
                                                    Form content here
                                                </div>
                                            );
                                        },
                                    }}
                                    onClick={toggleFbModal}
                                />
                            </React.Fragment>
                        ),
                    }}
                    panelItems={[
                        {
                            id: 'settings',
                            content: <div className={b('modal-footer')}>Form content here</div>,
                            direction: 'right',
                        },
                    ]}
                    renderContent={() => {
                        return (
                            <div className={b('content')}>
                                <pre>{placeholderText}</pre>

                                <Button
                                    className={b('button')}
                                    onClick={() => {
                                        ref?.current?.dispatchEvent(
                                            getCustomEvent('MOBILE_PANEL_OPEN', {
                                                panelName: 'settings',
                                            }),
                                        );
                                    }}
                                >
                                    Trigger event: open Settings Panel
                                </Button>

                                <Button
                                    className={b('button')}
                                    onClick={() => {
                                        ref?.current?.dispatchEvent(
                                            getCustomEvent('MOBILE_BURGER_OPEN'),
                                        );
                                        toggleSearchModal();
                                    }}
                                >
                                    Trigger event: open Modal Search
                                </Button>
                            </div>
                        );
                    }}
                    onEvent={(itemName, eventName) => {
                        console.log(`[MobileHeader] onEvent ${itemName}, eventName ${eventName}`);
                    }}
                />
            </div>
        </MobileProvider>
    );
}
