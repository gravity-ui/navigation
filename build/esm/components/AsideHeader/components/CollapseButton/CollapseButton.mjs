import { jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { block } from '../../../utils/cn.mjs';
import { useAsideHeaderInnerContext } from '../../AsideHeaderContext.mjs';
import i18n from '../../i18n/index.mjs';
import controlMenuButtonIcon from '../../../../icons/control-menu-button.svg.mjs';
/* empty css                     */

const b = block("collapse-button");
const CollapseButton = ({ className }) => {
  const { onChangeCompact, compact, expandTitle, collapseTitle } = useAsideHeaderInnerContext();
  const onCollapseButtonClick = useCallback(() => {
    onChangeCompact?.(!compact);
  }, [compact, onChangeCompact]);
  const buttonTitle = compact ? expandTitle || i18n("button_expand") : collapseTitle || i18n("button_collapse");
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: b({ compact }, className),
      onClick: onCollapseButtonClick,
      title: buttonTitle,
      children: /* @__PURE__ */ jsx(Icon, { data: controlMenuButtonIcon, className: b("icon"), width: "16", height: "10" })
    }
  );
};

export { CollapseButton };
//# sourceMappingURL=CollapseButton.mjs.map
