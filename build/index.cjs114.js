'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index.cjs111.js');

var timeoutsShape = process.env.NODE_ENV !== 'production' ? index.default.oneOfType([index.default.number, index.default.shape({
  enter: index.default.number,
  exit: index.default.number,
  appear: index.default.number
}).isRequired]) : null;
var classNamesShape = process.env.NODE_ENV !== 'production' ? index.default.oneOfType([index.default.string, index.default.shape({
  enter: index.default.string,
  exit: index.default.string,
  active: index.default.string
}), index.default.shape({
  enter: index.default.string,
  enterDone: index.default.string,
  enterActive: index.default.string,
  exit: index.default.string,
  exitDone: index.default.string,
  exitActive: index.default.string
})]) : null;

exports.classNamesShape = classNamesShape;
exports.timeoutsShape = timeoutsShape;
//# sourceMappingURL=index.cjs114.js.map
