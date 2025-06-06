import React from 'react';

import {createBlock} from '../../utils/cn';

import styles from './Burger.scss';

const b = createBlock('mobile-header-burger', styles);

interface BurgerProps {
    closeTitle: string;
    openTitle: string;
    opened?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Burger = React.memo(
    ({closeTitle, openTitle, opened, className, onClick}: BurgerProps) => (
        <button
            className={b({opened}, className)}
            onClick={onClick}
            aria-label={opened ? closeTitle : openTitle}
        >
            <span className={b('icon')}>
                <span className={b('icon-dash')}></span>
            </span>
        </button>
    ),
);

Burger.displayName = 'Burger';
