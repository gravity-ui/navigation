'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

var has;
var hasRequiredHas;

function requireHas () {
	if (hasRequiredHas) return has;
	hasRequiredHas = 1;
	has = Function.call.bind(Object.prototype.hasOwnProperty);
	return has;
}

exports.__require = requireHas;
//# sourceMappingURL=index.cjs152.js.map
