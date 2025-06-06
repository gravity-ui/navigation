import React from 'react';

import {Icon} from '@gravity-ui/uikit';

import {LogoProps} from '../types';
import {createBlock} from '../utils/cn';

import styles from './Logo.scss';

const b = createBlock('logo', styles);

export const Logo: React.FC<
    LogoProps & {compact?: boolean; buttonClassName?: string; iconPlaceClassName?: string}
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
    compact,
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
            <div className={b('logo')} style={{fontSize: textSize}}>
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
            {!compact && logo}
        </Button>
    );

    return (
        <div className={b(null, className)}>
            {hasWrapper ? wrapper(button, Boolean(compact)) : button}
        </div>
    );
};
