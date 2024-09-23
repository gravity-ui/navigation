'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index.cjs80.js');
const classname_production_min = require('./index.cjs81.js');
const classname_development = require('./index.cjs82.js');

if (process.env.NODE_ENV === 'production') {
  index.__module.exports = classname_production_min.__require();
} else {
  index.__module.exports = classname_development.__require();
}

var classnameExports = index.__module.exports;

exports.classnameExports = classnameExports;
//# sourceMappingURL=index.cjs42.js.map
