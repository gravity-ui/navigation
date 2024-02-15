import React from 'react';
import {Icon} from '@gravity-ui/uikit';
import {block} from '../utils/cn';
import {LogoProps} from '../types';

import './MobileLogo.scss';

const b = block('mobile-logo');

export interface MobileLogoProps extends LogoProps {
    compact: boolean;
}

export const MobileLogo: React.FC<MobileLogoProps> = ({
    text,
    compact,
    icon,
    iconSrc,
    iconClassName,
    iconSize = 32,
    textSize = 20,
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

    let logoIcon;

    if (iconSrc) {
        logoIcon = (
            <img
                alt="logo icon"
                src={iconSrc}
                width={iconSize}
                height={iconSize}
                className={iconClassName}
            />
        );
    } else if (icon) {
        logoIcon = <Icon data={icon} size={iconSize} className={b('icon', iconClassName)} />;
    }

    let logoTitle: React.ReactNode;

    if (typeof text === 'function') {
        logoTitle = text();
    } else {
        logoTitle = (
            <span className={b('title')} style={{fontSize: textSize}}>
                {text}
            </span>
        );
    }

    const logo = (
        <React.Fragment>
            {logoIcon}
            {logoTitle}
        </React.Fragment>
    );

    return hasWrapper ? (
        <div className={b()} onClick={onClick}>
            {wrapper(logo, compact)}
        </div>
    ) : (
        <a {...linkProps} className={b()} onClick={onClick}>
            {logo}
        </a>
    );
};
