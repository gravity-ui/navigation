import React from 'react';

import {block} from '../../utils/cn';

import './ActionBarSeparator.scss';

const b = block('action-bar-separator');

export const ActionBarSeparator = () => {
    return <li role="separator" className={b()} aria-hidden />;
};

ActionBarSeparator.displayName = 'ActionBar.Separator';
