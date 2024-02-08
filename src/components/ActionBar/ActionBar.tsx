import React, {PropsWithChildren} from 'react';

import {block} from '../utils/cn';

import {ActionBarGroup} from './Group/ActionBarGroup';
import {ActionBarItem} from './Item/ActionBarItem';
import {ActionBarSection} from './Section/ActionBarSection';
import {ActionBarSeparator} from './Separator/ActionBarSeparator';

import './ActionBar.scss';

export type Props = PropsWithChildren<{
    'aria-label'?: string;
    className?: string;
}>;

const b = block('action-bar');

const ActionBar = ({children, className, 'aria-label': ariaLabel}: Props) => {
    return (
        <section className={b(null, className)} aria-label={ariaLabel}>
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
