'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');

const AsideHeaderInnerContext = index.default.createContext(
  void 0
);
AsideHeaderInnerContext.displayName = "AsideHeaderInnerContext";
const AsideHeaderInnerContextProvider = AsideHeaderInnerContext.Provider;
const useAsideHeaderInnerContext = () => {
  const contextValue = index.default.useContext(AsideHeaderInnerContext);
  if (contextValue === void 0) {
    throw new Error(`AsideHeaderInnerContext is not initialized.
        Please check if you wrapped your component with AsideHeaderInnerContext.Provider`);
  }
  return contextValue;
};
const AsideHeaderContext = index.default.createContext({
  compact: false,
  size: 0
});
AsideHeaderContext.displayName = "AsideHeaderContext";
const AsideHeaderContextProvider = AsideHeaderContext.Provider;
const useAsideHeaderContext = () => {
  const contextValue = index.default.useContext(AsideHeaderContext);
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
//# sourceMappingURL=AsideHeaderContext.cjs.map
