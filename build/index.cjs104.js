'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const AsideHeaderContext = require('./index.cjs3.js');
const index = require('./index.cjs103.js');
const controlMenuButton = require('./index.cjs136.js');
;/* empty css              */

const b = cn.block("collapse-button");
const CollapseButton = ({ className }) => {
  const { onChangeCompact, compact, expandTitle, collapseTitle } = AsideHeaderContext.useAsideHeaderInnerContext();
  const onCollapseButtonClick = React.useCallback(() => {
    onChangeCompact?.(!compact);
  }, [compact, onChangeCompact]);
  const buttonTitle = compact ? expandTitle || index.default("button_expand") : collapseTitle || index.default("button_collapse");
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      className: b({ compact }, className),
      onClick: onCollapseButtonClick,
      title: buttonTitle,
      children: /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { data: controlMenuButton.default, className: b("icon"), width: "16", height: "10" })
    }
  );
};

exports.CollapseButton = CollapseButton;
//# sourceMappingURL=index.cjs104.js.map
