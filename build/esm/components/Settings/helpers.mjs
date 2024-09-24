import { r as reactExports } from '../../node_modules/react/index.mjs';

function useStableCallback(func) {
  const funcRef = reactExports.useRef();
  reactExports.useEffect(() => {
    funcRef.current = func;
    return () => {
      funcRef.current = void 0;
    };
  }, [func]);
  return reactExports.useCallback((...args) => {
    if (typeof funcRef.current === "function") {
      return funcRef.current(...args);
    }
    return void 0;
  }, []);
}
function useCurrent(value) {
  const ref = reactExports.useRef(value);
  ref.current = value;
  return reactExports.useCallback(() => ref.current, []);
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
//# sourceMappingURL=helpers.mjs.map
