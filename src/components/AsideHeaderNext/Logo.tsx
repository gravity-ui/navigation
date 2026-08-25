import * as React from 'react';

import {Icon, IconProps} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {useLayoutContext} from './LayoutContext';
import {RowBody, RowLeading, rowBlock} from './Row';
import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './Logo.module.scss';

const b = createBlock('aside-header-next-logo', styles);

export interface LogoState extends Record<string, unknown> {
    compact: boolean;
}

export interface LogoProps {
    /** Shorthand for `Logo.Icon`. */
    icon?: IconProps['data'];
    /** Shorthand for `Logo.Icon` with an image. */
    iconSrc?: string;
    iconSize?: number;
    /** Shorthand for `Logo.Text`. */
    text?: React.ReactNode;
    /** Sub-parts or any custom content. */
    children?: React.ReactNode;
    href?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    'aria-label'?: string;
    render?: RenderProp<LogoState>;
    ref?: React.Ref<HTMLElement>;
}

export interface LogoIconProps {
    data?: IconProps['data'];
    src?: string;
    size?: number;
    children?: React.ReactNode;
    className?: string;
}

/** Occupies `Row.Leading` — the zone that survives `compact`. */
export function LogoIcon(props: LogoIconProps) {
    const {data, src, size = 24, children, className} = props;

    let content = children;
    if (!content && data) {
        content = <Icon data={data} size={size} />;
    }
    if (!content && src) {
        content = <img src={src} width={size} height={size} alt="" />;
    }

    return <RowLeading className={b('icon', className)}>{content}</RowLeading>;
}

export interface LogoTextProps {
    children?: React.ReactNode;
    className?: string;
}

/** Occupies `Row.Body` — hidden in `compact` by CSS, never unmounted. */
export function LogoText(props: LogoTextProps) {
    return <RowBody className={b('text', props.className)}>{props.children}</RowBody>;
}

function LogoComponent(props: LogoProps) {
    const {
        icon,
        iconSrc,
        iconSize,
        text,
        children,
        href,
        target,
        onClick,
        className,
        render,
        ref,
        ...rest
    } = props;
    const {compact} = useLayoutContext();

    // A non-clickable logo must not sit in the tab order.
    let tag: 'a' | 'button' | 'div' = 'div';
    if (href) {
        tag = 'a';
    } else if (onClick) {
        tag = 'button';
    }

    const content = children ?? (
        <React.Fragment>
            {(icon || iconSrc) && <LogoIcon data={icon} src={iconSrc} size={iconSize} />}
            {text ? <LogoText>{text}</LogoText> : null}
        </React.Fragment>
    );

    return useRenderElement<LogoState>(tag, {
        render,
        ref,
        state: {compact},
        props: [
            {
                className: rowBlock({interactive: Boolean(href || onClick)}, b(null, className)),
                'data-place': 'header',
                'data-compact': compact || undefined,
                onClick,
                ...(href ? {href, target} : {}),
                ...(tag === 'button' ? {type: 'button'} : {}),
                children: content,
            },
            rest,
        ],
    });
}

export const Logo = Object.assign(withSlot(LogoComponent, 'header'), {
    Icon: LogoIcon,
    Text: LogoText,
});
