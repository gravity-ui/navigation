'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var CSSTransition = require('../../node_modules/react-transition-group/esm/CSSTransition.js');
require('../../node_modules/react-transition-group/esm/ReplaceTransition.js');
require('../../node_modules/react-transition-group/esm/SwitchTransition.js');
require('../../node_modules/react-transition-group/esm/TransitionGroup.js');
var Transition = require('../../node_modules/react-transition-group/esm/Transition.js');
var cn = require('../utils/cn.js');
var utils = require('./utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('drawer');
const TIMEOUT = 300;
const DrawerItem = React__default["default"].forwardRef(function DrawerItem(props, ref) {
    const { visible, content, children, direction = 'left', className, resizable, width, minResizeWidth, maxResizeWidth, onResize, } = props;
    const itemRef = React__default["default"].useRef(null);
    const handleRef = uikit.useForkRef(ref, itemRef);
    const cssDirection = direction === 'left' ? undefined : direction;
    const { resizedWidth, resizerHandlers } = utils.useResizableDrawerItem({
        direction,
        width,
        minResizeWidth,
        maxResizeWidth,
        onResize,
    });
    const resizerElement = resizable ? (React__default["default"].createElement("div", Object.assign({ className: b('resizer', { direction }) }, resizerHandlers),
        React__default["default"].createElement("div", { className: b('resizer-handle') }))) : null;
    return (React__default["default"].createElement(CSSTransition["default"], { in: visible, timeout: TIMEOUT, unmountOnExit: true, classNames: b('item-transition', { direction: cssDirection }), nodeRef: itemRef },
        React__default["default"].createElement("div", { ref: handleRef, className: b('item', { direction: cssDirection }, className), style: { width: resizable ? `${resizedWidth}px` : undefined } },
            resizerElement, children !== null && children !== void 0 ? children : content)));
});
const Drawer = ({ className, veilClassName, children, style, onVeilClick, onEscape, preventScrollBody = true, hideVeil, disablePortal = true, }) => {
    let someItemVisible = false;
    React__default["default"].Children.forEach(children, (child) => {
        if (React__default["default"].isValidElement(child) && child.type === DrawerItem) {
            const childVisible = Boolean(child.props.visible);
            if (childVisible) {
                someItemVisible = true;
            }
        }
    });
    React__default["default"].useEffect(() => {
        function onKeyDown(event) {
            if (event.key === 'Escape') {
                onEscape === null || onEscape === void 0 ? void 0 : onEscape();
            }
        }
        if (someItemVisible) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onEscape, someItemVisible]);
    uikit.useBodyScrollLock({ enabled: preventScrollBody && someItemVisible });
    const containerRef = React__default["default"].useRef(null);
    const veilRef = React__default["default"].useRef(null);
    const drawer = (React__default["default"].createElement(Transition["default"], { in: someItemVisible, timeout: { enter: 0, exit: TIMEOUT }, mountOnEnter: true, unmountOnExit: true, nodeRef: containerRef }, (state) => {
        const childrenVisible = someItemVisible && state === 'entered';
        return (React__default["default"].createElement("div", { ref: containerRef, className: b({ hideVeil }, className), style: style },
            React__default["default"].createElement(CSSTransition["default"], { in: childrenVisible, timeout: TIMEOUT, unmountOnExit: true, classNames: b('veil-transition'), nodeRef: veilRef },
                React__default["default"].createElement("div", { ref: veilRef, className: b('veil', { hidden: hideVeil }, veilClassName), onClick: onVeilClick })),
            React__default["default"].Children.map(children, (child) => {
                if (React__default["default"].isValidElement(child) &&
                    child.type === DrawerItem) {
                    const childVisible = Boolean(child.props.visible);
                    return React__default["default"].cloneElement(child, Object.assign(Object.assign({}, child.props), { visible: childVisible && childrenVisible }));
                }
                return child;
            })));
    }));
    if (disablePortal) {
        return drawer;
    }
    return React__default["default"].createElement(uikit.Portal, null, drawer);
};

exports.Drawer = Drawer;
exports.DrawerItem = DrawerItem;
//# sourceMappingURL=Drawer.js.map
