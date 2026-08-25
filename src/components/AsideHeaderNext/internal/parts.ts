import * as React from 'react';

/**
 * Same mechanism as `slots`, but for compound sub-parts (`Popup.Trigger`,
 * `GroupItem.Content`, …): the marker lives on the component type, so it
 * survives minification and cannot be forged by a `displayName` collision.
 */
const PART = Symbol('AsideHeaderNext.part');

type WithPart = {[PART]?: string};

export function withPart<C extends React.ElementType>(Component: C, part: string): C {
    // eslint-disable-next-line no-param-reassign
    (Component as WithPart)[PART] = part;
    return Component;
}

export function getPart(child: React.ReactNode): string | undefined {
    if (!React.isValidElement(child)) {
        return undefined;
    }
    return (child.type as WithPart)[PART];
}

/**
 * Splits children into named parts. Anything unmarked lands in `rest`, so
 * plain content still renders instead of silently disappearing.
 */
export function collectParts(children: React.ReactNode): {
    parts: Record<string, React.ReactNode>;
    rest: React.ReactNode[];
} {
    const parts: Record<string, React.ReactNode> = {};
    const rest: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
        if (child === null || child === undefined || child === false) {
            return;
        }
        const part = getPart(child);
        if (part) {
            parts[part] = child;
        } else {
            rest.push(child);
        }
    });

    return {parts, rest};
}
