'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

function pluralizerRu (count, pluralForms) {
    // the rules for negative numbers are the same
    const lastDigit = Math.abs(count % 10);
    const last2Digits = Math.abs(count % 100);
    if (count === 0) {
        return pluralForms.None;
    }
    if (lastDigit === 1 && last2Digits !== 11) {
        return pluralForms.One;
    }
    if ((lastDigit > 1 && lastDigit < 5) && (last2Digits < 10 || last2Digits > 20)) {
        return pluralForms.Few;
    }
    return pluralForms.Many;
}

exports.default = pluralizerRu;
//# sourceMappingURL=index.cjs158.js.map
