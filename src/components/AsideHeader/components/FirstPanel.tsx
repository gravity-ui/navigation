import React, {useCallback, useRef, useState} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import i18n from '../i18n';
import {b} from '../utils';

import {useVisibleMenuItems} from './AllPagesPanel';
import {useMainMenuItems} from './AllPagesPanel/useMainMenuItems';
import {useQuickAccessMenuItems} from './AllPagesPanel/useQuickAccessMenuItems';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';
import {ScrollableWithScrollbar} from './CompositeBar/ScrollableWithScrollbar';
import {Header} from './Header';
import {Panels} from './Panels';

const MENU_ITEMS_COMPOSITE_ID = 'gravity-ui/navigation-menu-items-composite-bar';
const QUICK_ACCESS_COMPOSITE_ID = 'gravity-ui/navigation-quick-access-composite-bar';

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
        menuOverflow,
        collapsedMenuGroupIds,
        defaultCollapsedMenuGroupIds,
        onToggleMenuGroupCollapsed,
        qa,
        quickAccessIsAvailable,
        onToggleQuickAccess,
        enableQuickAccess,
        showQuickAccessSection = true,
        menuGroupNestedIcons,
        unifiedMenuScroll = false,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const quickAccessItems = useQuickAccessMenuItems();
    const mainMenuItems = useMainMenuItems();
    const hasQuickAccessItems = quickAccessItems.length > 0;
    const isUnifiedMenuScroll = unifiedMenuScroll && menuOverflow === 'scroll' && !compact;
    const [menuScrollOverflows, setMenuScrollOverflows] = useState(false);
    const [unifiedScrollContentVersion, setUnifiedScrollContentVersion] = useState(0);

    const handleMenuScrollOverflowChange = useCallback((overflows: boolean) => {
        setMenuScrollOverflows(overflows);
    }, []);

    const handleUnifiedScrollContentChange = useCallback(() => {
        setUnifiedScrollContentVersion((version) => version + 1);
    }, []);

    React.useEffect(() => {
        if (menuOverflow !== 'scroll' || compact || !visibleMenuItems?.length) {
            setMenuScrollOverflows(false);
        }
    }, [menuOverflow, compact, visibleMenuItems?.length, isUnifiedMenuScroll]);

    const quickAccessCompositeBar = (
        <CompositeBar
            menuItemClassName={b('menu-item')}
            compositeId={QUICK_ACCESS_COMPOSITE_ID}
            type="quick-access"
            compact={compact}
            items={quickAccessItems}
            onItemClick={onItemClick}
            enableQuickAccessPin={quickAccessIsAvailable}
            onToggleQuickAccess={onToggleQuickAccess}
        />
    );

    const menuCompositeBar = (
        <CompositeBar
            menuItemClassName={b('menu-item')}
            compositeId={MENU_ITEMS_COMPOSITE_ID}
            type="menu"
            compact={compact}
            items={mainMenuItems}
            menuGroups={menuGroups}
            menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
            onItemClick={onItemClick}
            onMoreClick={onMenuMoreClick}
            menuOverflow={menuOverflow}
            collapsedMenuGroupIds={collapsedMenuGroupIds}
            defaultCollapsedMenuGroupIds={defaultCollapsedMenuGroupIds}
            onToggleMenuGroupCollapsed={onToggleMenuGroupCollapsed}
            disableScrollWrapper={isUnifiedMenuScroll}
            onScrollContentChange={
                isUnifiedMenuScroll ? handleUnifiedScrollContentChange : undefined
            }
            onMenuScrollOverflowChange={
                menuOverflow === 'scroll' && !compact && !isUnifiedMenuScroll
                    ? handleMenuScrollOverflowChange
                    : undefined
            }
            enableQuickAccessPin={quickAccessIsAvailable}
            onToggleQuickAccess={onToggleQuickAccess}
            menuGroupNestedIcons={menuGroupNestedIcons}
        />
    );

    const quickAccessSection =
        quickAccessItems.length > 0 ? (
            <div
                className={b('quick-access', {
                    scrollable: !compact && !isUnifiedMenuScroll,
                    unified: isUnifiedMenuScroll,
                })}
            >
                {!compact && (
                    <div className={b('quick-access-title')}>{i18n('quick_access_title')}</div>
                )}
                {compact ? (
                    quickAccessCompositeBar
                ) : isUnifiedMenuScroll ? (
                    quickAccessCompositeBar
                ) : (
                    <ScrollableWithScrollbar capped recalcDeps={[quickAccessItems.length]}>
                        {quickAccessCompositeBar}
                    </ScrollableWithScrollbar>
                )}
            </div>
        ) : null;

    const menuSection = mainMenuItems?.length ? (
        menuCompositeBar
    ) : (
        <div className={b('menu-items')} />
    );

    const asideRef = useRef<HTMLDivElement>(null);

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
                        'with-quick-access': enableQuickAccess && showQuickAccessSection,
                        'with-quick-access-items':
                            enableQuickAccess && showQuickAccessSection && hasQuickAccessItems,
                    })}
                >
                    <Header />
                    {isUnifiedMenuScroll ? (
                        <ScrollableWithScrollbar
                            className={b('unified-menu-scroll')}
                            recalcDeps={[
                                quickAccessItems.length,
                                mainMenuItems?.length ?? 0,
                                unifiedScrollContentVersion,
                            ]}
                            onOverflowChange={handleMenuScrollOverflowChange}
                        >
                            {quickAccessSection}
                            {menuSection}
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
