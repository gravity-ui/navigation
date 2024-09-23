import { __module as reactIs } from './index.es147.js';
import { __require as requireReactIs_production_min } from './index.es148.js';
import { __require as requireReactIs_development } from './index.es149.js';

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	if (process.env.NODE_ENV === 'production') {
	  reactIs.exports = requireReactIs_production_min();
	} else {
	  reactIs.exports = requireReactIs_development();
	}
	return reactIs.exports;
}

export { requireReactIs as __require };
//# sourceMappingURL=index.es126.js.map
