'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('../../../utils/cn.cjs');
const AsideHeaderContext = require('../../AsideHeaderContext.cjs');
const index = require('../../i18n/index.cjs');
const controlMenuButton = require('../../../../assets/icons/control-menu-button.svg.cjs');
;/* empty css                      */

const b = cn.block("collapse-button");
const CollapseButton = ({ className }) => {
  const { onChangeCompact, compact, expandTitle, collapseTitle } = AsideHeaderContext.useAsideHeaderInnerContext();
  const onCollapseButtonClick = React.useCallback(() => {
    onChangeCompact?.(!compact);
  }, [compact, onChangeCompact]);
  const buttonTitle = compact ? expandTitle || index.default("button_expand") : collapseTitle || index.default("button_collapse");
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    "button",
    {
      className: b({ compact }, className),
      onClick: onCollapseButtonClick,
      title: buttonTitle,
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Icon, { data: controlMenuButton.default, className: b("icon"), width: "16", height: "10" })
    }
  );
};

exports.CollapseButton = CollapseButton;
//# sourceMappingURL=CollapseButton.cjs.map
