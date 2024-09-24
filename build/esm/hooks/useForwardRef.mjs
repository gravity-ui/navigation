import React from '../node_modules/react/index.mjs';

const useForwardRef = (ref, initialValue = null) => {
  const targetRef = React.useRef(initialValue);
  React.useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);
  return targetRef;
};

export { useForwardRef };
//# sourceMappingURL=useForwardRef.mjs.map
