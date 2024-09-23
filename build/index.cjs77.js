'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const i18n = require('./index.cjs118.js');

function addComponentKeysets(data, keysetName) {
    Object.entries(data).forEach(([lang, keys]) => i18n.i18n.registerKeyset(lang, keysetName, keys));
    return i18n.i18n.keyset(keysetName);
}

exports.addComponentKeysets = addComponentKeysets;
//# sourceMappingURL=index.cjs77.js.map
