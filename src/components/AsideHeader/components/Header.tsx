import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {CompositeBar} from '../../CompositeBar/CompositeBar';
import {Logo} from '../../Logo';
import {ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT} from '../../constants';
import {SubheaderMenuItem} from '../../types';
import {useAsideHeaderContext, useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

const headerDividerCollapsedIcon = '/icons/divider-collapsed.svg';

const DEFAULT_SUBHEADER_ITEMS: SubheaderMenuItem[] = [];

export const Header = () => {
    const {logo, onItemClick, onClosePanel, headerDecoration, subheaderItems} =
        useAsideHeaderInnerContext();
    const {compact} = useAsideHeaderContext();

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
                    buttonWrapperClassName={b('logo-button-wrapper')}
                    buttonClassName={b('logo-button')}
                />
            )}

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
