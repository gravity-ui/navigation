const PARAM_REGEXP = /{{(.*?)}}/g;
function replaceParams(keyValue, params) {
    let result = '';
    let lastIndex = (PARAM_REGEXP.lastIndex = 0);
    let match;
    while ((match = PARAM_REGEXP.exec(keyValue))) {
        if (lastIndex !== match.index) {
            result += keyValue.slice(lastIndex, match.index);
        }
        lastIndex = PARAM_REGEXP.lastIndex;
        const [all, key] = match;
        if (key && Object.prototype.hasOwnProperty.call(params, key)) {
            result += params[key];
        }
        else {
            result += all;
        }
    }
    if (lastIndex < keyValue.length) {
        result += keyValue.slice(lastIndex);
    }
    return result;
}

export { replaceParams };
//# sourceMappingURL=index.es154.js.map
