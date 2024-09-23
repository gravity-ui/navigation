'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _baseGetTag = require('./index.cjs161.js');
const isObjectLike$1 = require('./index.cjs162.js');

var baseGetTag = _baseGetTag._baseGetTag,
    isObjectLike = isObjectLike$1.isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

exports.isSymbol_1 = isSymbol_1;
//# sourceMappingURL=index.cjs146.js.map
