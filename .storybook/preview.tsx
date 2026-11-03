import React from 'react';
import type {Decorator, Preview} from '@storybook/react-webpack5';
import {Provider, Lang, configure as uiKitConfigure} from '@gravity-ui/uikit';
import {withMobile} from './decorators/withMobile';
import {withLang} from './decorators/withLang';

import './styles.scss';

import '@gravity-ui/uikit/styles/styles.css';

uiKitConfigure({
    lang: Lang.En,
});

const withContextProvider: Decorator = (Story, context) => {
    return (
        <Provider theme={context.globals.theme}>
            <Story {...context} />
        </Provider>
    );
};

const preview: Preview = {
    decorators: [withMobile, withLang, withContextProvider],
    parameters: {
        jsx: {showFunctions: true},
        options: {
            storySort: {
                order: ['Theme', 'Components', ['Basic']],
                method: 'alphabetical',
            },
        },
        layout: 'fullscreen',
    },
    globalTypes: {
        theme: {
            name: 'Theme',
            defaultValue: 'light',
            toolbar: {
                icon: 'mirror',
                items: [
                    {value: 'light', right: '☼', title: 'Light'},
                    {value: 'dark', right: '☾', title: 'Dark'},
                    {value: 'light-hc', right: '☼', title: 'High Contrast Light (beta)'},
                    {value: 'dark-hc', right: '☾', title: 'High Contrast Dark (beta)'},
                ],
            },
        },
        lang: {
            name: 'Language',
            defaultValue: 'en',
            toolbar: {
                icon: 'globe',
                items: [
                    {value: 'en', right: '🇬🇧', title: 'En'},
                    {value: 'ru', right: '🇷🇺', title: 'Ru'},
                ],
            },
        },
        platform: {
            name: 'Platform',
            defaultValue: 'desktop',
            toolbar: {
                items: [
                    {value: 'desktop', title: 'Desktop', icon: 'browser'},
                    {value: 'mobile', title: 'Mobile', icon: 'mobile'},
                ],
            },
        },
    },
};

export default preview;
