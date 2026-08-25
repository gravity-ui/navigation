import * as React from 'react';

import {useLayoutContext} from './LayoutContext';

export interface VisibilityProps {
    children?: React.ReactNode;
}

/**
 * Render gates for the case CSS cannot cover: when the collapsed rail needs
 * *different* content, not the same content narrower.
 */
export function WhenCompact({children}: VisibilityProps) {
    const {compact} = useLayoutContext();
    return compact ? <React.Fragment>{children}</React.Fragment> : null;
}

export function WhenExpanded({children}: VisibilityProps) {
    const {compact} = useLayoutContext();
    return compact ? null : <React.Fragment>{children}</React.Fragment>;
}
