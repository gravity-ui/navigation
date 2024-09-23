import { i18n } from './index.es118.js';

function addComponentKeysets(data, keysetName) {
    Object.entries(data).forEach(([lang, keys]) => i18n.registerKeyset(lang, keysetName, keys));
    return i18n.keyset(keysetName);
}

export { addComponentKeysets };
//# sourceMappingURL=index.es77.js.map
