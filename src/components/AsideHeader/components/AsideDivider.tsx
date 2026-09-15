import React from 'react';

interface AsideDividerProps extends React.HTMLAttributes<HTMLElement> {
    transitionId: string;
    as?: 'div' | 'span';
}

// Common registration for every built-in horizontal aside separator.
export function AsideDivider({transitionId, as: Component = 'span', ...props}: AsideDividerProps) {
    return <Component {...props} data-gn-aside-divider={transitionId} aria-hidden="true" />;
}
