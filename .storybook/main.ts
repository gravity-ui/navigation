import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
    staticDirs: ['./assets'],
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],

    addons: [
        '@storybook/addon-links',
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

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    },

    webpackFinal: async (config) => {
        // Remove default CSS/SCSS rules provided by Storybook
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

        // Add our rules for CSS Modules and regular styles at the beginning
        config.module.rules.unshift(
            // Rule for CSS Modules (*.module.scss)
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
            // Rule for regular SCSS files
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
            // Rule for regular CSS files (including @gravity-ui/uikit)
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }
        );

        return config;
    },

    features: {
      backgrounds: false
    }
};

export default config;
