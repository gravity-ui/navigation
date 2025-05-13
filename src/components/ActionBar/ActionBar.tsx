import React, {PropsWithChildren} from 'react';

import {DOMProps, QAProps} from '@gravity-ui/uikit';

import {block} from '../utils/cn';

import {ActionBarGroup} from './Group/ActionBarGroup';
import {ActionBarItem} from './Item/ActionBarItem';
import {ActionBarSection} from './Section/ActionBarSection';
import {ActionBarSeparator} from './Separator/ActionBarSeparator';

import './ActionBar.scss';

export type Props = DOMProps &
    QAProps &
    PropsWithChildren<{
        'aria-label'?: string;
    }>;

const b = block('action-bar');

const ActionBar = ({children, className, style, qa, 'aria-label': ariaLabel}: Props) => {
    return (
        <section className={b(null, className)} style={style} aria-label={ariaLabel} data-qa={qa}>
            {children}
        </section>
    );
};

ActionBar.displayName = 'ActionBar';

const PublicActionBar = Object.assign(ActionBar, {
    Section: ActionBarSection,
    Group: ActionBarGroup,
    Item: ActionBarItem,
    Separator: ActionBarSeparator,
});

export {PublicActionBar as ActionBar};
