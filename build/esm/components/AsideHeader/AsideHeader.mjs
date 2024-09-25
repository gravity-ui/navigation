import { jsxs, jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { PageLayout } from './components/PageLayout/PageLayout.mjs';
import { PageLayoutAside } from './components/PageLayout/PageLayoutAside.mjs';

const AsideHeader = React__default.forwardRef(
  ({ compact, className, topAlert, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(PageLayout, { compact, className, topAlert, children: [
      /* @__PURE__ */ jsx(PageLayoutAside, { ref, ...props }),
      /* @__PURE__ */ jsx(PageLayout.Content, { renderContent: props.renderContent })
    ] });
  }
);
AsideHeader.displayName = "AsideHeader";

export { AsideHeader };
//# sourceMappingURL=AsideHeader.mjs.map
