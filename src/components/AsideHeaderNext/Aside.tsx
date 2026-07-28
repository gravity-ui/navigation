import * as React from 'react';

import {createBlock} from '../utils/cn';

import styles from './AsideHeaderNext.module.scss';

const b = createBlock('aside-header-next', styles);

export interface AsideProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLElement>;
}

/**
 * Explicit navigation column for `layout="manual"`. In `layout="slots"` the
 * aside is created implicitly by `Root`, so this component is optional there.
 */
export function Aside(props: AsideProps) {
    const {children, className, ref} = props;

    return (
        <aside ref={ref} className={b('aside', className)}>
            <div className={b('aside-content')}>{children}</div>
        </aside>
    );
}
