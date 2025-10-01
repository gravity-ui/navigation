module.exports = {
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/codemods/**/__tests__/**/*.test.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': [
            'babel-jest',
            {
                presets: [
                    ['@babel/preset-env', {targets: {node: 'current'}}],
                    '@babel/preset-typescript',
                ],
            },
        ],
    },
    transformIgnorePatterns: ['node_modules/(?!(jscodeshift)/)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: ['codemods/**/*.{ts,tsx}', '!codemods/**/__tests__/**/*'],
};
