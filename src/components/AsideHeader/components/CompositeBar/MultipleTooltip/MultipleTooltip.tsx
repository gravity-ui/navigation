import React from 'react';

import {Popup, PopupProps} from '@gravity-ui/uikit';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {createBlock} from '../../../../utils/cn';
import {COLLAPSE_ITEM_ID} from '../constants';

import {MultipleTooltipContext} from './MultipleTooltipContext';

import styles from './MultipleTooltip.scss';

const b = createBlock('multiple-tooltip', styles);

const POPUP_OFFSET: PopupProps['offset'] = {mainAxis: 4, crossAxis: -32};

type MultipleTooltipProps = Pick<PopupProps, 'open' | 'placement'> & {
    anchorRef: React.RefObject<HTMLElement>;
    items: AsideHeaderItem[];
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
            anchorElement={anchorRef.current}
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
                        .map((currentItem, idx) => {
                            switch (currentItem.type) {
                                case 'divider':
                                    return (
                                        <div className={b('item', {divider: true})} key={idx}>
                                            {currentItem.title}
                                        </div>
                                    );
                                default:
                                    return (
                                        <div
                                            className={b('item', {
                                                active: currentItem === activeItem,
                                            })}
                                            key={idx}
                                        >
                                            {currentItem.title}
                                        </div>
                                    );
                            }
                        })}
                </div>
            </div>
        </Popup>
    );
};
