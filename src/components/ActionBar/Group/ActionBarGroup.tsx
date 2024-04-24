import React, {PropsWithChildren} from 'react';

import {block} from '../../utils/cn';
import {PropsWithPull} from '../types';

import './ActionBarGroup.scss';

export type Props = PropsWithChildren<
    PropsWithPull<{
        className?: string;
    }>
>;

const b = block('action-bar-group');

export const ActionBarGroup = ({children, className, pull}: Props) => {
    return <ul className={b({pull}, className)}>{children}</ul>;
};

ActionBarGroup.displayName = 'ActionBar.Group';
