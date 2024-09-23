import { jsxs, jsx } from 'react/jsx-runtime';
import React__default, { useRef } from 'react';
import { setRef } from '@gravity-ui/uikit';
import { CompositeBar } from './index.es102.js';
import { useAsideHeaderInnerContext } from './index.es3.js';
import i18n from './index.es103.js';
import { b } from './index.es27.js';
import { CollapseButton } from './index.es104.js';
import { Header } from './index.es105.js';
import { Panels } from './index.es106.js';
import { useVisibleMenuItems } from './index.es107.js';

const FirstPanel = React__default.forwardRef((_props, ref) => {
  const {
    size,
    onItemClick,
    headerDecoration,
    multipleTooltip,
    menuMoreTitle,
    renderFooter,
    compact,
    customBackground,
    customBackgroundClassName,
    className,
    hideCollapseButton,
    qa
  } = useAsideHeaderInnerContext();
  const visibleMenuItems = useVisibleMenuItems();
  const asideRef = useRef(null);
  React__default.useEffect(() => {
    setRef(ref, asideRef.current);
  }, [ref]);
  return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: b("aside", className), style: { width: size }, "data-qa": qa, children: [
      /* @__PURE__ */ jsx("div", { className: b("aside-popup-anchor"), ref: asideRef }),
      /* @__PURE__ */ jsxs("div", { className: b("aside-content", { ["with-decoration"]: headerDecoration }), children: [
        customBackground && /* @__PURE__ */ jsx("div", { className: b("aside-custom-background", customBackgroundClassName), children: customBackground }),
        /* @__PURE__ */ jsx(Header, {}),
        visibleMenuItems?.length ? /* @__PURE__ */ jsx(
          CompositeBar,
          {
            type: "menu",
            items: visibleMenuItems,
            menuMoreTitle: menuMoreTitle ?? i18n("label_more"),
            onItemClick,
            multipleTooltip
          }
        ) : /* @__PURE__ */ jsx("div", { className: b("menu-items") }),
        /* @__PURE__ */ jsx("div", { className: b("footer"), children: renderFooter?.({
          size,
          compact: Boolean(compact),
          asideRef
        }) }),
        !hideCollapseButton && /* @__PURE__ */ jsx(CollapseButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(Panels, {})
  ] });
});
FirstPanel.displayName = "FirstPanel";

export { FirstPanel };
//# sourceMappingURL=index.es31.js.map
