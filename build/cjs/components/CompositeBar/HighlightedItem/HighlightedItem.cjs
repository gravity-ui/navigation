'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const debounce = require('../../../node_modules/lodash/debounce.cjs');
const AsideHeaderContext = require('../../AsideHeader/AsideHeaderContext.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                       */
const Portal = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Portal/Portal.cjs');

const b = cn.block("composite-bar-highlighted-item");
const DEBOUNCE_TIME = 200;
const HighlightedItem = ({
  iconRef,
  iconNode,
  onClick,
  onClickCapture
}) => {
  const { openModalSubscriber } = AsideHeaderContext.useAsideHeaderInnerContext();
  const [{ top, left, width, height }, setPosition] = index.reactExports.useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });
  const [isModalOpen, setIsModalOpen] = index.reactExports.useState(false);
  const handleResizeDebounced = index.reactExports.useMemo(
    () => debounce.default(
      () => {
        const {
          top: top2 = 0,
          left: left2 = 0,
          width: width2 = 0,
          height: height2 = 0
        } = iconRef?.current?.getBoundingClientRect() || {};
        setPosition({
          top: top2 + window.scrollY,
          left: left2 + window.scrollX,
          width: width2,
          height: height2
        });
      },
      DEBOUNCE_TIME,
      { leading: true }
    ),
    [iconRef]
  );
  const handleResize = index.reactExports.useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);
  index.reactExports.useEffect(() => {
    if (!isModalOpen) {
      return;
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize, isModalOpen]);
  openModalSubscriber?.((open) => {
    setIsModalOpen(open);
  });
  if (!iconNode || !isModalOpen) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Portal.Portal, { children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    "div",
    {
      className: b(),
      style: { left, top, width, height },
      onClick,
      onClickCapture,
      "data-toast": true,
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("icon"), children: iconNode })
    }
  ) });
};
HighlightedItem.displayName = "HighlightedItem";

exports.HighlightedItem = HighlightedItem;
//# sourceMappingURL=HighlightedItem.cjs.map
