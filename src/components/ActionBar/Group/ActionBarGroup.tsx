import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';
import {PropsWithPull} from '../types';

import styles from './ActionBarGroup.scss';

export type Props = DOMProps &
    QAProps &
    PropsWithChildren<
        PropsWithPull<{
            stretchContainer?: boolean;
        }>
    >;

const b = createBlock('action-bar-group', styles);

export const ActionBarGroup = ({children, className, style, qa, pull, stretchContainer}: Props) => {
    return (
        <ul
            className={b({pull, 'stretch-container': stretchContainer}, className)}
            role="group"
            style={style}
            data-qa={qa}
        >
            {children}
        </ul>
    );
};

ActionBarGroup.displayName = 'ActionBar.Group';
