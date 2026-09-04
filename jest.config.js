module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
    rootDir: '.',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(@gravity-ui)/)'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.jest.json',
        },
    },
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
        // `moduleResolution: node` cannot resolve the package subpath export
        '^@gravity-ui/uikit/i18n$': '<rootDir>/node_modules/@gravity-ui/uikit/build/cjs/i18n',
    },
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/__stories__/**/*', '!**/*/*.stories.{ts,tsx}'],
    modulePathIgnorePatterns: ['visual', 'helpersPlaywright'],
};
