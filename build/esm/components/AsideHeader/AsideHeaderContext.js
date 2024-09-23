import React__default from 'react';

const AsideHeaderInnerContext = React__default.createContext(undefined);
AsideHeaderInnerContext.displayName = 'AsideHeaderInnerContext';
const AsideHeaderInnerContextProvider = AsideHeaderInnerContext.Provider;
const useAsideHeaderInnerContext = () => {
    const contextValue = React__default.useContext(AsideHeaderInnerContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderInnerContext is not initialized.
        Please check if you wrapped your component with AsideHeaderInnerContext.Provider`);
    }
    return contextValue;
};
const AsideHeaderContext = React__default.createContext({
    compact: false,
    size: 0,
});
AsideHeaderContext.displayName = 'AsideHeaderContext';
const AsideHeaderContextProvider = AsideHeaderContext.Provider;
const useAsideHeaderContext = () => {
    const contextValue = React__default.useContext(AsideHeaderContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderContext is not initialized.
        Please check if you wrapped your component with AsideHeader
        Context.Provider`);
    }
    return contextValue;
};

export { AsideHeaderContext, AsideHeaderContextProvider, AsideHeaderInnerContext, AsideHeaderInnerContextProvider, useAsideHeaderContext, useAsideHeaderInnerContext };
//# sourceMappingURL=AsideHeaderContext.js.map
