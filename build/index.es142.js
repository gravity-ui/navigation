import { replaceParams } from './index.es154.js';
import { mapErrorCodeToMessage, ErrorCode } from './index.es155.js';
import { isPluralValue } from './index.es156.js';
export { PluralForm } from './index.es156.js';
import pluralizerEn from './index.es157.js';
import pluralizerRu from './index.es158.js';
import { getPluralValue } from './index.es159.js';

class I18N {
    constructor(options = {}) {
        this.data = {};
        this.pluralizers = {
            en: pluralizerEn,
            ru: pluralizerRu,
        };
        this.logger = null;
        const { data, fallbackLang, lang, logger = null } = options;
        this.fallbackLang = fallbackLang;
        this.lang = lang;
        this.logger = logger;
        if (data) {
            Object.entries(data).forEach(([keysetLang, keysetData]) => {
                this.registerKeysets(keysetLang, keysetData);
            });
        }
    }
    setLang(lang) {
        this.lang = lang;
    }
    setFallbackLang(fallbackLang) {
        this.fallbackLang = fallbackLang;
    }
    /**
     * @deprecated Plurals automatically used from Intl.PluralRules. You can safely remove this call. Will be removed in v2.
     */
    configurePluralization(pluralizers) {
        this.pluralizers = Object.assign({}, this.pluralizers, pluralizers);
    }
    registerKeyset(lang, keysetName, data = {}) {
        const isAlreadyRegistered = this.data[lang]
            && Object.prototype.hasOwnProperty.call(this.data[lang], keysetName);
        if (isAlreadyRegistered && process.env.NODE_ENV === 'production') {
            throw new Error(`Keyset '${keysetName}' is already registered, aborting!`);
        }
        else if (isAlreadyRegistered) {
            this.warn(`Keyset '${keysetName}' is already registered.`);
        }
        this.data[lang] = Object.assign({}, this.data[lang], { [keysetName]: data });
    }
    registerKeysets(lang, data) {
        Object.keys(data).forEach((keysetName) => {
            this.registerKeyset(lang, keysetName, data[keysetName]);
        });
    }
    has(keysetName, key, lang) {
        var _a;
        const languageData = this.getLanguageData(lang);
        return Boolean(languageData && languageData[keysetName] && ((_a = languageData[keysetName]) === null || _a === void 0 ? void 0 : _a[key]));
    }
    i18n(keysetName, key, params) {
        if (!this.lang && !this.fallbackLang) {
            throw new Error('Language is not specified. You should set at least one of these: "lang", "fallbackLang"');
        }
        let text;
        let details;
        if (this.lang) {
            ({ text, details } = this.getTranslationData({ keysetName, key, params, lang: this.lang }));
            if (details) {
                const message = mapErrorCodeToMessage({
                    code: details.code,
                    lang: this.lang,
                    fallbackLang: this.fallbackLang === this.lang ? undefined : this.fallbackLang,
                });
                this.warn(message, details.keysetName, details.key);
            }
        }
        else {
            this.warn('Target language is not specified.');
        }
        if (text === undefined && this.fallbackLang && this.fallbackLang !== this.lang) {
            ({ text, details } = this.getTranslationData({
                keysetName,
                key,
                params,
                lang: this.fallbackLang,
            }));
            if (details) {
                const message = mapErrorCodeToMessage({
                    code: details.code,
                    lang: this.fallbackLang,
                });
                this.warn(message, details.keysetName, details.key);
            }
        }
        return text !== null && text !== void 0 ? text : key;
    }
    keyset(keysetName) {
        return (key, params) => {
            return this.i18n(keysetName, key, params);
        };
    }
    warn(msg, keyset, key) {
        var _a;
        let cacheKey = '';
        if (keyset) {
            cacheKey += keyset;
            if (key) {
                cacheKey += `.${key}`;
            }
        }
        else {
            cacheKey = 'languageData';
        }
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(`I18n: ${msg}`, {
            level: 'info',
            logger: cacheKey,
            extra: {
                type: 'i18n'
            }
        });
    }
    getLanguageData(lang) {
        const langCode = lang || this.lang;
        return langCode ? this.data[langCode] : undefined;
    }
    getTranslationData(args) {
        const { lang, key, keysetName, params } = args;
        const languageData = this.getLanguageData(lang);
        if (typeof languageData === 'undefined') {
            return { details: { code: ErrorCode.NoLanguageData } };
        }
        if (Object.keys(languageData).length === 0) {
            return { details: { code: ErrorCode.EmptyLanguageData } };
        }
        const keyset = languageData[keysetName];
        if (!keyset) {
            return { details: { code: ErrorCode.KeysetNotFound, keysetName } };
        }
        if (Object.keys(keyset).length === 0) {
            return { details: { code: ErrorCode.EmptyKeyset, keysetName } };
        }
        const keyValue = keyset && keyset[key];
        const result = {};
        if (keyValue === undefined) {
            return { details: { code: ErrorCode.MissingKey, keysetName, key } };
        }
        if (isPluralValue(keyValue)) {
            const count = Number(params === null || params === void 0 ? void 0 : params.count);
            if (Number.isNaN(count)) {
                return { details: { code: ErrorCode.MissingKeyParamsCount, keysetName, key } };
            }
            result.text = getPluralValue({
                key,
                value: keyValue,
                count,
                lang: this.lang || 'en',
                pluralizers: this.pluralizers,
                log: (message) => this.warn(message, keysetName, key),
            });
        }
        else {
            result.text = keyValue;
        }
        if (params) {
            result.text = replaceParams(result.text, params);
        }
        return result;
    }
}

export { I18N, isPluralValue };
//# sourceMappingURL=index.es142.js.map
