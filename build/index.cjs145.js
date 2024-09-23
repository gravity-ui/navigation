'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _trimmedEndIndex = require('./index.cjs160.js');

var trimmedEndIndex = _trimmedEndIndex._trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim;

exports._baseTrim = _baseTrim;
//# sourceMappingURL=index.cjs145.js.map
