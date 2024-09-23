import { jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
import { useAsideHeaderInnerContext } from './index.es3.js';
import i18n from './index.es103.js';
import controlMenuButtonIcon from './index.es136.js';
/* empty css            */

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
//# sourceMappingURL=index.es104.js.map
