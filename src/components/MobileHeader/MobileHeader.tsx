import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useForwardRef} from '../../hooks/useForwardRef';
import {Content, RenderContentType} from '../Content';
import {Drawer, DrawerItem, DrawerItemProps} from '../Drawer/Drawer';
import {MobileLogo} from '../MobileLogo';
import {LogoProps} from '../types';
import {block} from '../utils/cn';

import {Burger} from './Burger/Burger';
import {BurgerMenu, BurgerMenuInnerProps} from './BurgerMenu/BurgerMenu';
import {
    BURGER_PANEL_ITEM_ID,
    MOBILE_HEADER_COMPACT_HEIGHT,
    MOBILE_HEADER_EVENT_NAMES,
    MOBILE_HEADER_EXPANDED_HEIGHT,
} from './constants';
import i18n from './i18n';
import {MobileHeaderEvent, MobileMenuItem} from './types';

import './MobileHeader.scss';

const b = block('mobile-header');

type PanelName = DrawerItemProps['id'] | null;

interface BurgerMenuProps extends Omit<BurgerMenuInnerProps, 'renderFooter'> {
    renderFooter?: (data: {size: number; isCompact: boolean}) => React.ReactNode;
}

interface PanelItem extends Omit<DrawerItemProps, 'visible'> {}

export interface MobileHeaderProps {
    logo: LogoProps;
    burgerMenu: BurgerMenuProps;
    burgerCloseTitle?: string;
    burgerOpenTitle?: string;
    panelItems?: PanelItem[];
    renderContent?: RenderContentType;
    sideItemRenderContent?: RenderContentType;
    onEvent?: (itemName: string, eventName: MobileHeaderEvent) => void;
    onClosePanel?: () => void;
    className?: string;
    contentClassName?: string;
}

export const MobileHeader = React.forwardRef<HTMLDivElement, MobileHeaderProps>(
    (
        {
            logo,
            burgerMenu,
            burgerCloseTitle = i18n('burger_button_close'),
            burgerOpenTitle = i18n('burger_button_open'),
            panelItems = [],
            renderContent,
            sideItemRenderContent,
            onClosePanel,
            onEvent,
            className,
            contentClassName,
        },
        ref,
    ): React.ReactElement => {
        const targetRef = useForwardRef<HTMLDivElement>(ref);
        const [compact] = useState(true);
        const [visiblePanel, setVisiblePanel] = useState<PanelName>(null);

        // for expand top panel cases (i.e. switch service panel). Will be removed if not used in future design
        const size = compact ? MOBILE_HEADER_COMPACT_HEIGHT : MOBILE_HEADER_EXPANDED_HEIGHT;

        const onPanelToggle = useCallback(
            (name: PanelName) => {
                if (!name) return;

                setVisiblePanel((prev) => {
                    const panelOpen = prev === name;

                    onEvent?.(
                        name,
                        panelOpen
                            ? MOBILE_HEADER_EVENT_NAMES.closeEvent
                            : MOBILE_HEADER_EVENT_NAMES.openEvent,
                    );

                    return panelOpen ? null : name;
                });
            },
            [onEvent],
        );

        const onMobilePanelToggle = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onPanelToggle(detail?.panelName);
                }
            },
            [onPanelToggle],
        );

        const onMobilePanelOpen = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.openEvent);
                    setVisiblePanel(detail?.panelName);
                }
            },
            [onEvent],
        );

        const onMobilePanelClose = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.closeEvent);
                    setVisiblePanel(null);
                }
            },
            [onEvent],
        );

        const onBurgerOpen = useCallback(() => {
            onEvent?.(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.openEvent);
            setVisiblePanel(BURGER_PANEL_ITEM_ID);
        }, [onEvent]);

        const onBurgerClose = useCallback(() => {
            onEvent?.(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.closeEvent);
            setVisiblePanel(null);
        }, [onEvent]);

        const onCloseDrawer = useCallback(() => {
            if (visiblePanel) {
                onEvent?.(visiblePanel, MOBILE_HEADER_EVENT_NAMES.closeEvent);
            }
            setVisiblePanel(null);
        }, [visiblePanel, onEvent]);

        const onBurgerMenuItemClick = useCallback(
            (item: MobileMenuItem) => {
                const closeMenuOnClick = item.closeMenuOnClick ?? true;

                if (closeMenuOnClick) {
                    onBurgerClose();
                }
            },
            [onBurgerClose],
        );

        const renderBurgerMenuFooter = useCallback(
            () =>
                burgerMenu.renderFooter?.({
                    size,
                    isCompact: compact,
                }),
            [burgerMenu, size, compact],
        );

        const onLogoClick = useCallback(
            (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                onClosePanel?.();
                logo.onClick?.(event);
            },
            [logo, onClosePanel],
        );

        const burgerPanelItem: PanelItem = useMemo(
            () => ({
                id: BURGER_PANEL_ITEM_ID,
                content: (
                    <BurgerMenu
                        items={burgerMenu.items}
                        modalItem={burgerMenu.modalItem}
                        renderFooter={renderBurgerMenuFooter}
                        onItemClick={onBurgerMenuItemClick}
                        className={b('burger-menu')}
                    />
                ),
            }),
            [burgerMenu.items, burgerMenu.modalItem, onBurgerMenuItemClick, renderBurgerMenuFooter],
        );

        useEffect(() => {
            const node = targetRef?.current;

            if (node) {
                node.addEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
                node.addEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);

                node.addEventListener('MOBILE_PANEL_TOGGLE', onMobilePanelToggle);
                node.addEventListener('MOBILE_PANEL_OPEN', onMobilePanelOpen);
                node.addEventListener('MOBILE_PANEL_CLOSE', onMobilePanelClose);
            }

            return () => {
                if (node) {
                    node.removeEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
                    node.removeEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);

                    node.removeEventListener('MOBILE_PANEL_TOGGLE', onMobilePanelToggle);
                    node.removeEventListener('MOBILE_PANEL_OPEN', onMobilePanelOpen);
                    node.removeEventListener('MOBILE_PANEL_CLOSE', onMobilePanelClose);
                }
            };
        }, [
            targetRef,
            onBurgerClose,
            onBurgerOpen,
            onMobilePanelToggle,
            onMobilePanelOpen,
            onMobilePanelClose,
        ]);

        return (
            <div className={b({compact}, className)} ref={targetRef}>
                <header className={b('header')} style={{height: size}}>
                    <Burger
                        opened={visiblePanel === burgerPanelItem.id}
                        onClick={() => onPanelToggle(BURGER_PANEL_ITEM_ID)}
                        className={b('burger')}
                        closeTitle={burgerCloseTitle}
                        openTitle={burgerOpenTitle}
                    />
                    <MobileLogo {...logo} compact={compact} onClick={onLogoClick} />

                    <div className={b('side-item')}>{sideItemRenderContent?.({size})}</div>
                </header>

                <Drawer
                    className={b('panels')}
                    onVeilClick={onCloseDrawer}
                    onEscape={onCloseDrawer}
                    style={{top: size}}
                >
                    {[burgerPanelItem, ...panelItems].map((item) => (
                        <DrawerItem
                            {...item}
                            key={item.id}
                            visible={visiblePanel === item.id}
                            className={b('panel-item', item.className)}
                        />
                    ))}
                </Drawer>

                <Content
                    size={size}
                    renderContent={renderContent}
                    className={b('content', contentClassName)}
                    cssSizeVariableName="--mobile-header-size"
                />
            </div>
        );
    },
);

MobileHeader.displayName = 'MobileHeader';
