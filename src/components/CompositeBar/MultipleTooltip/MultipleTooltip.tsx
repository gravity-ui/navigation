import React from 'react';

import {Popup, PopupProps} from '@gravity-ui/uikit';

import {MenuItem} from '../../types';
import {block} from '../../utils/cn';
import {COLLAPSE_ITEM_ID} from '../constants';

import {MultipleTooltipContext} from './MultipleTooltipContext';

import './MultipleTooltip.scss';

const b = block('multiple-tooltip');

const POPUP_OFFSET: PopupProps['offset'] = {mainAxis: 4, crossAxis: -32};

type MultipleTooltipProps = Pick<PopupProps, 'open' | 'anchorRef' | 'placement'> & {
    items: MenuItem[];
};

export const MultipleTooltip: React.FC<MultipleTooltipProps> = ({
    items,
    open,
    anchorRef,
    placement,
}) => {
    const {activeIndex, hideCollapseItemTooltip} = React.useContext(MultipleTooltipContext);
    const activeItem = activeIndex === undefined ? null : items[activeIndex];

    return (
        <Popup
            open={open}
            className={b('popup')}
            anchorRef={anchorRef}
            strategy="fixed"
            placement={placement}
            offset={POPUP_OFFSET}
        >
            <div className={b()}>
                <div className={b('items-container')}>
                    {items
                        .filter(
                            ({type = 'regular', id}) =>
                                !hideCollapseItemTooltip ||
                                (id !== COLLAPSE_ITEM_ID && type !== 'action'),
                        )
                        .map((item, idx) => {
                            switch (item.type) {
                                case 'divider':
                                    return (
                                        <div className={b('item', {divider: true})} key={idx}>
                                            {item.title}
                                        </div>
                                    );
                                default:
                                    return (
                                        <div
                                            className={b('item', {
                                                active: item === activeItem,
                                            })}
                                            key={idx}
                                        >
                                            {item.title}
                                        </div>
                                    );
                            }
                        })}
                </div>
            </div>
        </Popup>
    );
};
