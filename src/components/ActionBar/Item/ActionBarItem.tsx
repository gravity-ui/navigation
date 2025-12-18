import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';
import {PropsWithPull} from '../types';

import styles from './ActionBarItem.module.scss';

export type Props = DOMProps &
    QAProps &
    PropsWithChildren<
        PropsWithPull<{
            spacing?: boolean;
        }>
    >;

const b = createBlock('action-bar-item', styles);

export const ActionBarItem = ({children, className, style, qa, pull, spacing = true}: Props) => {
    return (
        <li className={b({pull, spacing}, className)} style={style} role="menuitem" data-qa={qa}>
            {children}
        </li>
    );
};

ActionBarItem.displayName = 'ActionBar.Item';
