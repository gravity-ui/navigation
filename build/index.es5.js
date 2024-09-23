import { jsx, jsxs } from 'react/jsx-runtime';
import React__default, { useMemo, Suspense } from 'react';
import { ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH } from './index.es23.js';
import { AsideHeaderContextProvider, useAsideHeaderContext } from './index.es3.js';
import { b } from './index.es27.js';
/* empty css           */
import { Content } from './index.es29.js';

const TopPanel = React__default.lazy(
  () => import('./index.es26.js').then((module) => ({ default: module.TopPanel }))
);
const Layout = ({ compact, className, children, topAlert }) => {
  const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
  const asideHeaderContextValue = useMemo(() => ({ size, compact }), [compact, size]);
  return /* @__PURE__ */ jsx(AsideHeaderContextProvider, { value: asideHeaderContextValue, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: b({ compact }, className),
      style: {
        ...{ "--gn-aside-header-size": `${size}px` }
      },
      children: [
        topAlert && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(TopPanel, { topAlert }) }),
        /* @__PURE__ */ jsx("div", { className: b("pane-container"), children })
      ]
    }
  ) });
};
const ConnectedContent = ({
  children,
  renderContent
}) => {
  const { size } = useAsideHeaderContext();
  return /* @__PURE__ */ jsx(Content, { size, className: b("content"), renderContent, children });
};
const PageLayout = Object.assign(Layout, {
  Content: ConnectedContent
});

export { PageLayout };
//# sourceMappingURL=index.es5.js.map
