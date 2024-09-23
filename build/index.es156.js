var PluralForm;
(function (PluralForm) {
    PluralForm[PluralForm["One"] = 0] = "One";
    PluralForm[PluralForm["Few"] = 1] = "Few";
    PluralForm[PluralForm["Many"] = 2] = "Many";
    PluralForm[PluralForm["None"] = 3] = "None";
})(PluralForm || (PluralForm = {}));
function isPluralValue(value) {
    return typeof value !== 'string';
}

export { PluralForm, isPluralValue };
//# sourceMappingURL=index.es156.js.map
