import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, IconProps} from '@gravity-ui/uikit';

import './Logo.scss';

const b = block('aside-header-logo');

export interface LogoProps {
    text: (() => React.ReactNode) | string;
    icon?: IconProps['data'];
    iconSrc?: string;
    iconClassName?: string;
    iconSize?: number;
    textSize?: number;
    href?: string;
    wrapper?: (node: React.ReactNode, compact: boolean) => React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface LogoInnerProps extends LogoProps {
    compact: boolean;
}

export const Logo: React.FC<LogoInnerProps> = ({
    text,
    compact,
    icon,
    iconSrc,
    iconClassName,
    iconSize = 24,
    textSize = 15,
    href = '/',
    wrapper,
    onClick,
}) => {
    const hasClickHandler = typeof onClick === 'function';
    const hasWrapper = typeof wrapper === 'function';

    const linkProps = hasClickHandler
        ? {}
        : {
              target: '_self',
              href,
          };

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
            {...linkProps}
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
                {hasWrapper ? wrapper(button, compact) : button}
            </div>
            {!compact &&
                (hasWrapper ? (
                    wrapper(logo, compact)
                ) : (
                    <a {...linkProps} className={b('logo-link')} onClick={onClick}>
                        {logo}
                    </a>
                ))}
        </div>
    );
};
