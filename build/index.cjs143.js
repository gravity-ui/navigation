'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

exports.Lang = void 0;
(function (Lang) {
    Lang["Ru"] = "ru";
    Lang["En"] = "en";
})(exports.Lang || (exports.Lang = {}));
const config = {
    lang: exports.Lang.En,
};
const getConfig = () => config;

exports.getConfig = getConfig;
//# sourceMappingURL=index.cjs143.js.map
