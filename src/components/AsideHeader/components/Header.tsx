import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {SubheaderMenuItem} from '../../types';
import {ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT} from '../../constants';
import {Logo} from '../../Logo';
import {CompositeBar} from '../../CompositeBar/CompositeBar';

import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

const DEFAULT_SUBHEADER_ITEMS: SubheaderMenuItem[] = [];

export const Header = () => {
    const {logo, onItemClick, onClosePanel, headerDecoration, subheaderItems} =
        useAsideHeaderInnerContext();
    const {onClick: onLogoClickProp} = logo;
    const onLogoClick = useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            onClosePanel?.();
            onLogoClickProp?.(event);
        },
        [onClosePanel, onLogoClickProp],
    );

    return (
        <div className={b('header', {['with-decoration']: headerDecoration})}>
            <Logo {...logo} onClick={onLogoClick} iconWrapperClassName={b('logo-icon')} />

            <CompositeBar
                type="subheader"
                items={subheaderItems || DEFAULT_SUBHEADER_ITEMS}
                onItemClick={onItemClick}
            />

            <Icon
                data={headerDividerCollapsedIcon}
                className={b('header-divider')}
                width={ASIDE_HEADER_COMPACT_WIDTH}
                height={HEADER_DIVIDER_HEIGHT}
            />
        </div>
    );
};
