import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React from '../../node_modules/react/index.mjs';
import { block } from '../utils/cn.mjs';
import { useResizableDrawerItem } from './utils.mjs';
/* empty css             */
import CSSTransition from '../../node_modules/react-transition-group/esm/CSSTransition.mjs';
import Transition from '../../node_modules/react-transition-group/esm/Transition.mjs';
import { useForkRef } from '../../node_modules/@gravity-ui/uikit/build/esm/hooks/useForkRef/useForkRef.mjs';
import { useBodyScrollLock } from '../../node_modules/@gravity-ui/uikit/build/esm/hooks/useBodyScrollLock/useBodyScrollLock.mjs';
import { Portal } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Portal/Portal.mjs';

const b = block("drawer");
const TIMEOUT = 300;
const DrawerItem = React.forwardRef(
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
    const itemRef = React.useRef(null);
    const handleRef = useForkRef(ref, itemRef);
    const cssDirection = direction === "left" ? void 0 : direction;
    const { resizedWidth, resizerHandlers } = useResizableDrawerItem({
      direction,
      width,
      minResizeWidth,
      maxResizeWidth,
      onResize
    });
    const resizerElement = resizable ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("resizer", { direction }), ...resizerHandlers, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("resizer-handle") }) }) : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CSSTransition,
      {
        in: visible,
        timeout: TIMEOUT,
        unmountOnExit: true,
        classNames: b("item-transition", { direction: cssDirection }),
        nodeRef: itemRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === DrawerItem) {
      const childVisible = Boolean(child.props.visible);
      if (childVisible) {
        someItemVisible = true;
      }
    }
  });
  React.useEffect(() => {
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
  const containerRef = React.useRef(null);
  const veilRef = React.useRef(null);
  const drawer = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Transition,
    {
      in: someItemVisible,
      timeout: { enter: 0, exit: TIMEOUT },
      mountOnEnter: true,
      unmountOnExit: true,
      nodeRef: containerRef,
      children: (state) => {
        const childrenVisible = someItemVisible && state === "entered";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: b({ hideVeil }, className), style, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CSSTransition,
            {
              in: childrenVisible,
              timeout: TIMEOUT,
              unmountOnExit: true,
              classNames: b("veil-transition"),
              nodeRef: veilRef,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  ref: veilRef,
                  className: b("veil", { hidden: hideVeil }, veilClassName),
                  onClick: onVeilClick
                }
              )
            }
          ),
          React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === DrawerItem) {
              const childVisible = Boolean(child.props.visible);
              return React.cloneElement(child, {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: drawer });
};

export { Drawer, DrawerItem };
//# sourceMappingURL=Drawer.mjs.map
