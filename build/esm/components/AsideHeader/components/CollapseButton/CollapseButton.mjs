import { j as jsxRuntimeExports } from '../../../../node_modules/react/jsx-runtime.mjs';
import { r as reactExports } from '../../../../node_modules/react/index.mjs';
import { block } from '../../../utils/cn.mjs';
import { useAsideHeaderInnerContext } from '../../AsideHeaderContext.mjs';
import i18n from '../../i18n/index.mjs';
import controlMenuButtonIcon from '../../../../assets/icons/control-menu-button.svg.mjs';
/* empty css                     */
import { Icon } from '../../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';

const b = block("collapse-button");
const CollapseButton = ({ className }) => {
  const { onChangeCompact, compact, expandTitle, collapseTitle } = useAsideHeaderInnerContext();
  const onCollapseButtonClick = reactExports.useCallback(() => {
    onChangeCompact?.(!compact);
  }, [compact, onChangeCompact]);
  const buttonTitle = compact ? expandTitle || i18n("button_expand") : collapseTitle || i18n("button_collapse");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: b({ compact }, className),
      onClick: onCollapseButtonClick,
      title: buttonTitle,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: controlMenuButtonIcon, className: b("icon"), width: "16", height: "10" })
    }
  );
};

export { CollapseButton };
//# sourceMappingURL=CollapseButton.mjs.map
