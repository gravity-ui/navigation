import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { r as reactExports } from '../../../node_modules/react/index.mjs';
import debounceFn from '../../../node_modules/lodash/debounce.mjs';
import { useAsideHeaderInnerContext } from '../../AsideHeader/AsideHeaderContext.mjs';
import { block } from '../../utils/cn.mjs';
/* empty css                      */
import { Portal } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Portal/Portal.mjs';

const b = block("composite-bar-highlighted-item");
const DEBOUNCE_TIME = 200;
const HighlightedItem = ({
  iconRef,
  iconNode,
  onClick,
  onClickCapture
}) => {
  const { openModalSubscriber } = useAsideHeaderInnerContext();
  const [{ top, left, width, height }, setPosition] = reactExports.useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const handleResizeDebounced = reactExports.useMemo(
    () => debounceFn(
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
  const handleResize = reactExports.useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: b(),
      style: { left, top, width, height },
      onClick,
      onClickCapture,
      "data-toast": true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("icon"), children: iconNode })
    }
  ) });
};
HighlightedItem.displayName = "HighlightedItem";

export { HighlightedItem };
//# sourceMappingURL=HighlightedItem.mjs.map
