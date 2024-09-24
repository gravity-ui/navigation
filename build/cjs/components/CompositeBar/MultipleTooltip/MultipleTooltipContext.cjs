'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');

const multipleTooltipContextDefaults = {
  active: false,
  activeIndex: void 0,
  hideCollapseItemTooltip: false,
  lastClickedItemIndex: void 0,
  setValue: () => {
  }
};
const MultipleTooltipContext = index.default.createContext(
  multipleTooltipContextDefaults
);
class MultipleTooltipProvider extends index.default.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      ...multipleTooltipContextDefaults
    };
    this.setValue = (value) => {
      this.setState({ ...value });
    };
  }
  render() {
    const { children } = this.props;
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(MultipleTooltipContext.Provider, { value: { ...this.state, setValue: this.setValue }, children });
  }
}

exports.MultipleTooltipContext = MultipleTooltipContext;
exports.MultipleTooltipProvider = MultipleTooltipProvider;
//# sourceMappingURL=MultipleTooltipContext.cjs.map
