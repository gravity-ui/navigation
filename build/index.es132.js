import { jsx } from 'react/jsx-runtime';
import React__default from 'react';

const multipleTooltipContextDefaults = {
  active: false,
  activeIndex: void 0,
  hideCollapseItemTooltip: false,
  lastClickedItemIndex: void 0,
  setValue: () => {
  }
};
const MultipleTooltipContext = React__default.createContext(
  multipleTooltipContextDefaults
);
class MultipleTooltipProvider extends React__default.PureComponent {
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
    return /* @__PURE__ */ jsx(MultipleTooltipContext.Provider, { value: { ...this.state, setValue: this.setValue }, children });
  }
}

export { MultipleTooltipContext, MultipleTooltipProvider };
//# sourceMappingURL=index.es132.js.map
