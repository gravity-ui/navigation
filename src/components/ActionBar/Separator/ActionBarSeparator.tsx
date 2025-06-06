import React from 'react';

import {createBlock} from '../../utils/cn';

import styles from './ActionBarSeparator.scss';

const b = createBlock('action-bar-separator', styles);

export const ActionBarSeparator = () => {
    return <li role="separator" className={b()} aria-hidden />;
};

ActionBarSeparator.displayName = 'ActionBar.Separator';
