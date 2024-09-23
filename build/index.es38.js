import { jsx } from 'react/jsx-runtime';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Portal } from '@gravity-ui/uikit';
import debounceFn from './index.es96.js';
import { useAsideHeaderInnerContext } from './index.es3.js';
import { block } from './index.es24.js';
/* empty css           */

const b = block("composite-bar-highlighted-item");
const DEBOUNCE_TIME = 200;
const HighlightedItem = ({
  iconRef,
  iconNode,
  onClick,
  onClickCapture
}) => {
  const { openModalSubscriber } = useAsideHeaderInnerContext();
  const [{ top, left, width, height }, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleResizeDebounced = useMemo(
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
  const handleResize = useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(
    "div",
    {
      className: b(),
      style: { left, top, width, height },
      onClick,
      onClickCapture,
      "data-toast": true,
      children: /* @__PURE__ */ jsx("div", { className: b("icon"), children: iconNode })
    }
  ) });
};
HighlightedItem.displayName = "HighlightedItem";

export { HighlightedItem };
//# sourceMappingURL=index.es38.js.map
