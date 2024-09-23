'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const useForwardRef = (ref, initialValue = null) => {
    const targetRef = React__default["default"].useRef(initialValue);
    React__default["default"].useEffect(() => {
        if (!ref)
            return;
        if (typeof ref === 'function') {
            ref(targetRef.current);
        }
        else {
            ref.current = targetRef.current;
        }
    }, [ref]);
    return targetRef;
};

exports.useForwardRef = useForwardRef;
//# sourceMappingURL=useForwardRef.js.map
