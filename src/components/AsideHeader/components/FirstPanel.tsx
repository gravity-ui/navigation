import React, {useCallback, useRef, useState} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import i18n from '../i18n';
import {getQuickAccessMenuItems} from '../quickAccess';
import {b} from '../utils';

import {useVisibleMenuItems} from './AllPagesPanel';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';
import type {QuickAccessToggleHandler} from './CompositeBar/Item/Item.types';
import {ScrollableWithScrollbar} from './CompositeBar/ScrollableWithScrollbar';
import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from './CompositeBar/constants';
import {Header} from './Header';
import {Panels} from './Panels';

const MENU_ITEMS_COMPOSITE_ID = 'gravity-ui/navigation-menu-items-composite-bar';
const QUICK_ACCESS_COMPOSITE_ID = 'gravity-ui/navigation-quick-access-composite-bar';
const FOCUSABLE_ITEM_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type PendingQuickAccessFocus = {
    itemId: string;
    nextItemId?: string;
    previousItemId?: string;
    trigger: HTMLButtonElement;
};

function findCompositeBar(root: HTMLElement, id: string) {
    return Array.from(root.querySelectorAll<HTMLElement>('[id]')).find(
        (element) => element.id === id,
    );
}

function findCompositeBarItemFocusTarget(root?: HTMLElement, itemId?: string) {
    if (!root) {
        return undefined;
    }

    const itemElements = Array.from(
        root.querySelectorAll<HTMLElement>(`[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}]`),
    );
    const itemElement = itemId
        ? itemElements.find(
              (element) => element.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE) === itemId,
          )
        : itemElements[0];

    if (!itemElement) {
        return undefined;
    }

    if (itemElement.matches(FOCUSABLE_ITEM_SELECTOR)) {
        return itemElement;
    }

    const wrappingFocusable = itemElement.closest<HTMLElement>(FOCUSABLE_ITEM_SELECTOR);

    if (wrappingFocusable && root.contains(wrappingFocusable)) {
        return wrappingFocusable;
    }

    return itemElement.querySelector<HTMLElement>(FOCUSABLE_ITEM_SELECTOR) ?? undefined;
}

