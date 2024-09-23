import React__default from 'react';
import { Xmark } from '@gravity-ui/icons';
import { Text, Button, Icon } from '@gravity-ui/uikit';
import { block } from '../utils/cn.js';
import i18n from './i18n/index.js';

const b = block('title');
const Title = ({ children, closeIconSize = 23, hasSeparator, closeTitle = i18n('button_close'), onClose, }) => {
    return (React__default.createElement("div", { className: b({ separator: hasSeparator }) },
        React__default.createElement(Text, { className: b('text'), as: 'h3', variant: 'subheader-3' }, children),
        onClose && (React__default.createElement(Button, { onClick: onClose, view: "flat", size: "l", extraProps: {
                'aria-label': closeTitle,
            } },
            React__default.createElement(Icon, { data: Xmark, size: closeIconSize })))));
};
Title.displayName = 'Title';

export { Title };
//# sourceMappingURL=Title.js.map
