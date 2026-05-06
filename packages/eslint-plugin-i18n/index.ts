import {rule as autoGenerateTranslationMessageId} from './rules/auto-generate-translation-message-id';
import {rule as detectIncorrectCalls} from './rules/detectIncorrectCalls';
import {rule as restrictI18nImports} from './rules/restrict-i18n-imports';
import {rule as sortI18nMessageKeys} from './rules/sort-i18n-message-keys';
import {rule as stringLiteralKeys} from './rules/string-literal-keys';

import pkg from './package.json';

export const meta = {
    name: pkg.name,
    version: pkg.version,
};

export const rules = {
    'auto-generate-translation-message-id': autoGenerateTranslationMessageId,
    'detect-incorrect-calls': detectIncorrectCalls,
    'restrict-i18n-imports': restrictI18nImports,
    'sort-i18n-message-keys': sortI18nMessageKeys,
    'string-literal-keys': stringLiteralKeys,
};

export * from './rules/auto-generate-translation-message-id/types';
