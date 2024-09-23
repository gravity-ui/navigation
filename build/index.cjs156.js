'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

exports.PluralForm = void 0;
(function (PluralForm) {
    PluralForm[PluralForm["One"] = 0] = "One";
    PluralForm[PluralForm["Few"] = 1] = "Few";
    PluralForm[PluralForm["Many"] = 2] = "Many";
    PluralForm[PluralForm["None"] = 3] = "None";
})(exports.PluralForm || (exports.PluralForm = {}));
function isPluralValue(value) {
    return typeof value !== 'string';
}

exports.isPluralValue = isPluralValue;
//# sourceMappingURL=index.cjs156.js.map
