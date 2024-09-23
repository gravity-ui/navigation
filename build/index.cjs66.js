'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');

function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
        for (const k in e) {
            if (k !== 'default') {
                const d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: () => e[k]
                });
            }
        }
    }
    n.default = e;
    return Object.freeze(n);
}

const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

function useStableCallback(func) {
  const funcRef = React__namespace.useRef();
  React__namespace.useEffect(() => {
    funcRef.current = func;
    return () => {
      funcRef.current = void 0;
    };
  }, [func]);
  return React__namespace.useCallback((...args) => {
    if (typeof funcRef.current === "function") {
      return funcRef.current(...args);
    }
    return void 0;
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
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.escapeStringForRegExp = escapeStringForRegExp;
exports.invariant = invariant;
exports.useCurrent = useCurrent;
exports.useStableCallback = useStableCallback;
//# sourceMappingURL=index.cjs66.js.map
