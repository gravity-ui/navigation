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
    },

    webpackFinal: async (config) => {
        // Add rules for both CSS modules and regular SCSS files
        const cssModulesRule = {
            test: /\.module\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[local]',
                            exportGlobals: true,
                        },
                    },
                },
                'sass-loader',
            ],
        };

        const regularScssRule = {
            test: /\.scss$/,
            exclude: /\.module\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        };

        // Remove existing SCSS rules and add our new rules
        const rules = config.module?.rules || [];
        const filteredRules = rules.filter((rule: any) => {
            if (rule && typeof rule === 'object' && 'test' in rule) {
                return !(rule.test && (rule.test.toString().includes('scss') || rule.test.toString().includes('s[ca]ss')));
            }
            return true;
        });

        config.module = {
            ...config.module,
            rules: [...filteredRules, cssModulesRule, regularScssRule],
        };
        
        return config;
    }

};

export default config;
