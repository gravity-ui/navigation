import { jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { useAsideHeaderContext, AsideHeaderInnerContextProvider } from '../../AsideHeaderContext.mjs';
import { useAsideHeaderInnerContextValue } from '../../useAsideHeaderInnerContextValue.mjs';
import { FirstPanel } from '../FirstPanel.mjs';

const PageLayoutAside = React__default.forwardRef((props, ref) => {
  const { size, compact } = useAsideHeaderContext();
  const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({ size, compact, ...props });
  return /* @__PURE__ */ jsx(AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue, children: /* @__PURE__ */ jsx(FirstPanel, { ref }) });
});
PageLayoutAside.displayName = "PageLayoutAside";

export { PageLayoutAside };
//# sourceMappingURL=PageLayoutAside.mjs.map
