'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');
const debounce = require('../../node_modules/lodash/debounce.cjs');

const G_ROOT_CLASS_NAME = "g-root";
const useRefHeight = (ref) => {
  const [topHeight, setTopHeight] = index.default.useState(0);
  index.default.useEffect(() => {
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
  const topRef = index.default.useRef(null);
  const topHeight = useRefHeight(topRef);
  const setAsideTopPanelHeight = index.default.useCallback((clientHeight) => {
    const gRootElement = document.getElementsByClassName(G_ROOT_CLASS_NAME).item(0);
    gRootElement?.style.setProperty("--gn-aside-top-panel-height", clientHeight + "px");
  }, []);
  const updateTopSize = index.default.useCallback(() => {
    if (topRef.current) {
      setAsideTopPanelHeight(topRef.current?.clientHeight || 0);
    }
  }, [topRef, setAsideTopPanelHeight]);
  index.default.useLayoutEffect(() => {
    const updateTopSizeDebounce = debounce.default(updateTopSize, 200, { leading: true });
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

exports.useAsideHeaderTopPanel = useAsideHeaderTopPanel;
//# sourceMappingURL=useAsideHeaderTopPanel.cjs.map
