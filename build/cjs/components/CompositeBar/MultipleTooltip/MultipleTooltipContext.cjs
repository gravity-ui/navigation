'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');

const multipleTooltipContextDefaults = {
  active: false,
  activeIndex: void 0,
  hideCollapseItemTooltip: false,
  lastClickedItemIndex: void 0,
  setValue: () => {
  }
};
const MultipleTooltipContext = React.createContext(
  multipleTooltipContextDefaults
);
class MultipleTooltipProvider extends React.PureComponent {
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
    return /* @__PURE__ */ jsxRuntime.jsx(MultipleTooltipContext.Provider, { value: { ...this.state, setValue: this.setValue }, children });
  }
}

exports.MultipleTooltipContext = MultipleTooltipContext;
exports.MultipleTooltipProvider = MultipleTooltipProvider;
//# sourceMappingURL=MultipleTooltipContext.cjs.map
