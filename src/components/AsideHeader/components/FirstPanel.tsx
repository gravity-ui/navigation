import React, {useCallback, useRef, useState} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import i18n from '../i18n';
import {b} from '../utils';

import {useVisibleMenuItems} from './AllPagesPanel';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';
import {Header} from './Header';
import {Panels} from './Panels';

const MENU_ITEMS_COMPOSITE_ID = 'gravity-ui/navigation-menu-items-composite-bar';

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
        qa,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const [menuScrollOverflows, setMenuScrollOverflows] = useState(false);

    const handleMenuScrollOverflowChange = useCallback((overflows: boolean) => {
        setMenuScrollOverflows(overflows);
    }, []);

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

                <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                    <Header />
                    {aboveMenuContent}
                    {visibleMenuItems?.length ? (
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
                            onMenuScrollOverflowChange={handleMenuScrollOverflowChange}
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
