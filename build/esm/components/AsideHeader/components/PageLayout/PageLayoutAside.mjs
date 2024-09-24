import { j as jsxRuntimeExports } from '../../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../../node_modules/react/index.mjs';
import { useAsideHeaderContext, AsideHeaderInnerContextProvider } from '../../AsideHeaderContext.mjs';
import { useAsideHeaderInnerContextValue } from '../../useAsideHeaderInnerContextValue.mjs';
import { FirstPanel } from '../FirstPanel.mjs';

const PageLayoutAside = React.forwardRef((props, ref) => {
  const { size, compact } = useAsideHeaderContext();
  const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({ size, compact, ...props });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FirstPanel, { ref }) });
});
PageLayoutAside.displayName = "PageLayoutAside";

export { PageLayoutAside };
//# sourceMappingURL=PageLayoutAside.mjs.map
