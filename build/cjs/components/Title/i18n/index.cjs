'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const addComponentKeysets = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/utils/addComponentKeysets.cjs');
const cn = require('../../utils/cn.cjs');
const en = require('./en.json.cjs');
const ru = require('./ru.json.cjs');

const COMPONENT = "Title";
const i18n = addComponentKeysets.addComponentKeysets({ en: en.default, ru: ru.default }, `${cn.NAMESPACE}${COMPONENT}`);

exports.default = i18n;
//# sourceMappingURL=index.cjs.map
