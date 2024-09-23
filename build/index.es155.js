const ErrorCode = {
    EmptyKeyset: 'EMPTY_KEYSET',
    EmptyLanguageData: 'EMPTY_LANGUAGE_DATA',
    KeysetNotFound: 'KEYSET_NOT_FOUND',
    MissingKey: 'MISSING_KEY',
    MissingKeyFor0: 'MISSING_KEY_FOR_0',
    MissingKeyParamsCount: 'MISSING_KEY_PARAMS_COUNT',
    MissingKeyPlurals: 'MISSING_KEY_PLURALS',
    NoLanguageData: 'NO_LANGUAGE_DATA',
};
function mapErrorCodeToMessage(args) {
    const { code, fallbackLang, lang } = args;
    let message = `Using language ${lang}. `;
    switch (code) {
        case ErrorCode.EmptyKeyset: {
            message += `Keyset is empty.`;
            break;
        }
        case ErrorCode.EmptyLanguageData: {
            message += 'Language data is empty.';
            break;
        }
        case ErrorCode.KeysetNotFound: {
            message += 'Keyset not found.';
            break;
        }
        case ErrorCode.MissingKey: {
            message += 'Missing key.';
            break;
        }
        case ErrorCode.MissingKeyFor0: {
            message += 'Missing key for 0';
            return message;
        }
        case ErrorCode.MissingKeyParamsCount: {
            message += 'Missing params.count for key.';
            break;
        }
        case ErrorCode.MissingKeyPlurals: {
            message += 'Missing required plurals.';
            break;
        }
        case ErrorCode.NoLanguageData: {
            message = `Language "${lang}" is not defined, make sure you call setLang for the same language you called registerKeysets for!`;
        }
    }
    if (fallbackLang) {
        message += ` Trying to use fallback language "${fallbackLang}"...`;
    }
    return message;
}

export { ErrorCode, mapErrorCodeToMessage };
//# sourceMappingURL=index.es155.js.map
