'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var collectSettings = require('../collect-settings.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const defaultValue = {};
const context = React__default["default"].createContext(defaultValue);
context.displayName = 'SettingsSelectionContext';
function useSettingsSelectionProviderValue(pages, selection) {
    const selectedRef = React__default["default"].useRef(null);
    const contextValue = React__default["default"].useMemo(() => {
        if (!selection)
            return { selectedRef };
        return Object.assign({ selectedRef }, collectSettings.getSelectedSettingsPart(pages, selection));
    }, [pages, selection]);
    return contextValue;
}
const SettingsSelectionContextProvider = context.Provider;
function useSettingsSelectionContext() {
    return React__default["default"].useContext(context);
}

exports.SettingsSelectionContextProvider = SettingsSelectionContextProvider;
exports.useSettingsSelectionContext = useSettingsSelectionContext;
exports.useSettingsSelectionProviderValue = useSettingsSelectionProviderValue;
//# sourceMappingURL=context.js.map
