import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React from '../../node_modules/react/index.mjs';
import { PageLayout } from './components/PageLayout/PageLayout.mjs';
import { PageLayoutAside } from './components/PageLayout/PageLayoutAside.mjs';

const AsideHeader = React.forwardRef(
  ({ compact, className, topAlert, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageLayout, { compact, className, topAlert, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayoutAside, { ref, ...props }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayout.Content, { renderContent: props.renderContent })
    ] });
  }
);
AsideHeader.displayName = "AsideHeader";

export { AsideHeader };
//# sourceMappingURL=AsideHeader.mjs.map
