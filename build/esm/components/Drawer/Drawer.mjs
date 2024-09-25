import { jsx, jsxs } from 'react/jsx-runtime';
import React__default from 'react';
import { useForkRef, useBodyScrollLock, Portal } from '@gravity-ui/uikit';
import { CSSTransition, Transition } from 'react-transition-group';
import { block } from '../utils/cn.mjs';
import { useResizableDrawerItem } from './utils.mjs';
/* empty css             */

const b = block("drawer");
const TIMEOUT = 300;
const DrawerItem = React__default.forwardRef(
  function DrawerItem2(props, ref) {
    const {
      visible,
      content,
      children,
      direction = "left",
      className,
      resizable,
      width,
      minResizeWidth,
      maxResizeWidth,
      onResize
    } = props;
    const itemRef = React__default.useRef(null);
    const handleRef = useForkRef(ref, itemRef);
    const cssDirection = direction === "left" ? void 0 : direction;
    const { resizedWidth, resizerHandlers } = useResizableDrawerItem({
      direction,
      width,
      minResizeWidth,
      maxResizeWidth,
      onResize
    });
    const resizerElement = resizable ? /* @__PURE__ */ jsx("div", { className: b("resizer", { direction }), ...resizerHandlers, children: /* @__PURE__ */ jsx("div", { className: b("resizer-handle") }) }) : null;
    return /* @__PURE__ */ jsx(
      CSSTransition,
      {
        in: visible,
        timeout: TIMEOUT,
        unmountOnExit: true,
        classNames: b("item-transition", { direction: cssDirection }),
        nodeRef: itemRef,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: handleRef,
            className: b("item", { direction: cssDirection }, className),
            style: { width: resizable ? `${resizedWidth}px` : void 0 },
            children: [
              resizerElement,
              children ?? content
            ]
          }
        )
      }
    );
  }
);
const Drawer = ({
  className,
  veilClassName,
  children,
  style,
  onVeilClick,
  onEscape,
  preventScrollBody = true,
  hideVeil,
  disablePortal = true
}) => {
  let someItemVisible = false;
  React__default.Children.forEach(children, (child) => {
    if (React__default.isValidElement(child) && child.type === DrawerItem) {
      const childVisible = Boolean(child.props.visible);
      if (childVisible) {
        someItemVisible = true;
      }
    }
  });
  React__default.useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        onEscape?.();
      }
    }
    if (someItemVisible) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onEscape, someItemVisible]);
  useBodyScrollLock({ enabled: preventScrollBody && someItemVisible });
  const containerRef = React__default.useRef(null);
  const veilRef = React__default.useRef(null);
  const drawer = /* @__PURE__ */ jsx(
    Transition,
    {
      in: someItemVisible,
      timeout: { enter: 0, exit: TIMEOUT },
      mountOnEnter: true,
      unmountOnExit: true,
      nodeRef: containerRef,
      children: (state) => {
        const childrenVisible = someItemVisible && state === "entered";
        return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: b({ hideVeil }, className), style, children: [
          /* @__PURE__ */ jsx(
            CSSTransition,
            {
              in: childrenVisible,
              timeout: TIMEOUT,
              unmountOnExit: true,
              classNames: b("veil-transition"),
              nodeRef: veilRef,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  ref: veilRef,
                  className: b("veil", { hidden: hideVeil }, veilClassName),
                  onClick: onVeilClick
                }
              )
            }
          ),
          React__default.Children.map(children, (child) => {
            if (React__default.isValidElement(child) && child.type === DrawerItem) {
              const childVisible = Boolean(child.props.visible);
              return React__default.cloneElement(child, {
                ...child.props,
                visible: childVisible && childrenVisible
              });
            }
            return child;
          })
        ] });
      }
    }
  );
  if (disablePortal) {
    return drawer;
  }
  return /* @__PURE__ */ jsx(Portal, { children: drawer });
};

export { Drawer, DrawerItem };
//# sourceMappingURL=Drawer.mjs.map
