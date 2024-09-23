'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const utils = require('./index.cjs43.js');
;/* empty css             */
const CSSTransition = require('./index.cjs45.js');
const Transition = require('./index.cjs46.js');

const b = cn.block("drawer");
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
    const handleRef = uikit.useForkRef(ref, itemRef);
    const cssDirection = direction === "left" ? void 0 : direction;
    const { resizedWidth, resizerHandlers } = utils.useResizableDrawerItem({
      direction,
      width,
      minResizeWidth,
      maxResizeWidth,
      onResize
    });
    const resizerElement = resizable ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("resizer", { direction }), ...resizerHandlers, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("resizer-handle") }) }) : null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      CSSTransition.default,
      {
        in: visible,
        timeout: TIMEOUT,
        unmountOnExit: true,
        classNames: b("item-transition", { direction: cssDirection }),
        nodeRef: itemRef,
        children: /* @__PURE__ */ jsxRuntime.jsxs(
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
  uikit.useBodyScrollLock({ enabled: preventScrollBody && someItemVisible });
  const containerRef = React.useRef(null);
  const veilRef = React.useRef(null);
  const drawer = /* @__PURE__ */ jsxRuntime.jsx(
    Transition.default,
    {
      in: someItemVisible,
      timeout: { enter: 0, exit: TIMEOUT },
      mountOnEnter: true,
      unmountOnExit: true,
      nodeRef: containerRef,
      children: (state) => {
        const childrenVisible = someItemVisible && state === "entered";
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: containerRef, className: b({ hideVeil }, className), style, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            CSSTransition.default,
            {
              in: childrenVisible,
              timeout: TIMEOUT,
              unmountOnExit: true,
              classNames: b("veil-transition"),
              nodeRef: veilRef,
              children: /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(uikit.Portal, { children: drawer });
};

exports.Drawer = Drawer;
exports.DrawerItem = DrawerItem;
//# sourceMappingURL=index.cjs8.js.map
