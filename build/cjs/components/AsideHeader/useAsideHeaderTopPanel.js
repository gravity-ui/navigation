'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('../../node_modules/lodash/debounce.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const G_ROOT_CLASS_NAME = 'g-root';
const useRefHeight = (ref) => {
    const [topHeight, setTopHeight] = React__default["default"].useState(0);
    React__default["default"].useEffect(() => {
        if (ref.current) {
            const { current } = ref;
            setTopHeight(current.clientHeight);
        }
    }, [ref]);
    return topHeight;
};
const useAsideHeaderTopPanel = ({ topAlert, }) => {
    const topRef = React__default["default"].useRef(null);
    const topHeight = useRefHeight(topRef);
    const setAsideTopPanelHeight = React__default["default"].useCallback((clientHeight) => {
        const gRootElement = document
            .getElementsByClassName(G_ROOT_CLASS_NAME)
            .item(0);
        gRootElement === null || gRootElement === void 0 ? void 0 : gRootElement.style.setProperty('--gn-aside-top-panel-height', clientHeight + 'px');
    }, []);
    const updateTopSize = React__default["default"].useCallback(() => {
        var _a;
        if (topRef.current) {
            setAsideTopPanelHeight(((_a = topRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0);
        }
    }, [topRef, setAsideTopPanelHeight]);
    React__default["default"].useLayoutEffect(() => {
        const updateTopSizeDebounce = debounce["default"](updateTopSize, 200, { leading: true });
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

exports.useAsideHeaderTopPanel = useAsideHeaderTopPanel;
//# sourceMappingURL=useAsideHeaderTopPanel.js.map
