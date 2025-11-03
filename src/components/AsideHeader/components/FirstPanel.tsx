import React, {useRef} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {useGroupedMenuItems} from '../hooks/useGroupedMenuItems';
import {b} from '../utils';

import {useVisibleMenuItems} from './AllPagesPanel';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {Header} from './Header';
import {MenuItems} from './MenuItems';
import {Panels} from './Panels';

const MENU_ITEMS_COMPOSITE_ID = 'gravity-ui/navigation-menu-items-composite-bar';

export const FirstPanel = React.forwardRef<HTMLDivElement>((_props, ref) => {
    const {
        size,
        onItemClick,
        headerDecoration,
        multipleTooltip,
        onMenuMoreClick,
        renderFooter,
        compact,
        customBackground,
        customBackgroundClassName,
        className,
        hideCollapseButton,
        qa,
        onMouseEnter,
        onMouseLeave,
        isExpanded,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const groupedMenuItems = useGroupedMenuItems();

    const asideRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setRef<HTMLDivElement>(ref, asideRef.current);
    }, [ref]);

    const isExpandedByHover = compact && isExpanded;

    return (
        <React.Fragment>
            <div
                className={b('aside', {'expanded-by-hover': isExpandedByHover}, className)}
                style={{width: size}}
                data-qa={qa}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className={b('aside-popup-anchor')} ref={asideRef} />
                {customBackground && (
                    <div className={b('aside-custom-background', customBackgroundClassName)}>
                        {customBackground}
                    </div>
                )}

                <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                    <Header />

                    <MenuItems
                        compact={compact}
                        compositeIdBase={MENU_ITEMS_COMPOSITE_ID}
                        groupedMenuItems={groupedMenuItems}
                        visibleMenuItems={visibleMenuItems}
                        multipleTooltip={multipleTooltip}
                        onItemClick={onItemClick}
                        onMoreClick={onMenuMoreClick}
                    />

                    <div className={b('footer')}>
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
