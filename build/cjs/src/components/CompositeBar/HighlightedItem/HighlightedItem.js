'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var debounce = require('../../../../node_modules/lodash/debounce.js');
var AsideHeaderContext = require('../../AsideHeader/AsideHeaderContext.js');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('composite-bar-highlighted-item');
const DEBOUNCE_TIME = 200;
const HighlightedItem = ({ iconRef, iconNode, onClick, onClickCapture, }) => {
    const { openModalSubscriber } = AsideHeaderContext.useAsideHeaderInnerContext();
    const [{ top, left, width, height }, setPosition] = React.useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const handleResizeDebounced = React.useMemo(() => debounce["default"](() => {
        var _a;
        const { top = 0, left = 0, width = 0, height = 0, } = ((_a = iconRef === null || iconRef === void 0 ? void 0 : iconRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || {};
        setPosition({
            top: top + window.scrollY,
            left: left + window.scrollX,
            width,
            height,
        });
    }, DEBOUNCE_TIME, { leading: true }), [iconRef]);
    const handleResize = React.useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);
    React.useEffect(() => {
        if (!isModalOpen) {
            return;
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize, isModalOpen]);
    openModalSubscriber === null || openModalSubscriber === void 0 ? void 0 : openModalSubscriber((open) => {
        setIsModalOpen(open);
    });
    if (!iconNode || !isModalOpen) {
        return null;
    }
    return (React__default["default"].createElement(uikit.Portal, null,
        React__default["default"].createElement("div", { className: b(), style: { left, top, width, height }, onClick: onClick, onClickCapture: onClickCapture, "data-toast": true },
            React__default["default"].createElement("div", { className: b('icon') }, iconNode))));
};
HighlightedItem.displayName = 'HighlightedItem';

exports.HighlightedItem = HighlightedItem;
//# sourceMappingURL=HighlightedItem.js.map
