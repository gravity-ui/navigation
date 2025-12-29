import React from 'react';

import {Icon} from '@gravity-ui/uikit';
import {CSSTransition} from 'react-transition-group';

import {ASIDE_HEADER_EXPAND_TRANSITION_DELAY} from '../constants';
import {LogoProps} from '../types';
import {createBlock} from '../utils/cn';

import styles from './Logo.module.scss';

const b = createBlock('logo', styles);

const logoTransitionClasses = {
    enter: b('logo-enter'),
    enterActive: b('logo-enter-active'),
    enterDone: b('logo-enter-done'),
    exit: b('logo-exit'),
    exitActive: b('logo-exit-active'),
    exitDone: b('logo-exit-done'),
};

export const Logo: React.FC<
    LogoProps & {pinned?: boolean; buttonClassName?: string; iconPlaceClassName?: string}
> = ({
    text,
    icon,
    iconSrc,
    iconClassName,
    iconPlaceClassName,
    iconSize = 24,
    textSize = 15,
    href,
    target = '_self',
    wrapper,
    onClick,
    pinned,
    className,
    buttonClassName,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}) => {
    const hasWrapper = typeof wrapper === 'function';

    let buttonIcon;

    if (iconSrc) {
        buttonIcon = (
            <span className={iconClassName}>
                <img alt="logo icon" src={iconSrc} width={iconSize} height={iconSize} />
            </span>
        );
    } else if (icon) {
        buttonIcon = <Icon data={icon} size={iconSize} className={iconClassName} />;
    }

    let logo: React.ReactNode;

    if (typeof text === 'function') {
        logo = text();
    } else {
        logo = (
            <div className={b('logo', {collapsed: !pinned})} style={{fontSize: textSize}}>
                {text}
            </div>
        );
    }

    const {tag: Button, ...buttonProps} = href
        ? ({
              tag: 'a',
              target,
              rel: target === '_self' ? undefined : 'noreferrer',
              href,
              'aria-label': ariaLabel,
              'aria-labelledby': ariaLabelledby,
          } as const)
        : ({tag: 'span'} as const);

    const button = (
        <Button {...buttonProps} className={b('btn-logo', buttonClassName)} onClick={onClick}>
            <span className={b('logo-icon-place', iconPlaceClassName)}>{buttonIcon}</span>

            <CSSTransition
                in={pinned}
                timeout={ASIDE_HEADER_EXPAND_TRANSITION_DELAY}
                classNames={logoTransitionClasses}
            >
                {logo}
            </CSSTransition>
        </Button>
    );

    return (
        <div className={b(null, className)}>
            {hasWrapper ? wrapper(button, Boolean(pinned)) : button}
        </div>
    );
};
