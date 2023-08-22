import React from 'react';
import {block} from '../../utils/cn';

import './Burger.scss';

const b = block('mobile-header-burger');

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
