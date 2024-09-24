import { j as jsxRuntimeExports } from '../../../../node_modules/react/jsx-runtime.mjs';
import { Icon } from '@gravity-ui/uikit';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT, ITEM_HEIGHT } from '../../../constants.mjs';
import { useAsideHeaderContext } from '../../AsideHeaderContext.mjs';
import { b } from '../../utils.mjs';
import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg.mjs';

const AsideFallback = ({ headerDecoration, subheaderItemsCount = 0, qa }) => {
  const { compact } = useAsideHeaderContext();
  const widthVar = compact ? "--gn-aside-header-min-width" : "--gn-aside-header-size";
  const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("aside"), style: { width: `var(${widthVar})` }, "data-qa": qa, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("aside-content", { "with-decoration": headerDecoration }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("header", { "with-decoration": headerDecoration }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: subheaderHeight } }),
      compact ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon,
        {
          data: headerDividerCollapsedIcon,
          className: b("header-divider"),
          width: ASIDE_HEADER_COMPACT_WIDTH,
          height: HEADER_DIVIDER_HEIGHT
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } })
  ] }) });
};

export { AsideFallback };
//# sourceMappingURL=AsideFallback.mjs.map
