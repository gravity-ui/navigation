import * as React from 'react';

import {Icon, IconProps} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {useLayoutContext} from './LayoutContext';
import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './Logo.module.scss';

const b = createBlock('aside-header-next-logo', styles);

export interface LogoState extends Record<string, unknown> {
    compact: boolean;
}

export interface LogoProps {
    text?: React.ReactNode;
    icon?: IconProps['data'];
    iconSize?: number;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    'aria-label'?: string;
    render?: RenderProp<LogoState>;
    ref?: React.Ref<HTMLElement>;
}

function LogoComponent(props: LogoProps) {
    const {text, icon, iconSize = 24, href, onClick, className, render, ref, ...rest} = props;
    const {compact} = useLayoutContext();

    const tag = href ? 'a' : 'button';

    return useRenderElement<LogoState>(tag, {
        render,
        ref,
        state: {compact},
        props: [
            {
                className: b({compact}, className),
                onClick,
                ...(href ? {href} : {type: 'button'}),
                children: (
                    <React.Fragment>
                        {icon && (
                            <span className={b('icon')}>
                                <Icon data={icon} size={iconSize} />
                            </span>
                        )}
                        {!compact && <span className={b('text')}>{text}</span>}
                    </React.Fragment>
                ),
            },
            rest,
        ],
    });
}

export const Logo = withSlot(LogoComponent, 'header');
