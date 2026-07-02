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
        menuGroupNestedIcons,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const quickAccessItems = useQuickAccessMenuItems();
    const mainMenuItems = useMainMenuItems();
    const hasQuickAccessItems = quickAccessItems.length > 0;
    const [menuScrollOverflows, setMenuScrollOverflows] = useState(false);

    const handleMenuScrollOverflowChange = useCallback((overflows: boolean) => {
        setMenuScrollOverflows(overflows);
    }, []);

    React.useEffect(() => {
        if (menuOverflow !== 'scroll' || compact || !visibleMenuItems?.length) {
            setMenuScrollOverflows(false);
        }
    }, [menuOverflow, compact, visibleMenuItems?.length]);

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
                        'with-quick-access': enableQuickAccess,
                        'with-quick-access-items': enableQuickAccess && hasQuickAccessItems,
                    })}
                >
                    <Header />
                    {quickAccessItems.length > 0 && (
                        <div className={b('quick-access', {scrollable: !compact})}>
                            {!compact && (
                                <div className={b('quick-access-title')}>
                                    {i18n('quick_access_title')}
                                </div>
                            )}
                            {compact ? (
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
                            ) : (
                                <ScrollableWithScrollbar
                                    capped
                                    recalcDeps={[quickAccessItems.length]}
                                >
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
                                </ScrollableWithScrollbar>
                            )}
                        </div>
                    )}
                    {mainMenuItems?.length ? (
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
                            onMenuScrollOverflowChange={
                                menuOverflow === 'scroll' && !compact
                                    ? handleMenuScrollOverflowChange
                                    : undefined
                            }
                            enableQuickAccessPin={quickAccessIsAvailable}
                            onToggleQuickAccess={onToggleQuickAccess}
                            menuGroupNestedIcons={menuGroupNestedIcons}
                        />
                    ) : (
                        <div className={b('menu-items')} />
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
