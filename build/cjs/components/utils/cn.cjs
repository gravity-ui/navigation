'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const classname = require('@bem-react/classname');

const NAMESPACE = "gn-";
classname.withNaming({ e: "__", m: "_" });
const block = classname.withNaming({ n: NAMESPACE, e: "__", m: "_" });

exports.NAMESPACE = NAMESPACE;
exports.block = block;
//# sourceMappingURL=cn.cjs.map
