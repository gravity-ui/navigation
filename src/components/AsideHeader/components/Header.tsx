import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {Logo} from '../../Logo';
import {ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT} from '../../constants';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {AsideHeaderItem} from '../types';
import {b} from '../utils';

import {CompositeBar} from './CompositeBar';

import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg';

const DEFAULT_SUBHEADER_ITEMS: AsideHeaderItem[] = [];
const HEADER_COMPOSITE_ID = 'gravity-ui/navigation-header-composite-bar';

export const Header = () => {
    const {logo, onItemClick, onClosePanel, headerDecoration, subheaderItems, compact} =
        useAsideHeaderInnerContext();

    const onLogoClick = useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            onClosePanel?.();
            logo?.onClick?.(event);
        },
        [onClosePanel, logo],
    );

    return (
        <div className={b('header', {['with-decoration']: headerDecoration})}>
            {logo && (
                <Logo
                    {...logo}
                    onClick={onLogoClick}
                    compact={compact}
                    buttonClassName={b('logo-button')}
                    iconPlaceClassName={b('logo-icon-place')}
                />
            )}

            <CompositeBar
                compositeId={HEADER_COMPOSITE_ID}
                type="subheader"
                compact={compact}
                items={subheaderItems || DEFAULT_SUBHEADER_ITEMS}
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
