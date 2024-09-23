'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./index.cjs147.js');
const reactIs_production_min = require('./index.cjs148.js');
const reactIs_development = require('./index.cjs149.js');

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return index.__module.exports;
	hasRequiredReactIs = 1;

	if (process.env.NODE_ENV === 'production') {
	  index.__module.exports = reactIs_production_min.__require();
	} else {
	  index.__module.exports = reactIs_development.__require();
	}
	return index.__module.exports;
}

exports.__require = requireReactIs;
//# sourceMappingURL=index.cjs126.js.map
