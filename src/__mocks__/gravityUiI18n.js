function addComponentKeysets(keysets) {
    const dict = keysets.en || {};
    return (key) => dict[key] || key;
}

module.exports = {
    addComponentKeysets,
};
