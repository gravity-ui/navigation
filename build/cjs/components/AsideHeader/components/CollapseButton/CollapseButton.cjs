'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../../node_modules/react/index.cjs');
const cn = require('../../../utils/cn.cjs');
const AsideHeaderContext = require('../../AsideHeaderContext.cjs');
const index$1 = require('../../i18n/index.cjs');
const controlMenuButton = require('../../../../assets/icons/control-menu-button.svg.cjs');
;/* empty css                      */
const Icon = require('../../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');

const b = cn.block("collapse-button");
const CollapseButton = ({ className }) => {
  const { onChangeCompact, compact, expandTitle, collapseTitle } = AsideHeaderContext.useAsideHeaderInnerContext();
  const onCollapseButtonClick = index.reactExports.useCallback(() => {
    onChangeCompact?.(!compact);
  }, [compact, onChangeCompact]);
  const buttonTitle = compact ? expandTitle || index$1.default("button_expand") : collapseTitle || index$1.default("button_collapse");
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    "button",
    {
      className: b({ compact }, className),
      onClick: onCollapseButtonClick,
      title: buttonTitle,
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: controlMenuButton.default, className: b("icon"), width: "16", height: "10" })
    }
  );
};

exports.CollapseButton = CollapseButton;
//# sourceMappingURL=CollapseButton.cjs.map
