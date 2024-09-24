'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const uikit = require('@gravity-ui/uikit');
const constants = require('../../../constants.cjs');
const AsideHeaderContext = require('../../AsideHeaderContext.cjs');
const utils = require('../../utils.cjs');
const dividerCollapsed = require('../../../../assets/icons/divider-collapsed.svg.cjs');

const AsideFallback = ({ headerDecoration, subheaderItemsCount = 0, qa }) => {
  const { compact } = AsideHeaderContext.useAsideHeaderContext();
  const widthVar = compact ? "--gn-aside-header-min-width" : "--gn-aside-header-size";
  const subheaderHeight = (1 + subheaderItemsCount) * constants.ITEM_HEIGHT;
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("aside"), style: { width: `var(${widthVar})` }, "data-qa": qa, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: utils.b("aside-content", { "with-decoration": headerDecoration }), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: utils.b("header", { "with-decoration": headerDecoration }), children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { style: { height: subheaderHeight } }),
      compact ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        uikit.Icon,
        {
          data: dividerCollapsed.default,
          className: utils.b("header-divider"),
          width: constants.ASIDE_HEADER_COMPACT_WIDTH,
          height: constants.HEADER_DIVIDER_HEIGHT
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { style: { flex: 1 } })
  ] }) });
};

exports.AsideFallback = AsideFallback;
//# sourceMappingURL=AsideFallback.cjs.map
