'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const AsideHeaderContext = require('../../AsideHeaderContext.cjs');
const useAsideHeaderInnerContextValue = require('../../useAsideHeaderInnerContextValue.cjs');
const FirstPanel = require('../FirstPanel.cjs');

const PageLayoutAside = React.forwardRef((props, ref) => {
  const { size, compact } = AsideHeaderContext.useAsideHeaderContext();
  const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue.useAsideHeaderInnerContextValue({ size, compact, ...props });
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(AsideHeaderContext.AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(FirstPanel.FirstPanel, { ref }) });
});
PageLayoutAside.displayName = "PageLayoutAside";

exports.PageLayoutAside = PageLayoutAside;
//# sourceMappingURL=PageLayoutAside.cjs.map
