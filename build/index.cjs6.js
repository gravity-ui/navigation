'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const AsideHeaderContext = require('./index.cjs3.js');
const useAsideHeaderInnerContextValue = require('./index.cjs30.js');
const FirstPanel = require('./index.cjs31.js');

const PageLayoutAside = React.forwardRef((props, ref) => {
  const { size, compact } = AsideHeaderContext.useAsideHeaderContext();
  const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue.useAsideHeaderInnerContextValue({ size, compact, ...props });
  return /* @__PURE__ */ jsxRuntime.jsx(AsideHeaderContext.AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue, children: /* @__PURE__ */ jsxRuntime.jsx(FirstPanel.FirstPanel, { ref }) });
});
PageLayoutAside.displayName = "PageLayoutAside";

exports.PageLayoutAside = PageLayoutAside;
//# sourceMappingURL=index.cjs6.js.map
