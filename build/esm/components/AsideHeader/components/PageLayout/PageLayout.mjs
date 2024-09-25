import { jsx, jsxs } from 'react/jsx-runtime';
import React__default, { useMemo, Suspense } from 'react';
import { ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH } from '../../../constants.mjs';
import { AsideHeaderContextProvider, useAsideHeaderContext } from '../../AsideHeaderContext.mjs';
import { b } from '../../utils.mjs';
/* empty css                      */
import { Content } from '../../../Content/Content.mjs';

const TopPanel = React__default.lazy(
  () => import('../TopPanel.mjs').then((module) => ({ default: module.TopPanel }))
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
//# sourceMappingURL=PageLayout.mjs.map
