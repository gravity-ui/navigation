import {config} from 'eslint-config/react-internal';
import i18nEslintPlugin from '@gravity-ui/eslint-plugin-i18n';

/** @type {import("eslint").Linter.Config} */
export default [
    ...config,
    {
        plugins: {
            'i18n-eslint-plugin': i18nEslintPlugin,
        },
        rules: {
            'i18n-eslint-plugin/auto-generate-translation-message-id': [
                'error',
                {
                    namespaceMatchers: [
                        /src\/units\/([^/]+)\/(?:components|pages)\/([^/]+)/,
                        /src\/units\/([^/]+)/,
                        /src\/pages\/([^/]+)/,
                        /src\/([^/]+)/,
                    ],
                },
            ],
            'i18n-eslint-plugin/restrict-i18n-imports': [
                'error',
                {
                    exclusions: {
                        aliases: ['@shared/i18n'],
                        filePathsMatchers: [/shared\/i18n\/*/],
                    },
                },
            ],
            'i18n-eslint-plugin/multiline-i18n-meta-object': 'error',
            'i18n-eslint-plugin/sort-message-locales': 'error',
            'i18n-eslint-plugin/string-literal-keys': [
                'error',
                {
                    i18nSpecifier: ['t', 'commonT'],
                    jsxI18nSpecifier: ['Message', 'CommonMessage'],
                },
            ],
        },
    },
];
