import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';

import styles from './ActionBarSection.module.scss';

export type Props = DOMProps & QAProps & PropsWithChildren<{type?: 'primary' | 'secondary'}>;

const b = createBlock('action-bar-section', styles);

export const ActionBarSection = ({children, className, style, qa, type = 'primary'}: Props) => {
    return (
        <div className={b({type}, className)} style={style} role="menu" data-qa={qa}>
            {children}
        </div>
    );
};

ActionBarSection.displayName = 'ActionBar.Section';
