import * as React from 'react';

import {mergeProps} from './mergeProps';
import {mergeRefs} from './mergeRefs';

type AnyProps = Record<string, any>;

/**
 * A `render` prop value: either a React element to compose with, or a function
 * that receives merged props (and component state) and returns an element.
 */
export type RenderProp<State = Record<string, unknown>> =
    | React.ReactElement<AnyProps>
    | ((props: AnyProps, state: State) => React.ReactElement);

export interface UseRenderElementParams<State> {
    /** Replace/compose the rendered element. */
    render?: RenderProp<State>;
    /** Refs to attach to the rendered element (merged together). */
    ref?: React.Ref<any> | Array<React.Ref<any> | undefined>;
    /** Component state, exposed to the `render` function. */
    state?: State;
    /** Prop sources, merged left-to-right (see {@link mergeProps}). */
    props?: Array<AnyProps | undefined>;
}

/**
 * Core rendering primitive (port of base-ui `useRenderElement`). Every
 * AsideHeaderNext subcomponent renders through this so customization is a
 * single, consistent `render` prop instead of ad-hoc wrapper callbacks.
 *
 * React 19: `ref` is just a prop, so no `forwardRef` is needed by callers.
 */
export function useRenderElement<State extends Record<string, unknown> = Record<string, unknown>>(
    defaultTag: React.ElementType,
    params: UseRenderElementParams<State>,
): React.ReactElement {
    const {render, ref, state = {} as State, props = []} = params;

    const merged = mergeProps(...props);

    const ownRefs = Array.isArray(ref) ? ref : [ref];

    if (typeof render === 'function') {
        const finalRef = mergeRefs(ownRefs);
        return render(finalRef ? {...merged, ref: finalRef} : merged, state);
    }

    if (React.isValidElement(render)) {
        const renderProps = render.props as AnyProps;
        const finalProps = mergeProps(merged, renderProps);
        const finalRef = mergeRefs([...ownRefs, renderProps.ref]);
        if (finalRef) {
            finalProps.ref = finalRef;
        }
        return React.cloneElement(render, finalProps);
    }

    const finalRef = mergeRefs(ownRefs);
    if (finalRef) {
        merged.ref = finalRef;
    }

    return React.createElement(defaultTag, merged);
}
