import { jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { useAsideHeaderContext, AsideHeaderInnerContextProvider } from './index.es3.js';
import { useAsideHeaderInnerContextValue } from './index.es30.js';
import { FirstPanel } from './index.es31.js';

const PageLayoutAside = React__default.forwardRef((props, ref) => {
  const { size, compact } = useAsideHeaderContext();
  const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({ size, compact, ...props });
  return /* @__PURE__ */ jsx(AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue, children: /* @__PURE__ */ jsx(FirstPanel, { ref }) });
});
PageLayoutAside.displayName = "PageLayoutAside";

export { PageLayoutAside };
//# sourceMappingURL=index.es6.js.map
