'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');

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

exports.AsideHeaderContext = AsideHeaderContext;
exports.AsideHeaderContextProvider = AsideHeaderContextProvider;
exports.AsideHeaderInnerContext = AsideHeaderInnerContext;
exports.AsideHeaderInnerContextProvider = AsideHeaderInnerContextProvider;
exports.useAsideHeaderContext = useAsideHeaderContext;
exports.useAsideHeaderInnerContext = useAsideHeaderInnerContext;
//# sourceMappingURL=index.cjs3.js.map
