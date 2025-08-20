'use client';

import './Wrapper.scss';

import {Moon, Sun} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

const b = block('wrapper');

export const DARK = 'dark';
const LIGHT = 'light';
export const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
    setTheme: (theme: string) => void;
    isDark: boolean;
};

export const Wrapper: React.FC<AppProps> = ({children, setTheme, isDark}) => {
    return (
        <div className={b()}>
            <div className={b('theme-button')}>
                <Button
                    size="l"
                    view="outlined"
                    onClick={() => {
                        setTheme(isDark ? LIGHT : DARK);
                    }}
                >
                    <Icon data={isDark ? Sun : Moon} />
                </Button>
            </div>
            <div className={b('layout')}>
                <div className={b('header')}>
                    <div className={b('logo')}>
                        <div className={b('gravity-logo', {dark: isDark})} />
                        <div className={b('next-logo', {dark: isDark})} />
                    </div>
                </div>
                <div className={b('content')}>{children}</div>
            </div>
        </div>
    );
};
