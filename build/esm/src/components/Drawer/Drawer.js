import React__default from 'react';
import { useForkRef, useBodyScrollLock, Portal } from '@gravity-ui/uikit';
import CSSTransition from '../../../node_modules/react-transition-group/esm/CSSTransition.js';
import '../../../node_modules/react-transition-group/esm/ReplaceTransition.js';
import '../../../node_modules/react-transition-group/esm/SwitchTransition.js';
import '../../../node_modules/react-transition-group/esm/TransitionGroup.js';
import Transition from '../../../node_modules/react-transition-group/esm/Transition.js';
import { block } from '../utils/cn.js';
import { useResizableDrawerItem } from './utils.js';

const b = block('drawer');
const TIMEOUT = 300;
const DrawerItem = React__default.forwardRef(function DrawerItem(props, ref) {
    const { visible, content, children, direction = 'left', className, resizable, width, minResizeWidth, maxResizeWidth, onResize, } = props;
    const itemRef = React__default.useRef(null);
    const handleRef = useForkRef(ref, itemRef);
    const cssDirection = direction === 'left' ? undefined : direction;
    const { resizedWidth, resizerHandlers } = useResizableDrawerItem({
        direction,
        width,
        minResizeWidth,
        maxResizeWidth,
        onResize,
    });
    const resizerElement = resizable ? (React__default.createElement("div", Object.assign({ className: b('resizer', { direction }) }, resizerHandlers),
        React__default.createElement("div", { className: b('resizer-handle') }))) : null;
    return (React__default.createElement(CSSTransition, { in: visible, timeout: TIMEOUT, unmountOnExit: true, classNames: b('item-transition', { direction: cssDirection }), nodeRef: itemRef },
        React__default.createElement("div", { ref: handleRef, className: b('item', { direction: cssDirection }, className), style: { width: resizable ? `${resizedWidth}px` : undefined } },
            resizerElement, children !== null && children !== void 0 ? children : content)));
});
const Drawer = ({ className, veilClassName, children, style, onVeilClick, onEscape, preventScrollBody = true, hideVeil, disablePortal = true, }) => {
    let someItemVisible = false;
    React__default.Children.forEach(children, (child) => {
        if (React__default.isValidElement(child) && child.type === DrawerItem) {
            const childVisible = Boolean(child.props.visible);
            if (childVisible) {
                someItemVisible = true;
            }
        }
    });
    React__default.useEffect(() => {
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
    useBodyScrollLock({ enabled: preventScrollBody && someItemVisible });
    const containerRef = React__default.useRef(null);
    const veilRef = React__default.useRef(null);
    const drawer = (React__default.createElement(Transition, { in: someItemVisible, timeout: { enter: 0, exit: TIMEOUT }, mountOnEnter: true, unmountOnExit: true, nodeRef: containerRef }, (state) => {
        const childrenVisible = someItemVisible && state === 'entered';
        return (React__default.createElement("div", { ref: containerRef, className: b({ hideVeil }, className), style: style },
            React__default.createElement(CSSTransition, { in: childrenVisible, timeout: TIMEOUT, unmountOnExit: true, classNames: b('veil-transition'), nodeRef: veilRef },
                React__default.createElement("div", { ref: veilRef, className: b('veil', { hidden: hideVeil }, veilClassName), onClick: onVeilClick })),
            React__default.Children.map(children, (child) => {
                if (React__default.isValidElement(child) &&
                    child.type === DrawerItem) {
                    const childVisible = Boolean(child.props.visible);
                    return React__default.cloneElement(child, Object.assign(Object.assign({}, child.props), { visible: childVisible && childrenVisible }));
                }
                return child;
            })));
    }));
    if (disablePortal) {
        return drawer;
    }
    return React__default.createElement(Portal, null, drawer);
};

export { Drawer, DrawerItem };
//# sourceMappingURL=Drawer.js.map
