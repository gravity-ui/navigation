'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const i18n$1 = require('@gravity-ui/uikit/i18n');
const cn = require('../../utils/cn.cjs');
const en = require('./en.json.cjs');
const ru = require('./ru.json.cjs');

const COMPONENT = "Settings";
const i18n = i18n$1.addComponentKeysets({ en: en.default, ru: ru.default }, `${cn.NAMESPACE}${COMPONENT}`);

exports.default = i18n;
//# sourceMappingURL=index.cjs.map
