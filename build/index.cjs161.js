'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _Symbol = require('./index.cjs168.js');
const _getRawTag = require('./index.cjs169.js');
const _objectToString = require('./index.cjs170.js');

var Symbol$1 = _Symbol._Symbol,
    getRawTag = _getRawTag._getRawTag,
    objectToString = _objectToString._objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag;

exports._baseGetTag = _baseGetTag;
//# sourceMappingURL=index.cjs161.js.map
