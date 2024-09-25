import { jsxs, jsx } from 'react/jsx-runtime';
import React__default, { useRef } from 'react';
import { setRef } from '@gravity-ui/uikit';
import { CompositeBar } from '../../CompositeBar/CompositeBar.mjs';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.mjs';
import i18n from '../i18n/index.mjs';
import { b } from '../utils.mjs';
import { CollapseButton } from './CollapseButton/CollapseButton.mjs';
import { Header } from './Header.mjs';
import { Panels } from './Panels.mjs';
import { useVisibleMenuItems } from '../../AllPagesPanel/useVisibleMenuItems.mjs';

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
//# sourceMappingURL=FirstPanel.mjs.map
