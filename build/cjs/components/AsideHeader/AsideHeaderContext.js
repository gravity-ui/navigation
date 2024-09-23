'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const AsideHeaderInnerContext = React__default["default"].createContext(undefined);
AsideHeaderInnerContext.displayName = 'AsideHeaderInnerContext';
const AsideHeaderInnerContextProvider = AsideHeaderInnerContext.Provider;
const useAsideHeaderInnerContext = () => {
    const contextValue = React__default["default"].useContext(AsideHeaderInnerContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderInnerContext is not initialized.
        Please check if you wrapped your component with AsideHeaderInnerContext.Provider`);
    }
    return contextValue;
};
const AsideHeaderContext = React__default["default"].createContext({
    compact: false,
    size: 0,
});
AsideHeaderContext.displayName = 'AsideHeaderContext';
const AsideHeaderContextProvider = AsideHeaderContext.Provider;
const useAsideHeaderContext = () => {
    const contextValue = React__default["default"].useContext(AsideHeaderContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderContext is not initialized.
        Please check if you wrapped your component with AsideHeader
        Context.Provider`);
    }
    return contextValue;
};

exports.AsideHeaderContext = AsideHeaderContext;
exports.AsideHeaderContextProvider = AsideHeaderContextProvider;
exports.AsideHeaderInnerContext = AsideHeaderInnerContext;
exports.AsideHeaderInnerContextProvider = AsideHeaderInnerContextProvider;
exports.useAsideHeaderContext = useAsideHeaderContext;
exports.useAsideHeaderInnerContext = useAsideHeaderInnerContext;
//# sourceMappingURL=AsideHeaderContext.js.map
