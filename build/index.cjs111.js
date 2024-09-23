'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const _commonjsHelpers = require('./index.cjs93.js');
const index$1 = require('./index.cjs125.js');
const index = require('./index.cjs126.js');
const factoryWithTypeCheckers = require('./index.cjs127.js');
const factoryWithThrowingShims = require('./index.cjs128.js');

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = index.__require();

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  index$1.__module.exports = factoryWithTypeCheckers.__require()(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  index$1.__module.exports = factoryWithThrowingShims.__require()();
}

var propTypesExports = index$1.__module.exports;
const PropTypes = /*@__PURE__*/_commonjsHelpers.getDefaultExportFromCjs(propTypesExports);

exports.default = PropTypes;
//# sourceMappingURL=index.cjs111.js.map
