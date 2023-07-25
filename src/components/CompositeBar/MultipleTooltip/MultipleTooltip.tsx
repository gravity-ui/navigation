import React from 'react';
import {Popup, PopupProps} from '@gravity-ui/uikit';

import {MultipleTooltipContext} from './MultipleTooltipContext';
import {MenuItem} from '../../types';
import {block} from '../../utils/cn';
import {COLLAPSE_ITEM_ID} from '../constants';

import './MultipleTooltip.scss';

const b = block('multiple-tooltip');

const POPUP_OFFSET: PopupProps['offset'] = [-32, 4];
const POPUP_MODIFIERS: PopupProps['modifiers'] = [
    {
        name: 'preventOverflow',
        enabled: false,
    },
];

export type MultipleTooltipProps = Pick<PopupProps, 'open' | 'anchorRef' | 'placement'> & {
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
            anchorRef={anchorRef}
            placement={placement}
            offset={POPUP_OFFSET}
            contentClassName={b(null)}
            modifiers={POPUP_MODIFIERS}
        >
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
        </Popup>
    );
};
