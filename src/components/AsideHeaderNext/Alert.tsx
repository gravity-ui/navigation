import * as React from 'react';

import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

export interface AlertState extends Record<string, unknown> {}

export interface AlertProps {
    /** Banner content. Compose your own alert (uikit `Alert`, custom markup, etc.). */
    children?: React.ReactNode;
    className?: string;
    render?: RenderProp<AlertState>;
    ref?: React.Ref<HTMLDivElement>;
}

/**
 * Banner rendered above the navigation/content. Replaces the old `topAlert` prop:
 * instead of a fixed config object you compose any content you want.
 */
function AlertComponent(props: AlertProps) {
    const {children, className, render, ref} = props;

    return useRenderElement<AlertState>('div', {
        render,
        ref,
        state: {},
        props: [{className, children}],
    });
}

export const Alert = withSlot(AlertComponent, 'alert');
