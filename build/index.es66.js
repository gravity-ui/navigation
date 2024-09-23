import * as React from 'react';

function useStableCallback(func) {
  const funcRef = React.useRef();
  React.useEffect(() => {
    funcRef.current = func;
    return () => {
      funcRef.current = void 0;
    };
  }, [func]);
  return React.useCallback((...args) => {
    if (typeof funcRef.current === "function") {
      return funcRef.current(...args);
    }
    return void 0;
  }, []);
}
function useCurrent(value) {
  const ref = React.useRef(value);
  ref.current = value;
  return React.useCallback(() => ref.current, []);
}
function invariant(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}
function escapeStringForRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { escapeStringForRegExp, invariant, useCurrent, useStableCallback };
//# sourceMappingURL=index.es66.js.map
