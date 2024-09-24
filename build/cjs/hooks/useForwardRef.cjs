'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../node_modules/react/index.cjs');

const useForwardRef = (ref, initialValue = null) => {
  const targetRef = index.default.useRef(initialValue);
  index.default.useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);
  return targetRef;
};

exports.useForwardRef = useForwardRef;
//# sourceMappingURL=useForwardRef.cjs.map
