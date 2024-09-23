import { __module as classname } from './index.es80.js';
import { __require as requireClassname_production_min } from './index.es81.js';
import { __require as requireClassname_development } from './index.es82.js';

if (process.env.NODE_ENV === 'production') {
  classname.exports = requireClassname_production_min();
} else {
  classname.exports = requireClassname_development();
}

var classnameExports = classname.exports;

export { classnameExports as c };
//# sourceMappingURL=index.es42.js.map
