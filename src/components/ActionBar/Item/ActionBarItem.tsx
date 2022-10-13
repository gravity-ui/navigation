import React, {PropsWithChildren} from 'react';

import {block} from '../../utils/cn';
import {PropsWithPull} from '../types';

import './ActionBarItem.scss';

export type Props = PropsWithChildren<
    PropsWithPull<{
        spacing?: boolean;
        className?: string;
    }>
>;

const b = block('action-bar-item');

export const ActionBarItem = ({children, className, pull, spacing = true}: Props) => {
    return <li className={b({pull, spacing}, className)}>{children}</li>;
};

ActionBarItem.displayName = 'ActionBar.Item';
