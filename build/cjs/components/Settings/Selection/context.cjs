'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');
const collectSettings = require('../collect-settings.cjs');

const defaultValue = {};
const context = React.createContext(defaultValue);
context.displayName = "SettingsSelectionContext";
function useSettingsSelectionProviderValue(pages, selection) {
  const selectedRef = React.useRef(null);
  const contextValue = React.useMemo(() => {
    if (!selection) return { selectedRef };
    return { selectedRef, ...collectSettings.getSelectedSettingsPart(pages, selection) };
  }, [pages, selection]);
  return contextValue;
}
const SettingsSelectionContextProvider = context.Provider;
function useSettingsSelectionContext() {
  return React.useContext(context);
}

exports.SettingsSelectionContextProvider = SettingsSelectionContextProvider;
exports.useSettingsSelectionContext = useSettingsSelectionContext;
exports.useSettingsSelectionProviderValue = useSettingsSelectionProviderValue;
//# sourceMappingURL=context.cjs.map
