import * as React from 'react';

import {createBlock} from '../utils/cn';

import {useLayoutContext} from './LayoutContext';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './ItemList.module.scss';

const b = createBlock('aside-header-next-list', styles);

export interface DividerState extends Record<string, unknown> {
    compact: boolean;
}

export interface DividerProps {
    className?: string;
    render?: RenderProp<DividerState>;
    ref?: React.Ref<HTMLDivElement>;
}

/**
 * List separator. Split out of `Item` because it has no `id`, no `href` and no
 * behaviour — it never belonged in the row type.
 */
export function Divider(props: DividerProps) {
    const {className, render, ref} = props;
    const {compact} = useLayoutContext();

    return useRenderElement<DividerState>('div', {
        render,
        ref,
        state: {compact},
        props: [{className: b('divider', className), role: 'separator'}],
    });
}
