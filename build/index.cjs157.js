'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

function pluralizerEn (count, pluralForms) {
    if (count === 0) {
        return pluralForms.None;
    }
    if (count === 1 || count === -1) {
        return pluralForms.One;
    }
    return pluralForms.Many;
}

exports.default = pluralizerEn;
//# sourceMappingURL=index.cjs157.js.map
