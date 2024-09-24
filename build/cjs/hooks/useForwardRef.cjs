'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');

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

exports.useForwardRef = useForwardRef;
//# sourceMappingURL=useForwardRef.cjs.map
