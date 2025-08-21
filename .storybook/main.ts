import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
    staticDirs: ['./assets'],
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        { name: '@storybook/addon-essentials', options: { backgrounds: false } },
        '@storybook/addon-interactions',
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
    },

    webpackFinal: async (config) => {
        // Удаляем существующие правила для CSS/SCSS из Storybook по умолчанию
        config.module = config.module || { rules: [] };
        config.module.rules = config.module.rules?.filter(
            (rule) => {
                if (typeof rule === 'object' && rule !== null && 'test' in rule) {
                    const test = rule.test;
                    if (test instanceof RegExp) {
                        return !test.test('.css') && !test.test('.scss');
                    }
                }
                return true;
            }
        ) || [];

        // Добавляем наши правила для CSS Modules и обычных стилей в начало
        config.module.rules.unshift(
            // Правило для CSS модулей (*.module.scss)
            {
                test: /\.module\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                exportLocalsConvention: 'asIs', // Changed to 'asIs' to avoid duplicate exports and preserve original names
                                namedExport: false, // Disable named exports to avoid conflicts
                            },
                            esModule: false, // Use CommonJS exports to avoid duplicate export issues
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: ['node_modules'],
                                silenceDeprecations: ['legacy-js-api'],
                            },
                        },
                    },
                ],
            },
            // Правило для обычных SCSS файлов
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: ['node_modules'],
                                silenceDeprecations: ['legacy-js-api'],
                            },
                        },
                    },
                ],
            },
            // Правило для обычных CSS файлов (включая @gravity-ui/uikit)
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }
        );

        return config;
    }

};

export default config;
