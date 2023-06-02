import React, {useCallback, useState, useMemo, useEffect} from 'react';

import {block} from '../utils/cn';
import {LogoProps} from '../types';
import {MobileMenuItem, MobileHeaderEvent} from './types';
import {useForwardRef} from '../../hooks/useForwardRef';
import {Drawer, DrawerItem, DrawerItemProps} from '../Drawer/Drawer';
import {Content, RenderContentType} from '../Content';
import {Burger} from './Burger/Burger';
import {Logo} from './Logo/Logo';
import {BurgerMenu, BurgerMenuInnerProps} from './BurgerMenu/BurgerMenu';
import {
    MOBILE_HEADER_COMPACT_HEIGHT,
    MOBILE_HEADER_EXPANDED_HEIGHT,
    EVENT_NAMES,
    BURGER_PANEL_ITEM_ID,
} from './constants';

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
    panelItems?: PanelItem[];
    renderContent?: RenderContentType;
    sideItemRenderContent?: RenderContentType;
    onEvent?: (itemName: string, eventName: MobileHeaderEvent) => void;
    onClosePanel?: () => void;
    className?: string;
}

export const MobileHeader = React.forwardRef<HTMLDivElement, MobileHeaderProps>(
    (
        {
            logo,
            burgerMenu,
            panelItems = [],
            renderContent,
            sideItemRenderContent,
            onClosePanel,
            onEvent,
            className,
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

                    onEvent?.(name, panelOpen ? EVENT_NAMES.closeEvent : EVENT_NAMES.openEvent);

                    return panelOpen ? null : name;
                });
            },
            [visiblePanel, onEvent],
        );

        const onMobilePanelToggle = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onPanelToggle(detail?.panelName);
                }
            },
            [onEvent],
        );

        const onMobilePanelOpen = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, EVENT_NAMES.openEvent);
                    setVisiblePanel(detail?.panelName);
                }
            },
            [onEvent],
        );

        const onMobilePanelClose = useCallback(
            ({detail}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, EVENT_NAMES.closeEvent);
                    setVisiblePanel(null);
                }
            },
            [onEvent],
        );

        const onBurgerOpen = useCallback(() => {
            onEvent?.(BURGER_PANEL_ITEM_ID, EVENT_NAMES.openEvent);
            setVisiblePanel(BURGER_PANEL_ITEM_ID);
        }, [onEvent]);

        const onBurgerClose = useCallback(() => {
            onEvent?.(BURGER_PANEL_ITEM_ID, EVENT_NAMES.closeEvent);
            setVisiblePanel(null);
        }, [onEvent]);

        const onCloseDrawer = useCallback(() => {
            if (visiblePanel) {
                onEvent?.(visiblePanel, EVENT_NAMES.closeEvent);
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
            [burgerMenu.renderFooter, size, compact],
        );

        const onLogoClick = useCallback(
            (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                onClosePanel?.();
                logo.onClick?.(event);
            },
            [logo.onClick, onClosePanel],
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
            [burgerMenu],
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
        }, [targetRef, onBurgerClose, onBurgerOpen]);

        return (
            <div className={b({compact}, className)} ref={targetRef}>
                <header className={b('header')} style={{height: size}}>
                    <Burger
                        opened={visiblePanel === burgerPanelItem.id}
                        onClick={() => onPanelToggle(BURGER_PANEL_ITEM_ID)}
                        className={b('burger')}
                    />
                    <Logo {...logo} compact={compact} onClick={onLogoClick} />

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
                    className={b('content')}
                    cssSizeVariableName="--mobile-header-size"
                />
            </div>
        );
    },
);

MobileHeader.displayName = 'MobileHeader';
