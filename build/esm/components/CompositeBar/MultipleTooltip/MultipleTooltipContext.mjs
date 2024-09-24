import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../node_modules/react/index.mjs';

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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MultipleTooltipContext.Provider, { value: { ...this.state, setValue: this.setValue }, children });
  }
}

export { MultipleTooltipContext, MultipleTooltipProvider };
//# sourceMappingURL=MultipleTooltipContext.mjs.map
