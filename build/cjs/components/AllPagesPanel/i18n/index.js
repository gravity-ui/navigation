'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var i18n$1 = require('@gravity-ui/uikit/i18n');
var cn = require('../../utils/cn.js');
var en = require('./en.json.js');
var ru = require('./ru.json.js');

const COMPONENT = 'AllPagesPanel';
var i18n = i18n$1.addComponentKeysets({ en: en["default"], ru: ru["default"] }, `${cn.NAMESPACE}${COMPONENT}`);

exports["default"] = i18n;
//# sourceMappingURL=index.js.map
