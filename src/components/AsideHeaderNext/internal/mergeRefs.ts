import type {Ref} from 'react';

type MaybeRef<T> = Ref<T> | undefined | null;

/**
 * Combines several refs into one callback ref. React 19-friendly: supports
 * cleanup functions returned from callback refs.
 */
export function mergeRefs<T>(refs: Array<MaybeRef<T>>): Ref<T> | undefined {
    const filtered = refs.filter((ref): ref is Ref<T> => Boolean(ref));

    if (filtered.length === 0) {
        return undefined;
    }

    if (filtered.length === 1) {
        return filtered[0];
    }

    return (node: T | null) => {
        const cleanups: Array<() => void> = [];

        for (const ref of filtered) {
            if (typeof ref === 'function') {
                const result = ref(node);
                if (typeof result === 'function') {
                    cleanups.push(result);
                }
            } else if (ref) {
                (ref as React.RefObject<T | null>).current = node;
            }
        }

        return () => {
            for (const cleanup of cleanups) {
                cleanup();
            }
            for (const ref of filtered) {
                if (ref && typeof ref !== 'function') {
                    (ref as React.RefObject<T | null>).current = null;
                }
            }
        };
    };
}
