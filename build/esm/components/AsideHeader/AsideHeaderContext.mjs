import React from '../../node_modules/react/index.mjs';

const AsideHeaderInnerContext = React.createContext(
  void 0
);
AsideHeaderInnerContext.displayName = "AsideHeaderInnerContext";
const AsideHeaderInnerContextProvider = AsideHeaderInnerContext.Provider;
const useAsideHeaderInnerContext = () => {
  const contextValue = React.useContext(AsideHeaderInnerContext);
  if (contextValue === void 0) {
    throw new Error(`AsideHeaderInnerContext is not initialized.
        Please check if you wrapped your component with AsideHeaderInnerContext.Provider`);
  }
  return contextValue;
};
const AsideHeaderContext = React.createContext({
  compact: false,
  size: 0
});
AsideHeaderContext.displayName = "AsideHeaderContext";
const AsideHeaderContextProvider = AsideHeaderContext.Provider;
const useAsideHeaderContext = () => {
  const contextValue = React.useContext(AsideHeaderContext);
  if (contextValue === void 0) {
    throw new Error(`AsideHeaderContext is not initialized.
        Please check if you wrapped your component with AsideHeader
        Context.Provider`);
  }
  return contextValue;
};

export { AsideHeaderContext, AsideHeaderContextProvider, AsideHeaderInnerContext, AsideHeaderInnerContextProvider, useAsideHeaderContext, useAsideHeaderInnerContext };
//# sourceMappingURL=AsideHeaderContext.mjs.map
