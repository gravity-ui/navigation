import React, {Suspense, useCallback, useEffect, useMemo, useState} from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {useForwardRef} from '../../hooks/useForwardRef';
import {Content, RenderContentType} from '../Content';
import {MobileLogo} from '../MobileLogo';
import {LogoProps, TopAlertProps} from '../types';
import {createBlock} from '../utils/cn';

import {Burger} from './Burger/Burger';
import {BurgerMenu, BurgerMenuInnerProps} from './BurgerMenu/BurgerMenu';
import {
    OverlapPanelProps as CommonOverlapPanelProps,
    OverlapPanel,
} from './OverlapPanel/OverlapPanel';
import {
    BURGER_PANEL_ITEM_ID,
    MOBILE_HEADER_COMPACT_HEIGHT,
    MOBILE_HEADER_EVENT_NAMES,
    MOBILE_HEADER_EXPANDED_HEIGHT,
    OVERLAP_PANEL_ITEM_ID,
} from './constants';
import i18n from './i18n';
import {MobileHeaderEvent, MobileHeaderEventOptions, MobileMenuItem} from './types';

import styles from './MobileHeader.module.scss';

const TopAlert = React.lazy(() =>
    import('../TopAlert').then((module) => ({default: module.TopAlert})),
);

const b = createBlock('mobile-header', styles);

type PanelName = string | null;

interface BurgerMenuProps extends Omit<BurgerMenuInnerProps, 'renderFooter'> {
    renderFooter?: (data: {size: number; isExpanded: boolean}) => React.ReactNode;
}

type OverlapPanelProps = Omit<CommonOverlapPanelProps, 'onClose' | 'visible'>;

interface PanelItem {
    id: string;
    content?: React.ReactNode;
    className?: string;
}

export interface MobileHeaderProps {
    logo: LogoProps;
    burgerMenu: BurgerMenuProps;
    overlapPanel?: OverlapPanelProps;
    burgerCloseTitle?: string;
    burgerOpenTitle?: string;
    panelItems?: PanelItem[];
    topAlert?: TopAlertProps;
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
            overlapPanel,
            topAlert,
        },
        ref,
    ): React.ReactElement => {
        const targetRef = useForwardRef<HTMLDivElement>(ref);
        const [pinned] = useState(false);
        const [visiblePanel, setVisiblePanel] = useState<PanelName>(null);
        const [overlapPanelVisible, setOverlapPanelVisible] = useState(false);

        // for expand top panel cases (i.e. switch service panel). Will be removed if not used in future design
        const size = pinned ? MOBILE_HEADER_EXPANDED_HEIGHT : MOBILE_HEADER_COMPACT_HEIGHT;

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

                setOverlapPanelVisible(false);
            },
            [onEvent],
        );

        const onMobilePanelToggle = useCallback(
            ({detail}: {detail: MobileHeaderEventOptions}) => {
                if (typeof detail?.panelName === 'string') {
                    onPanelToggle(detail?.panelName);
                }
            },
            [onPanelToggle],
        );

        const onMobilePanelOpen = useCallback(
            ({detail}: {detail: MobileHeaderEventOptions}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.openEvent);
                    setVisiblePanel(detail?.panelName);
                    setOverlapPanelVisible(false);
                }
            },
            [onEvent],
        );

        const onMobilePanelClose = useCallback(
            ({detail}: {detail: MobileHeaderEventOptions}) => {
                if (typeof detail?.panelName === 'string') {
                    onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.closeEvent);
                    setVisiblePanel(null);
                    setOverlapPanelVisible(false);
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

        const onOverlapOpen = useCallback(() => {
            onEvent?.(OVERLAP_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.openEvent);
            setOverlapPanelVisible(true);
        }, [onEvent]);

        const onOverlapClose = useCallback(() => {
            onEvent?.(OVERLAP_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.closeEvent);
            setOverlapPanelVisible(false);
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
                    isExpanded: pinned,
                }),
            [burgerMenu, size, pinned],
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
                className: burgerMenu.className,
            }),
            [
                burgerMenu.items,
                burgerMenu.modalItem,
                burgerMenu.className,
                onBurgerMenuItemClick,
                renderBurgerMenuFooter,
            ],
        );

        useEffect(() => {
            const node = targetRef?.current;

            if (node) {
                node.addEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
                node.addEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);

                node.addEventListener('MOBILE_OVERLAP_PANEL_OPEN', onOverlapOpen);
                node.addEventListener('MOBILE_OVERLAP_PANEL_CLOSE', onOverlapClose);

                node.addEventListener(
                    'MOBILE_PANEL_TOGGLE',
                    onMobilePanelToggle as unknown as EventListener,
                );
                node.addEventListener(
                    'MOBILE_PANEL_OPEN',
                    onMobilePanelOpen as unknown as EventListener,
                );
                node.addEventListener(
                    'MOBILE_PANEL_CLOSE',
                    onMobilePanelClose as unknown as EventListener,
                );
            }

            return () => {
                if (node) {
                    node.removeEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
                    node.removeEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);

                    node.removeEventListener('MOBILE_OVERLAP_PANEL_OPEN', onOverlapOpen);
                    node.removeEventListener('MOBILE_OVERLAP_PANEL_CLOSE', onOverlapClose);

                    node.removeEventListener(
                        'MOBILE_PANEL_TOGGLE',
                        onMobilePanelToggle as unknown as EventListener,
                    );
                    node.removeEventListener(
                        'MOBILE_PANEL_OPEN',
                        onMobilePanelOpen as unknown as EventListener,
                    );
                    node.removeEventListener(
                        'MOBILE_PANEL_CLOSE',
                        onMobilePanelClose as unknown as EventListener,
                    );
                }
            };
        }, [
            targetRef,
            onBurgerClose,
            onBurgerOpen,
            onMobilePanelToggle,
            onMobilePanelOpen,
            onMobilePanelClose,
            onOverlapOpen,
            onOverlapClose,
        ]);

        const allPanelItems = [burgerPanelItem, ...panelItems];

        return (
            <div className={b(null, className)} ref={targetRef}>
                <div className={b('header-container')}>
                    {topAlert && (
                        <Suspense fallback={null}>
                            <TopAlert alert={topAlert} mobileView />
                        </Suspense>
                    )}
                    <header className={b('header')} style={{height: size}}>
                        <Burger
                            opened={visiblePanel === burgerPanelItem.id}
                            onClick={() => onPanelToggle(BURGER_PANEL_ITEM_ID)}
                            className={b('burger')}
                            closeTitle={burgerCloseTitle}
                            openTitle={burgerOpenTitle}
                        />
                        <MobileLogo {...logo} isExpanded={pinned} onClick={onLogoClick} />

                        <div className={b('side-item')}>{sideItemRenderContent?.({size})}</div>
                    </header>
                </div>

                {allPanelItems.map((item) => (
                    <Drawer
                        key={item.id}
                        className={b('panels')}
                        open={visiblePanel === item.id}
                        onOpenChange={(open) => !open && onCloseDrawer()}
                        style={{top: `calc(${size}px + var(--gn-top-alert-height, 0px))`}}
                        contentClassName={b('panel-item', item.className)}
                        size={320}
                        disablePortal
                    >
                        {item.content}
                    </Drawer>
                ))}
                {overlapPanel && (
                    <OverlapPanel
                        topOffset={size}
                        className={b('overlap-panel')}
                        title={overlapPanel.title}
                        onClose={onOverlapClose}
                        action={overlapPanel.action}
                        visible={overlapPanelVisible}
                        renderContent={overlapPanel.renderContent}
                    />
                )}
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
