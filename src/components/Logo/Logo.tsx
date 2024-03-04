import React from 'react';

import {Button, Icon} from '@gravity-ui/uikit';

import {LogoProps} from '../types';
import {block} from '../utils/cn';

import './Logo.scss';

const b = block('logo');

export const Logo: React.FC<LogoProps & {compact?: boolean}> = ({
    text,
    icon,
    iconSrc,
    iconClassName,
    iconSize = 24,
    textSize = 15,
    href,
    target = '_self',
    wrapper,
    onClick,
    compact,
}) => {
    const hasWrapper = typeof wrapper === 'function';

    let buttonIcon;

    if (iconSrc) {
        buttonIcon = (
            <Button.Icon className={iconClassName}>
                <img alt="logo icon" src={iconSrc} width={iconSize} height={iconSize} />
            </Button.Icon>
        );
    } else if (icon) {
        buttonIcon = <Icon data={icon} size={iconSize} className={iconClassName} />;
    }

    const button = (
        <Button
            view="flat"
            size="l"
            className={b('btn-logo')}
            component={hasWrapper ? 'span' : undefined}
            onClick={onClick}
            target={target}
            rel={target === '_self' ? undefined : 'noreferrer'}
            href={href}
        >
            {buttonIcon}
        </Button>
    );

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

    return (
        <div className={b()}>
            <div className={b('logo-btn-place')}>
                {hasWrapper ? wrapper(button, Boolean(compact)) : button}
            </div>
            {!compact &&
                (hasWrapper ? (
                    <div onClick={onClick}>{wrapper(logo, Boolean(compact))}</div>
                ) : (
                    <a
                        href={href ?? '/'}
                        target={target}
                        rel={target === '_self' ? undefined : 'noreferrer'}
                        className={b('logo-link')}
                        onClick={onClick}
                    >
                        {logo}
                    </a>
                ))}
        </div>
    );
};
