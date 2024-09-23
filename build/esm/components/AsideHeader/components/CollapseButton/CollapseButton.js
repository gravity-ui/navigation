import React__default, { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { block } from '../../../utils/cn.js';
import { useAsideHeaderInnerContext } from '../../AsideHeaderContext.js';
import i18n from '../../i18n/index.js';
import controlMenuButtonIcon from '../../../../assets/icons/control-menu-button.svg.js';

const b = block('collapse-button');
const CollapseButton = ({ className }) => {
    const { onChangeCompact, compact, expandTitle, collapseTitle } = useAsideHeaderInnerContext();
    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact === null || onChangeCompact === void 0 ? void 0 : onChangeCompact(!compact);
    }, [compact, onChangeCompact]);
    const buttonTitle = compact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');
    return (React__default.createElement("button", { className: b({ compact }, className), onClick: onCollapseButtonClick, title: buttonTitle },
        React__default.createElement(Icon, { data: controlMenuButtonIcon, className: b('icon'), width: "16", height: "10" })));
};

export { CollapseButton };
//# sourceMappingURL=CollapseButton.js.map
