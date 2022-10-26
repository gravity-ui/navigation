import * as React from 'react';

type AnyFunc = (...args: any[]) => any;

export function useStableCallback<T extends AnyFunc>(
    func: T,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
    const funcRef = React.useRef<T>();

    React.useEffect(() => {
        funcRef.current = func;
        return () => {
            funcRef.current = undefined;
        };
    }, [func]);

    return React.useCallback((...args: Parameters<T>) => {
        if (typeof funcRef.current === 'function') {
            return funcRef.current(...args);
        }
        return undefined;
    }, []);
}

export function useCurrent<T>(value: T) {
    const ref = React.useRef(value);
    ref.current = value;
    return React.useCallback(() => ref.current, []);
}

export function invariant(cond: boolean, message: string): void {
    if (!cond) {
        throw new Error(message);
    }
}

export function escapeStringForRegExp(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
