import type {StorybookConfig} from '@storybook/react-webpack5';

const config: StorybookConfig = {
    staticDirs: ['./assets'],
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        {name: '@storybook/addon-essentials', options: {backgrounds: false}},
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
        'storybook-preset-inline-svg',
        './theme-addon/register.tsx',
        './focus-addon/register.tsx',
        '@storybook/addon-a11y',
        '@storybook/addon-webpack5-compiler-babel',
        '@chromatic-com/storybook'
    ],

    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    },

    docs: {},

    core: {
        disableTelemetry: true,
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    }
};

export default config;
