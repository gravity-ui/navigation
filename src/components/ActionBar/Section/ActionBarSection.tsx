import React, {PropsWithChildren} from 'react';

import {block} from '../../utils/cn';

import './ActionBarSection.scss';

export type Props = PropsWithChildren<{type?: 'primary' | 'secondary'}>;

const b = block('action-bar-section');

export const ActionBarSection = ({children, type = 'primary'}: Props) => {
    return (
        <div className={b({type})} role="menu">
            {children}
        </div>
    );
};

ActionBarSection.displayName = 'ActionBar.Section';
