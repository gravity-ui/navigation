'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const reactIs_production_min = require('./index.cjs164.js');

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min () {
	if (hasRequiredReactIs_production_min) return reactIs_production_min.__exports;
	hasRequiredReactIs_production_min = 1;
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
	Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
	function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}reactIs_production_min.__exports.AsyncMode=l;reactIs_production_min.__exports.ConcurrentMode=m;reactIs_production_min.__exports.ContextConsumer=k;reactIs_production_min.__exports.ContextProvider=h;reactIs_production_min.__exports.Element=c;reactIs_production_min.__exports.ForwardRef=n;reactIs_production_min.__exports.Fragment=e;reactIs_production_min.__exports.Lazy=t;reactIs_production_min.__exports.Memo=r;reactIs_production_min.__exports.Portal=d;
	reactIs_production_min.__exports.Profiler=g;reactIs_production_min.__exports.StrictMode=f;reactIs_production_min.__exports.Suspense=p;reactIs_production_min.__exports.isAsyncMode=function(a){return A(a)||z(a)===l};reactIs_production_min.__exports.isConcurrentMode=A;reactIs_production_min.__exports.isContextConsumer=function(a){return z(a)===k};reactIs_production_min.__exports.isContextProvider=function(a){return z(a)===h};reactIs_production_min.__exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.__exports.isForwardRef=function(a){return z(a)===n};reactIs_production_min.__exports.isFragment=function(a){return z(a)===e};reactIs_production_min.__exports.isLazy=function(a){return z(a)===t};
	reactIs_production_min.__exports.isMemo=function(a){return z(a)===r};reactIs_production_min.__exports.isPortal=function(a){return z(a)===d};reactIs_production_min.__exports.isProfiler=function(a){return z(a)===g};reactIs_production_min.__exports.isStrictMode=function(a){return z(a)===f};reactIs_production_min.__exports.isSuspense=function(a){return z(a)===p};
	reactIs_production_min.__exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};reactIs_production_min.__exports.typeOf=z;
	return reactIs_production_min.__exports;
}

exports.__require = requireReactIs_production_min;
//# sourceMappingURL=index.cjs148.js.map
