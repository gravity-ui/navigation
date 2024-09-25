import React__default from 'react';
import debounceFn from 'lodash/debounce';

const G_ROOT_CLASS_NAME = "g-root";
const useRefHeight = (ref) => {
  const [topHeight, setTopHeight] = React__default.useState(0);
  React__default.useEffect(() => {
    if (ref.current) {
      const { current } = ref;
      setTopHeight(current.clientHeight);
    }
  }, [ref]);
  return topHeight;
};
const useAsideHeaderTopPanel = ({
  topAlert
}) => {
  const topRef = React__default.useRef(null);
  const topHeight = useRefHeight(topRef);
  const setAsideTopPanelHeight = React__default.useCallback((clientHeight) => {
    const gRootElement = document.getElementsByClassName(G_ROOT_CLASS_NAME).item(0);
    gRootElement?.style.setProperty("--gn-aside-top-panel-height", clientHeight + "px");
  }, []);
  const updateTopSize = React__default.useCallback(() => {
    if (topRef.current) {
      setAsideTopPanelHeight(topRef.current?.clientHeight || 0);
    }
  }, [topRef, setAsideTopPanelHeight]);
  React__default.useLayoutEffect(() => {
    const updateTopSizeDebounce = debounceFn(updateTopSize, 200, { leading: true });
    if (topAlert) {
      window.addEventListener("resize", updateTopSizeDebounce);
      updateTopSizeDebounce();
    }
    return () => {
      window.removeEventListener("resize", updateTopSizeDebounce);
      setAsideTopPanelHeight(0);
    };
  }, [topAlert, topHeight, topRef, updateTopSize, setAsideTopPanelHeight]);
  return {
    topRef,
    updateTopSize
  };
};

export { useAsideHeaderTopPanel };
//# sourceMappingURL=useAsideHeaderTopPanel.mjs.map
