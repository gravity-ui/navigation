import React from 'react';

import {Button, Icon} from '@gravity-ui/uikit';

import {LogoProps} from '../types';
import {block} from '../utils/cn';

import './Logo.scss';

const b = block('logo');

export const Logo: React.FC<
    LogoProps & {compact?: boolean; buttonClassName?: string; buttonWrapperClassName?: string}
> = ({
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
    className,
    buttonWrapperClassName,
    buttonClassName,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}) => {
    const hasWrapper = typeof wrapper === 'function';

    const buttonIcon = iconSrc ? (
        <Button.Icon className={iconClassName}>
            <img alt="logo icon" src={iconSrc} width={iconSize} height={iconSize} />
        </Button.Icon>
    ) : (
        icon && <Icon data={icon} size={iconSize} className={iconClassName} />
    );

    const button = (
        <Button
            view="flat"
            size="l"
            className={b('btn-logo', buttonClassName)}
            component={hasWrapper ? 'span' : undefined}
            onClick={onClick}
            target={target}
            rel={target === '_self' ? undefined : 'noreferrer'}
            href={href}
            extraProps={{
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledby,
            }}
        >
            {buttonIcon}
        </Button>
    );

    const logoContent = typeof text === 'function' ? text() : text;

    const logo = (
        <div className={b('logo')} style={{fontSize: textSize}}>
            {logoContent}
        </div>
    );

    const renderLogoSection = () => {
        if (compact) return null;
        if (hasWrapper && !href) {
            return <div onClick={onClick}>{wrapper(logo, Boolean(compact))}</div>;
        } else {
            return (
                <a
                    href={href ?? '/'}
                    target={target}
                    rel={target === '_self' ? undefined : 'noreferrer'}
                    className={b('logo-link')}
                    onClick={onClick}
                >
                    {logo}
                </a>
            );
        }
    };

    return (
        <div className={b(null, className)}>
            <div className={b('logo-btn-place', buttonWrapperClassName)}>
                {hasWrapper ? wrapper(button, Boolean(compact)) : button}
            </div>
            {renderLogoSection()}
        </div>
    );
};
