import React from '../../../node_modules/react/index.mjs';
import { getSelectedSettingsPart } from '../collect-settings.mjs';

const defaultValue = {};
const context = React.createContext(defaultValue);
context.displayName = "SettingsSelectionContext";
function useSettingsSelectionProviderValue(pages, selection) {
  const selectedRef = React.useRef(null);
  const contextValue = React.useMemo(() => {
    if (!selection) return { selectedRef };
    return { selectedRef, ...getSelectedSettingsPart(pages, selection) };
  }, [pages, selection]);
  return contextValue;
}
const SettingsSelectionContextProvider = context.Provider;
function useSettingsSelectionContext() {
  return React.useContext(context);
}

export { SettingsSelectionContextProvider, useSettingsSelectionContext, useSettingsSelectionProviderValue };
//# sourceMappingURL=context.mjs.map
