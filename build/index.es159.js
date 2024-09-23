import { PluralForm } from './index.es156.js';

function getPluralViaIntl(value, count, lang) {
    if (value.zero && count === 0) {
        return value.zero;
    }
    if (!Intl.PluralRules) {
        throw new Error('Intl.PluralRules is not available. Use polyfill.');
    }
    const pluralRules = new Intl.PluralRules(lang);
    const form = pluralRules.select(count);
    if (form === 'other' && typeof value.other === 'undefined') {
        return value.many || value.few;
    }
    return value[form] || value.other;
}
function getPluralValue({ value, count, lang, pluralizers, log, key }) {
    if (!Array.isArray(value)) {
        return getPluralViaIntl(value, count, lang) || key;
    }
    if (!pluralizers) {
        log('Can not use deprecated plural format without pluralizers');
        return key;
    }
    if (!pluralizers[lang]) {
        log(`Pluralization is not configured for language '${lang}', falling back to the english ruleset`);
    }
    if (value.length < 3) {
        log('Missing required plurals');
        return key;
    }
    const pluralizer = pluralizers[lang] || pluralizers['en'];
    if (!pluralizer) {
        log('Fallback pluralization is not configured!');
        return key;
    }
    return value[pluralizer(count, PluralForm)] || value[PluralForm.Many] || key;
}

export { getPluralValue, getPluralViaIntl };
//# sourceMappingURL=index.es159.js.map
