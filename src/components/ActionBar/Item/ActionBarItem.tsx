import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {PropsWithPull} from '../types';

import './ActionBarItem.scss';

export type Props = DOMProps &
    QAProps &
    PropsWithChildren<
        PropsWithPull<{
            spacing?: boolean;
        }>
    >;

const b = block('action-bar-item');

export const ActionBarItem = ({children, className, style, qa, pull, spacing = true}: Props) => {
    return (
        <li className={b({pull, spacing}, className)} style={style} role="menuitem" data-qa={qa}>
            {children}
        </li>
    );
};

ActionBarItem.displayName = 'ActionBar.Item';
