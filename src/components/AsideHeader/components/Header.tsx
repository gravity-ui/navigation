import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {Logo} from '../../Logo';
import {ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT} from '../../constants';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {AsideHeaderItem} from '../types';
import {b} from '../utils';

import {useGroupedMenuItems} from './AllPagesPanel/useGroupedMenuItems';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';

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
            <div className={b('logo-container')}>
                {logo && (
                    <Logo
                        {...logo}
                        onClick={onLogoClick}
                        compact={!isExpanded}
                        buttonClassName={b('logo-button')}
                        iconPlaceClassName={b('logo-icon-place')}
                    />
                )}

                {!hideCollapseButton && isExpanded && <CollapseButton />}
            </div>

            <CompositeBar
                compositeId={HEADER_COMPOSITE_ID}
                menuItemClassName={b('menu-item')}
                type="subheader"
                compact={!isExpanded}
                items={items}
                onItemClick={onItemClick}
            />

            {headerDecoration && (
                <Icon
                    data={headerDividerCollapsedIcon}
                    className={b('header-divider')}
                    width={ASIDE_HEADER_COMPACT_WIDTH}
                    height={HEADER_DIVIDER_HEIGHT}
                />
            )}
        </div>
    );
};
