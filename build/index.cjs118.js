'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index.cjs142.js');
const configure = require('./index.cjs143.js');

const configLang = configure.getConfig().lang;
const i18n = new index.I18N({ lang: configLang, fallbackLang: configLang });

exports.i18n = i18n;
//# sourceMappingURL=index.cjs118.js.map
