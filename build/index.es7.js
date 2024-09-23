import { jsx, jsxs } from 'react/jsx-runtime';
import { Icon } from '@gravity-ui/uikit';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT, ITEM_HEIGHT } from './index.es23.js';
import { useAsideHeaderContext } from './index.es3.js';
import { b } from './index.es27.js';
import headerDividerCollapsedIcon from './index.es32.js';

const AsideFallback = ({ headerDecoration, subheaderItemsCount = 0, qa }) => {
  const { compact } = useAsideHeaderContext();
  const widthVar = compact ? "--gn-aside-header-min-width" : "--gn-aside-header-size";
  const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;
  return /* @__PURE__ */ jsx("div", { className: b("aside"), style: { width: `var(${widthVar})` }, "data-qa": qa, children: /* @__PURE__ */ jsxs("div", { className: b("aside-content", { "with-decoration": headerDecoration }), children: [
    /* @__PURE__ */ jsxs("div", { className: b("header", { "with-decoration": headerDecoration }), children: [
      /* @__PURE__ */ jsx("div", { style: { height: subheaderHeight } }),
      compact ? /* @__PURE__ */ jsx(
        Icon,
        {
          data: headerDividerCollapsedIcon,
          className: b("header-divider"),
          width: ASIDE_HEADER_COMPACT_WIDTH,
          height: HEADER_DIVIDER_HEIGHT
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx("div", { style: { flex: 1 } })
  ] }) });
};

export { AsideFallback };
//# sourceMappingURL=index.es7.js.map
