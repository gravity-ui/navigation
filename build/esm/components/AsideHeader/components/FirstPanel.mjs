import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React, { r as reactExports } from '../../../node_modules/react/index.mjs';
import { CompositeBar } from '../../CompositeBar/CompositeBar.mjs';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.mjs';
import i18n from '../i18n/index.mjs';
import { b } from '../utils.mjs';
import { CollapseButton } from './CollapseButton/CollapseButton.mjs';
import { Header } from './Header.mjs';
import { Panels } from './Panels.mjs';
import { useVisibleMenuItems } from '../../AllPagesPanel/useVisibleMenuItems.mjs';
import { setRef } from '../../../node_modules/@gravity-ui/uikit/build/esm/hooks/useForkRef/setRef.mjs';

const FirstPanel = React.forwardRef((_props, ref) => {
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
  const asideRef = reactExports.useRef(null);
  React.useEffect(() => {
    setRef(ref, asideRef.current);
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("aside", className), style: { width: size }, "data-qa": qa, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("aside-popup-anchor"), ref: asideRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("aside-content", { ["with-decoration"]: headerDecoration }), children: [
        customBackground && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("aside-custom-background", customBackgroundClassName), children: customBackground }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
        visibleMenuItems?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          CompositeBar,
          {
            type: "menu",
            items: visibleMenuItems,
            menuMoreTitle: menuMoreTitle ?? i18n("label_more"),
            onItemClick,
            multipleTooltip
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("menu-items") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("footer"), children: renderFooter?.({
          size,
          compact: Boolean(compact),
          asideRef
        }) }),
        !hideCollapseButton && /* @__PURE__ */ jsxRuntimeExports.jsx(CollapseButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panels, {})
  ] });
});
FirstPanel.displayName = "FirstPanel";

export { FirstPanel };
//# sourceMappingURL=FirstPanel.mjs.map
