'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../../node_modules/react/index.cjs');
const collectSettings = require('../collect-settings.cjs');

const defaultValue = {};
const context = index.default.createContext(defaultValue);
context.displayName = "SettingsSelectionContext";
function useSettingsSelectionProviderValue(pages, selection) {
  const selectedRef = index.default.useRef(null);
  const contextValue = index.default.useMemo(() => {
    if (!selection) return { selectedRef };
    return { selectedRef, ...collectSettings.getSelectedSettingsPart(pages, selection) };
  }, [pages, selection]);
  return contextValue;
}
const SettingsSelectionContextProvider = context.Provider;
function useSettingsSelectionContext() {
  return index.default.useContext(context);
}

exports.SettingsSelectionContextProvider = SettingsSelectionContextProvider;
exports.useSettingsSelectionContext = useSettingsSelectionContext;
exports.useSettingsSelectionProviderValue = useSettingsSelectionProviderValue;
//# sourceMappingURL=context.cjs.map
