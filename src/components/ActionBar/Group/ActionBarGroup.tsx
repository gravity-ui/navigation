import React, {PropsWithChildren} from 'react';

import {block} from '../../utils/cn';
import {PropsWithPull} from '../types';

import './ActionBarGroup.scss';

export type Props = PropsWithChildren<
    PropsWithPull<{
        className?: string;
        stretchContainer?: boolean;
    }>
>;

const b = block('action-bar-group');

export const ActionBarGroup = ({children, className, pull, stretchContainer}: Props) => {
    return (
        <ul className={b({pull, 'stretch-container': stretchContainer}, className)} role="group">
            {children}
        </ul>
    );
};

ActionBarGroup.displayName = 'ActionBar.Group';
