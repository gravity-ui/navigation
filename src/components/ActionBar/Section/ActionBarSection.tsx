import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';

import './ActionBarSection.scss';

export type Props = DOMProps & QAProps & PropsWithChildren<{type?: 'primary' | 'secondary'}>;

const b = block('action-bar-section');

export const ActionBarSection = ({children, className, style, qa, type = 'primary'}: Props) => {
    return (
        <div className={b({type}, className)} style={style} role="menu" data-qa={qa}>
            {children}
        </div>
    );
};

ActionBarSection.displayName = 'ActionBar.Section';
