import React, {useRef} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

import {useGroupedMenuItems} from './AllPagesPanel/useGroupedMenuItems';
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
        multipleTooltip,
        onMenuMoreClick,
        renderFooter,
        compact,
        customBackground,
        customBackgroundClassName,
        className,
        hideCollapseButton,
        menuItems,
        menuGroups,
        qa,
        onMouseEnter,
        onMouseLeave,
        isExpanded,
    } = useAsideHeaderInnerContext();

    const flatListItems = useGroupedMenuItems(menuItems, menuGroups);

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

                    <CompositeBar
                        compositeId={MENU_ITEMS_COMPOSITE_ID}
                        className={b('menu-items')}
                        compact={compact}
                        type="menu"
                        items={flatListItems}
                        onItemClick={onItemClick}
                        onMoreClick={onMenuMoreClick}
                        multipleTooltip={multipleTooltip}
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
