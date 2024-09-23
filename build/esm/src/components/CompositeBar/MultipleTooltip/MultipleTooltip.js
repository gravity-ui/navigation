import React__default from 'react';
import { Popup } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';
import { COLLAPSE_ITEM_ID } from '../constants.js';
import { MultipleTooltipContext } from './MultipleTooltipContext.js';

const b = block('multiple-tooltip');
const POPUP_OFFSET = [-32, 4];
const POPUP_MODIFIERS = [
    {
        name: 'preventOverflow',
        enabled: false,
    },
];
const MultipleTooltip = ({ items, open, anchorRef, placement, }) => {
    const { activeIndex, hideCollapseItemTooltip } = React__default.useContext(MultipleTooltipContext);
    const activeItem = activeIndex === undefined ? null : items[activeIndex];
    return (React__default.createElement(Popup, { open: open, anchorRef: anchorRef, placement: placement, offset: POPUP_OFFSET, contentClassName: b(null), modifiers: POPUP_MODIFIERS, disableLayer: true },
        React__default.createElement("div", { className: b('items-container') }, items
            .filter(({ type = 'regular', id }) => !hideCollapseItemTooltip ||
            (id !== COLLAPSE_ITEM_ID && type !== 'action'))
            .map((item, idx) => {
            switch (item.type) {
                case 'divider':
                    return (React__default.createElement("div", { className: b('item', { divider: true }), key: idx }, item.title));
                default:
                    return (React__default.createElement("div", { className: b('item', {
                            active: item === activeItem,
                        }), key: idx }, item.title));
            }
        }))));
};

export { MultipleTooltip };
//# sourceMappingURL=MultipleTooltip.js.map
