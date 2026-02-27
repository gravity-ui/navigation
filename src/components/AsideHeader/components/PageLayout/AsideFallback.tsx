import React from 'react';

import {Icon, QAProps} from '@gravity-ui/uikit';

import {ASIDE_HEADER_COLLAPSED_WIDTH, HEADER_DIVIDER_HEIGHT, ITEM_HEIGHT} from '../../../constants';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {b} from '../../utils';

import headerDividerCollapsedIcon from '../../../../../assets/icons/divider-collapsed.svg';

interface Props extends QAProps {
    headerDecoration?: boolean;
    subheaderItemsCount?: number;
}

export const AsideFallback: React.FC<Props> = ({headerDecoration, subheaderItemsCount = 0, qa}) => {
    const {pinned} = useAsideHeaderContext();

    const widthVar = pinned ? '--gn-aside-header-size' : '--gn-aside-header-min-width';

    const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;

    return (
        <div className={b('aside')} style={{width: `var(${widthVar})`}} data-qa={qa}>
            <div className={b('aside-content', {'with-decoration': headerDecoration})}>
                <div className={b('header', {'with-decoration': headerDecoration})}>
                    <div style={{height: subheaderHeight}} />
                    {!pinned && headerDecoration ? (
                        <Icon
                            data={headerDividerCollapsedIcon}
                            className={b('header-divider')}
                            width={ASIDE_HEADER_COLLAPSED_WIDTH}
                            height={HEADER_DIVIDER_HEIGHT}
                        />
                    ) : null}
                </div>
                <div style={{flex: 1}} />
            </div>
        </div>
    );
};
