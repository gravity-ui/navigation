module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
        'storybook-preset-inline-svg',
    ],
    framework: '@storybook/react',
    features: {
        postcss: false,
    },
};
