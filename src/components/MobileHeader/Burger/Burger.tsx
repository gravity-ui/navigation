import React from 'react';
import {block} from '../../utils/cn';

import {defaultDict} from '../../constants';

import './Burger.scss';

const b = block('mobile-header-burger');

export interface BurgerProps {
    opened?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Burger = React.memo(({opened, className, onClick}: BurgerProps) => (
    <button
        className={b({opened}, className)}
        onClick={onClick}
        aria-label={opened ? defaultDict['button_close-burger'] : defaultDict['button_open-burger']}
    >
        <span className={b('icon')}>
            <span className={b('icon-dash')}></span>
        </span>
    </button>
));

Burger.displayName = 'Burger';
