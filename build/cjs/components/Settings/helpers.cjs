'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');

function useStableCallback(func) {
  const funcRef = index.reactExports.useRef();
  index.reactExports.useEffect(() => {
    funcRef.current = func;
    return () => {
      funcRef.current = void 0;
    };
  }, [func]);
  return index.reactExports.useCallback((...args) => {
    if (typeof funcRef.current === "function") {
      return funcRef.current(...args);
    }
    return void 0;
  }, []);
}
function useCurrent(value) {
  const ref = index.reactExports.useRef(value);
  ref.current = value;
  return index.reactExports.useCallback(() => ref.current, []);
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
//# sourceMappingURL=helpers.cjs.map
