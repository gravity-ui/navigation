import type {KnipConfig} from 'knip';

const config: KnipConfig = {
    entry: ['src/index.ts'],
    project: ['src/**/*.{ts,tsx}', 'playwright/**/*.{ts,tsx}'],
    ignore: [
        'build/**',
        'node_modules/**',
        '**/__stories__/**',
        '**/*.stories.{ts,tsx}',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/__snapshots__/**',
        'test-results/**',
        'playwright-report/**',
        'coverage/**',
        'playwright/playwright/index.tsx',
    ],
    ignoreDependencies: [
        // Documentation tools
        '@doc-tools/transform',
        // Webpack loaders used by Storybook for SCSS compilation
        'css-loader',
        'sass-loader',
        'style-loader',
    ],
    ignoreBinaries: [
        // These are false positives from GitHub Actions workflow
        'magenta,blue', // color parameters for concurrently, not a binary
        'storybook-static', // directory path, not a binary
        'concurrently',
        'http-server',
    ],
};

export default config;
