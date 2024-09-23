'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

function useStableCallback(func) {
    const funcRef = React__namespace.useRef();
    React__namespace.useEffect(() => {
        funcRef.current = func;
        return () => {
            funcRef.current = undefined;
        };
    }, [func]);
    return React__namespace.useCallback((...args) => {
        if (typeof funcRef.current === 'function') {
            return funcRef.current(...args);
        }
        return undefined;
    }, []);
}
function useCurrent(value) {
    const ref = React__namespace.useRef(value);
    ref.current = value;
    return React__namespace.useCallback(() => ref.current, []);
}
function invariant(cond, message) {
    if (!cond) {
        throw new Error(message);
    }
}
function escapeStringForRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.escapeStringForRegExp = escapeStringForRegExp;
exports.invariant = invariant;
exports.useCurrent = useCurrent;
exports.useStableCallback = useStableCallback;
//# sourceMappingURL=helpers.js.map
