'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _root = require('./index.cjs144.js');

var root = _root._root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

var now_1 = now;

exports.now_1 = now_1;
//# sourceMappingURL=index.cjs122.js.map
