import React__default from 'react';
import { getSelectedSettingsPart } from '../collect-settings.js';

const defaultValue = {};
const context = React__default.createContext(defaultValue);
context.displayName = 'SettingsSelectionContext';
function useSettingsSelectionProviderValue(pages, selection) {
    const selectedRef = React__default.useRef(null);
    const contextValue = React__default.useMemo(() => {
        if (!selection)
            return { selectedRef };
        return Object.assign({ selectedRef }, getSelectedSettingsPart(pages, selection));
    }, [pages, selection]);
    return contextValue;
}
const SettingsSelectionContextProvider = context.Provider;
function useSettingsSelectionContext() {
    return React__default.useContext(context);
}

export { SettingsSelectionContextProvider, useSettingsSelectionContext, useSettingsSelectionProviderValue };
//# sourceMappingURL=context.js.map
