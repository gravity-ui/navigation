import React from 'react';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import headerDividerCollapsedIcon from '../../../../../assets/icons/divider-collapsed.svg';
import {b} from '../../utils';
import {Icon} from '@gravity-ui/uikit';
import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {ITEM_HEIGHT} from 'src/components/constants';

export interface Props {
    headerDecoration?: boolean;
    subheaderItemsCount?: number;
}

export const AsideFallback: React.FC<Props> = ({headerDecoration, subheaderItemsCount = 0}) => {
    const {compact} = useAsideHeaderContext();

    const widthVar = compact ? '--gn-aside-header-min-width' : '--gn-aside-header-size';

    const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;

    return (
        <div className={b('aside')} style={{width: `var(${widthVar})`}}>
            <div className={b('aside-content', {'with-decoration': headerDecoration})}>
                <div className={b('header', {'with-decoration': headerDecoration})}>
                    <div style={{height: subheaderHeight}} />
                    {compact ? (
                        <Icon
                            data={headerDividerCollapsedIcon}
                            className={b('header-divider')}
                            width={ASIDE_HEADER_COMPACT_WIDTH}
                            height="29"
                        />
                    ) : null}
                </div>
                <div style={{flex: 1}} />
            </div>
        </div>
    );
};
