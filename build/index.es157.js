function pluralizerEn (count, pluralForms) {
    if (count === 0) {
        return pluralForms.None;
    }
    if (count === 1 || count === -1) {
        return pluralForms.One;
    }
    return pluralForms.Many;
}

export { pluralizerEn as default };
//# sourceMappingURL=index.es157.js.map
