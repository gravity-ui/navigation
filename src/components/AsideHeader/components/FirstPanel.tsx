import React, {useCallback, useRef} from 'react';

import {setRef} from '@gravity-ui/uikit';
import {CSSTransition} from 'react-transition-group';

import {ASIDE_HEADER_EXPAND_TRANSITION_DELAY} from '../../constants';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

import {useGroupedMenuItems} from './AllPagesPanel/useGroupedMenuItems';
import {CompositeBar} from './CompositeBar';
import {FooterBar} from './FooterBar';
import {Header} from './Header';
import {Panels} from './Panels';

const MENU_ITEMS_COMPOSITE_ID = 'gravity-ui/navigation-menu-items-composite-bar';

const asideTransitionClassNames = {
    enter: b('aside-transition-enter'),
    enterActive: b('aside-transition-enter-active'),
    enterDone: b('aside-transition-enter-done'),
    exit: b('aside-transition-exit'),
    exitActive: b('aside-transition-exit-active'),
};

export const FirstPanel = React.forwardRef<HTMLDivElement>((_props, ref) => {
    const {
        size,
        onItemClick,
        headerDecoration,
        onMenuMoreClick,
        renderFooter,
        onToggleGroupCollapsed,
        renderFooterAfter,
        pinned,
        customBackground,
        customBackgroundClassName,
        className,
        menuItems,
        menuGroups,
        qa,
        onExpand,
        onFold,
        isExpanded,
        isCompactMode,
        hasPanelOpen,
    } = useAsideHeaderInnerContext();

    const flatListItems = useGroupedMenuItems(menuItems, menuGroups);

    const asideRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setRef<HTMLDivElement>(ref, asideRef.current);
    }, [ref]);

    const isExpandedByHover = !pinned && isExpanded;
    const footerResult = renderFooter?.({
        size,
        isExpanded,
        isPinned: pinned,
        asideRef,
        isCompactMode,
    });
    const canRenderFooterInHorizontalMode = Array.isArray(footerResult);

    const renderFooterContent = useCallback(() => {
        if (canRenderFooterInHorizontalMode) {
            return (
                <FooterBar
                    isPinned={pinned}
                    isExpanded={isExpanded}
                    renderAfter={renderFooterAfter}
                >
                    {footerResult}
                </FooterBar>
            );
        }

        return footerResult;
    }, [footerResult, pinned, isExpanded, canRenderFooterInHorizontalMode, renderFooterAfter]);

    return (
        <React.Fragment>
            <CSSTransition
                in={isExpandedByHover}
                timeout={ASIDE_HEADER_EXPAND_TRANSITION_DELAY}
                classNames={asideTransitionClassNames}
            >
                <div
                    className={b('aside', {['compact-mode']: isCompactMode}, className)}
                    style={{width: size}}
                    data-qa={qa}
                    onMouseEnter={hasPanelOpen ? undefined : onExpand}
                    onMouseLeave={hasPanelOpen ? undefined : onFold}
                >
                    <div className={b('aside-popup-anchor')} ref={asideRef} />
                    {customBackground && (
                        <div className={b('aside-custom-background', customBackgroundClassName)}>
                            {customBackground}
                        </div>
                    )}

                    <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                        <Header />

                        {flatListItems?.length ? (
                            <CompositeBar
                                compositeId={MENU_ITEMS_COMPOSITE_ID}
                                className={b('menu-items')}
                                menuItemClassName={b('menu-item')}
                                isExpanded={isExpanded}
                                type="menu"
                                items={flatListItems}
                                onItemClick={onItemClick}
                                onMoreClick={onMenuMoreClick}
                                onToggleGroupCollapsed={onToggleGroupCollapsed}
                                isCompactMode={isCompactMode}
                            />
                        ) : (
                            <div className={b('menu-items')} />
                        )}

                        <div
                            className={b('footer', {
                                horizontal: canRenderFooterInHorizontalMode && pinned,
                            })}
                        >
                            {renderFooterContent()}
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <Panels />
        </React.Fragment>
    );
});

FirstPanel.displayName = 'FirstPanel';
