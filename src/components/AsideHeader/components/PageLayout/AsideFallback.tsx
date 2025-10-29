import React from 'react';

import {Icon, QAProps} from '@gravity-ui/uikit';

import {ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT, ITEM_HEIGHT} from '../../../constants';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {b} from '../../utils';

import headerDividerCollapsedIcon from '../../../../../assets/icons/divider-collapsed.svg';

interface Props extends QAProps {
    headerDecoration?: boolean;
    subheaderItemsCount?: number;
}

export const AsideFallback: React.FC<Props> = ({headerDecoration, subheaderItemsCount = 0, qa}) => {
    const {compact} = useAsideHeaderContext();

    const widthVar = compact ? '--gn-aside-header-min-width' : '--gn-aside-header-size';

    const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;

    return (
        <div className={b('aside')} style={{width: `var(${widthVar})`}} data-qa={qa}>
            <div className={b('aside-content', {'with-decoration': headerDecoration})}>
                <div className={b('header', {'with-decoration': headerDecoration})}>
                    <div style={{height: subheaderHeight}} />
                    {compact && headerDecoration ? (
                        <Icon
                            data={headerDividerCollapsedIcon}
                            className={b('header-divider')}
                            width={ASIDE_HEADER_COMPACT_WIDTH}
                            height={HEADER_DIVIDER_HEIGHT}
                        />
                    ) : null}
                </div>
                <div style={{flex: 1}} />
            </div>
        </div>
    );
};
