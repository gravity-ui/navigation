import React__default from 'react';

const useForwardRef = (ref, initialValue = null) => {
    const targetRef = React__default.useRef(initialValue);
    React__default.useEffect(() => {
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

export { useForwardRef };
//# sourceMappingURL=useForwardRef.js.map