export const FirstPanel = React.forwardRef<HTMLDivElement>((_props, ref) => {
    const {
        size,
        onItemClick,
        headerDecoration,
        menuMoreTitle,
        onMenuMoreClick,
        renderFooter,
        compact,
        customBackground,
        customBackgroundClassName,
        className,
        hideCollapseButton,
        menuGroups,
        menuGroupNestedIcons,
        menuOverflow,
        collapsedMenuGroupIds,
        defaultCollapsedMenuGroupIds,
        onToggleMenuGroupCollapsed,
        aboveMenuContent,
        enableQuickAccess = false,
        quickAccessHighlightInMainMenu = false,
        quickAccessIsAvailable,
        onToggleQuickAccess,
        unifiedMenuScroll = false,
        qa,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const quickAccessEnabled = enableQuickAccess;
    const quickAccessItems = React.useMemo(
        () => (quickAccessEnabled ? getQuickAccessMenuItems(visibleMenuItems, menuGroups) : []),
        [menuGroups, quickAccessEnabled, visibleMenuItems],
    );
    const suppressedCurrentItemIds = React.useMemo(
        () =>
            quickAccessEnabled && !quickAccessHighlightInMainMenu
                ? new Set(quickAccessItems.map((item) => item.id))
                : undefined,
        [quickAccessEnabled, quickAccessHighlightInMainMenu, quickAccessItems],
    );
    const hasQuickAccessItems = quickAccessItems.length > 0;
    const isUnifiedMenuScroll = unifiedMenuScroll && menuOverflow === 'scroll' && !compact;
    const [menuScrollOverflows, setMenuScrollOverflows] = useState(false);
    const asideRef = useRef<HTMLDivElement>(null);
    const pendingQuickAccessFocusRef = useRef<PendingQuickAccessFocus>();

    const handleMenuScrollOverflowChange = useCallback((overflows: boolean) => {
        setMenuScrollOverflows(overflows);
    }, []);

    React.useEffect(() => {
        if (menuOverflow !== 'scroll' || compact || !visibleMenuItems.length) {
            setMenuScrollOverflows(false);
        }
    }, [compact, menuOverflow, visibleMenuItems.length]);

    const handleQuickAccessToggle = React.useCallback<QuickAccessToggleHandler>(
        (item, event) => {
            if (
                item.quickAccess &&
                event?.detail === 0 &&
                event.currentTarget.ownerDocument.activeElement === event.currentTarget
            ) {
                const itemIndex = quickAccessItems.findIndex(
                    (quickAccessItem) => quickAccessItem.id === item.id,
                );

                pendingQuickAccessFocusRef.current = {
                    itemId: item.id,
                    nextItemId: quickAccessItems[itemIndex + 1]?.id,
                    previousItemId: quickAccessItems[itemIndex - 1]?.id,
                    trigger: event.currentTarget,
                };
            }

            onToggleQuickAccess(item);
        },
        [onToggleQuickAccess, quickAccessItems],
    );

    React.useEffect(() => {
        const pendingFocus = pendingQuickAccessFocusRef.current;

        if (
            !pendingFocus ||
            quickAccessItems.some((quickAccessItem) => quickAccessItem.id === pendingFocus.itemId)
        ) {
            return;
        }

        const ownerDocument = pendingFocus.trigger.ownerDocument;
        const asideRoot = asideRef.current?.parentElement;

        if (!asideRoot) {
            pendingQuickAccessFocusRef.current = undefined;
            return;
        }

        const quickAccessRoot = findCompositeBar(asideRoot, QUICK_ACCESS_COMPOSITE_ID);
        const menuRoot = findCompositeBar(asideRoot, MENU_ITEMS_COMPOSITE_ID);
        const remainingQuickAccessIds = new Set(quickAccessItems.map((item) => item.id));
        const adjacentQuickAccessItemId = [
            pendingFocus.nextItemId,
            pendingFocus.previousItemId,
        ].find((itemId) => itemId && remainingQuickAccessIds.has(itemId));
        const focusTarget =
            findCompositeBarItemFocusTarget(quickAccessRoot, adjacentQuickAccessItemId) ??
            findCompositeBarItemFocusTarget(menuRoot, pendingFocus.itemId) ??
            findCompositeBarItemFocusTarget(quickAccessRoot) ??
            findCompositeBarItemFocusTarget(menuRoot) ??
            asideRoot.querySelector<HTMLElement>(FOCUSABLE_ITEM_SELECTOR);
        const ownerWindow = ownerDocument.defaultView;

        if (!focusTarget || !ownerWindow) {
            pendingQuickAccessFocusRef.current = undefined;
            return;
        }

        // Finish the keyboard activation first: focus applied during the click can otherwise
        // be reset to body when the removed button completes its native activation lifecycle.
        ownerWindow.requestAnimationFrame(() => {
            if (pendingQuickAccessFocusRef.current !== pendingFocus) {
                return;
            }

            pendingQuickAccessFocusRef.current = undefined;
            const nextActiveElement = ownerDocument.activeElement;

            // Do not steal focus if the user moved it before an asynchronous controlled update.
            if (
                nextActiveElement === ownerDocument.body ||
                nextActiveElement === ownerDocument.documentElement
            ) {
                focusTarget.focus();
            }
        });
    }, [quickAccessItems]);

    const quickAccessCompositeBar = (
        <CompositeBar
            menuItemClassName={b('menu-item')}
            compositeId={QUICK_ACCESS_COMPOSITE_ID}
            type="quick-access"
            compact={compact}
            items={quickAccessItems}
            onItemClick={onItemClick}
            enableQuickAccessPin={quickAccessIsAvailable}
            onToggleQuickAccess={handleQuickAccessToggle}
        />
    );

    const menuCompositeBar = (
        <CompositeBar
            menuItemClassName={b('menu-item')}
            compositeId={MENU_ITEMS_COMPOSITE_ID}
            type="menu"
            compact={compact}
            items={visibleMenuItems}
            menuGroups={menuGroups}
            menuGroupNestedIcons={menuGroupNestedIcons}
            menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
            onItemClick={onItemClick}
            onMoreClick={onMenuMoreClick}
            menuOverflow={menuOverflow}
            collapsedMenuGroupIds={collapsedMenuGroupIds}
            defaultCollapsedMenuGroupIds={defaultCollapsedMenuGroupIds}
            onToggleMenuGroupCollapsed={onToggleMenuGroupCollapsed}
            enableQuickAccessPin={quickAccessIsAvailable}
            onToggleQuickAccess={onToggleQuickAccess}
            suppressCurrentItemIds={suppressedCurrentItemIds}
        />
    );

    const quickAccessSection = hasQuickAccessItems ? (
        <div
            className={b('quick-access', {
                scrollable: !isUnifiedMenuScroll,
                unified: isUnifiedMenuScroll,
            })}
        >
            {!compact && (
                <div className={b('quick-access-title')}>{i18n('quick_access_title')}</div>
            )}
            {isUnifiedMenuScroll ? (
                quickAccessCompositeBar
            ) : (
                <ScrollableWithScrollbar capped>{quickAccessCompositeBar}</ScrollableWithScrollbar>
            )}
        </div>
    ) : null;

    const menuSectionContent = visibleMenuItems.length ? (
        menuCompositeBar
    ) : (
        <div className={b('menu-items')} />
    );
    const menuSection =
        menuOverflow === 'scroll' && !compact && !isUnifiedMenuScroll ? (
            <ScrollableWithScrollbar onOverflowChange={handleMenuScrollOverflowChange}>
                {menuSectionContent}
            </ScrollableWithScrollbar>
        ) : (
            menuSectionContent
        );

    React.useEffect(() => {
        setRef<HTMLDivElement>(ref, asideRef.current);
    }, [ref]);

    return (
        <React.Fragment>
            <div
                className={b(
                    'aside',
                    {'menu-overflow-scroll': menuOverflow === 'scroll' && !compact},
                    className,
                )}
                style={{width: size}}
                data-qa={qa}
            >
                <div className={b('aside-popup-anchor')} ref={asideRef} />
                {customBackground && (
                    <div className={b('aside-custom-background', customBackgroundClassName)}>
                        {customBackground}
                    </div>
                )}

                <div
                    className={b('aside-content', {
                        'with-decoration': headerDecoration,
                        'with-quick-access': quickAccessEnabled,
                        'with-quick-access-items': quickAccessEnabled && hasQuickAccessItems,
                    })}
                >
                    <Header />
                    {aboveMenuContent}
                    {isUnifiedMenuScroll ? (
                        <ScrollableWithScrollbar
                            className={b('unified-menu-scroll')}
                            onOverflowChange={handleMenuScrollOverflowChange}
                        >
                            <div className={b('unified-menu-content')}>
                                {quickAccessSection}
                                {menuSection}
                            </div>
                        </ScrollableWithScrollbar>
                    ) : (
                        <React.Fragment>
                            {quickAccessSection}
                            {menuSection}
                        </React.Fragment>
                    )}
                    <div className={b('footer', {'with-divider': menuScrollOverflows})}>
                        {renderFooter?.({
                            size,
                            compact: Boolean(compact),
                            asideRef,
                        })}
                    </div>
                    {!hideCollapseButton && <CollapseButton />}
                </div>
            </div>
            <Panels />
        </React.Fragment>
    );
});

FirstPanel.displayName = 'FirstPanel';
