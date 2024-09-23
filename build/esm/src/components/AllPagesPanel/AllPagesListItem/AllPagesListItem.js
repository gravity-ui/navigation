import React__default, { useCallback } from 'react';
import { Pin, PinFill } from '@gravity-ui/icons';
import { Icon, Button } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';

const b = block('all-pages-list-item');
const AllPagesListItem = (props) => {
    const { item, editMode, onToggle } = props;
    const onPinButtonClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
    }, [onToggle]);
    const onItemClick = (e) => {
        if (editMode) {
            e.stopPropagation();
            e.preventDefault();
        }
    };
    return (React__default.createElement("div", { className: b(), onClick: onItemClick },
        item.icon ? (React__default.createElement(Icon, { className: b('icon'), data: item.icon, size: item.iconSize })) : null,
        React__default.createElement("span", { className: b('text') }, item.title),
        editMode && (React__default.createElement(Button, { onClick: onPinButtonClick, view: item.hidden ? 'flat-secondary' : 'flat-action' },
            React__default.createElement(Button.Icon, null, item.hidden ? React__default.createElement(Pin, null) : React__default.createElement(PinFill, null))))));
};

export { AllPagesListItem };
//# sourceMappingURL=AllPagesListItem.js.map
