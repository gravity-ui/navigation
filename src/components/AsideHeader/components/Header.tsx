import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {Logo} from '../../Logo';
import {HEADER_DIVIDER_HEIGHT, HEADER_DIVIDER_HEIGHT_COMPACT} from '../../constants';
import {getCollapsedWidth} from '../../utils/getCollapsedWidth';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {AsideHeaderItem} from '../types';
import {b} from '../utils';

import {useGroupedMenuItems} from './AllPagesPanel/useGroupedMenuItems';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';

import headerDividerCollapsedCompactIcon from '../../../../assets/icons/divider-collapsed-compact.svg';
import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg';

const DEFAULT_SUBHEADER_ITEMS: AsideHeaderItem[] = [];
const HEADER_COMPOSITE_ID = 'gravity-ui/navigation-header-composite-bar';

export const Header = () => {
    const {
        logo,
        isExpanded,
        onItemClick,
        onClosePanel,
        headerDecoration,
        subheaderItems,
        hideCollapseButton,
        isCompactMode,
    } = useAsideHeaderInnerContext();

    const items = useGroupedMenuItems(subheaderItems || DEFAULT_SUBHEADER_ITEMS);

    const onLogoClick = useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            onClosePanel?.();
            logo?.onClick?.(event);
        },
        [onClosePanel, logo],
    );

    return (
        <div className={b('header', {['with-decoration']: headerDecoration})}>
            <div className={b('logo-container', {'without-logo': !logo})}>
                {logo && (
                    <Logo
                        {...logo}
                        placement="header"
                        isCompactMode={isCompactMode}
                        onClick={onLogoClick}
                        isExpanded={isExpanded}
                        buttonClassName={b('logo-button')}
                        iconPlaceClassName={b('logo-icon-place')}
                    />
                )}

                {!hideCollapseButton && (
                    <CollapseButton
                        className={b('pin-button', {collapsed: !isExpanded})}
                        isCompactMode={isCompactMode}
                    />
                )}
            </div>

            <CompositeBar
                compositeId={HEADER_COMPOSITE_ID}
                menuItemClassName={b('menu-item')}
                type="subheader"
                isExpanded={isExpanded}
                items={items}
                onItemClick={onItemClick}
                isCompactMode={isCompactMode}
            />

            {headerDecoration && (
                <Icon
                    data={
                        isCompactMode
                            ? headerDividerCollapsedCompactIcon
                            : headerDividerCollapsedIcon
                    }
                    className={b('header-divider')}
                    width={getCollapsedWidth(isCompactMode)}
                    height={isCompactMode ? HEADER_DIVIDER_HEIGHT_COMPACT : HEADER_DIVIDER_HEIGHT}
                />
            )}
        </div>
    );
};
