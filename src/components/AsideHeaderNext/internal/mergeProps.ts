type AnyProps = Record<string, any>;

const isEventHandler = (key: string, value: unknown): value is (...args: any[]) => void =>
    /^on[A-Z]/.test(key) && typeof value === 'function';

/**
 * Merges several prop objects into one, base-ui style:
 * - event handlers are chained (earlier first, then later);
 * - `className` strings are joined;
 * - `style` objects are shallow-merged;
 * - everything else: later sources overwrite earlier ones.
 */
export function mergeProps<T extends AnyProps = AnyProps>(
    ...parts: Array<AnyProps | undefined>
): T {
    const result: AnyProps = {};

    for (const part of parts) {
        if (!part) {
            continue;
        }

        for (const key of Object.keys(part)) {
            const value = part[key];
            const existing = result[key];

            if (key === 'className') {
                result[key] = [existing, value].filter(Boolean).join(' ') || undefined;
            } else if (key === 'style') {
                result[key] = {...(existing as object), ...(value as object)};
            } else if (isEventHandler(key, value) && typeof existing === 'function') {
                const prev = existing as (...args: any[]) => void;
                result[key] = (...args: any[]) => {
                    prev(...args);
                    return value(...args);
                };
            } else {
                result[key] = value;
            }
        }
    }

    return result as T;
}
