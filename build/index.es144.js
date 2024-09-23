import { _ as _freeGlobal } from './index.es163.js';

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var _root = root;

export { _root as _ };
//# sourceMappingURL=index.es144.js.map
