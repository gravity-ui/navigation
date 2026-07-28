import * as React from 'react';

import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

export interface BackgroundState extends Record<string, unknown> {}

export interface BackgroundProps {
    /** Custom background element (e.g. an `<img>` or gradient `<div>`). */
    children?: React.ReactNode;
    className?: string;
    render?: RenderProp<BackgroundState>;
    ref?: React.Ref<HTMLDivElement>;
}

function BackgroundComponent(props: BackgroundProps) {
    const {children, className, render, ref} = props;

    return useRenderElement<BackgroundState>('div', {
        render,
        ref,
        state: {},
        props: [{className, children}],
    });
}

export const Background = withSlot(BackgroundComponent, 'background');
