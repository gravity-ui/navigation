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

interface Props extends LogoProps {
    isCompactMode?: boolean;
    isExpanded?: boolean;
    buttonClassName?: string;
    iconPlaceClassName?: string;
}

export const Logo: React.FC<Props> = ({
    text,
    icon,
    iconSrc,
    iconClassName,
    iconPlaceClassName,
    textSize = 15,
    href,
    target = '_self',
    wrapper,
    onClick,
    isExpanded = true,
    className,
    buttonClassName,
    isCompactMode,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
}) => {
    const hasWrapper = typeof wrapper === 'function';
    const defaultIconSize = isCompactMode === false ? 32 : 24;
    const iconSize = props.iconSize || defaultIconSize;

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
            <div className={b('logo', {collapsed: !isExpanded})} style={{fontSize: textSize}}>
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
                in={isExpanded}
                timeout={ASIDE_HEADER_EXPAND_TRANSITION_DELAY}
                classNames={logoTransitionClasses}
            >
                {logo}
            </CSSTransition>
        </Button>
    );

    return (
        <div className={b(null, className)}>
            {hasWrapper ? wrapper(button, Boolean(isExpanded)) : button}
        </div>
    );
};
