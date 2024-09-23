import React__default from 'react';
import debounce_1 from '../../../node_modules/lodash/debounce.js';

const G_ROOT_CLASS_NAME = 'g-root';
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
const useAsideHeaderTopPanel = ({ topAlert, }) => {
    const topRef = React__default.useRef(null);
    const topHeight = useRefHeight(topRef);
    const setAsideTopPanelHeight = React__default.useCallback((clientHeight) => {
        const gRootElement = document
            .getElementsByClassName(G_ROOT_CLASS_NAME)
            .item(0);
        gRootElement === null || gRootElement === void 0 ? void 0 : gRootElement.style.setProperty('--gn-aside-top-panel-height', clientHeight + 'px');
    }, []);
    const updateTopSize = React__default.useCallback(() => {
        var _a;
        if (topRef.current) {
            setAsideTopPanelHeight(((_a = topRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0);
        }
    }, [topRef, setAsideTopPanelHeight]);
    React__default.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounce_1(updateTopSize, 200, { leading: true });
        if (topAlert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => {
            window.removeEventListener('resize', updateTopSizeDebounce);
            setAsideTopPanelHeight(0);
        };
    }, [topAlert, topHeight, topRef, updateTopSize, setAsideTopPanelHeight]);
    return {
        topRef,
        updateTopSize,
    };
};

export { useAsideHeaderTopPanel };
//# sourceMappingURL=useAsideHeaderTopPanel.js.map
