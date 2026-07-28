import * as React from 'react';

import {useLayoutContext} from './LayoutContext';
import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

export interface ContentState extends Record<string, unknown> {
    size: number;
    compact: boolean;
}

export interface ContentProps {
    children?: React.ReactNode;
    className?: string;
    render?: RenderProp<ContentState>;
    ref?: React.Ref<HTMLDivElement>;
}

function ContentComponent(props: ContentProps) {
    const {children, className, render, ref} = props;
    const {size, compact} = useLayoutContext();

    return useRenderElement<ContentState>('div', {
        render,
        ref,
        state: {size, compact},
        props: [{className, children}],
    });
}

export const Content = withSlot(ContentComponent, 'content');
