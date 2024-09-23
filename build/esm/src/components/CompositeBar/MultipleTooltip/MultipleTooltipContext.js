import React__default from 'react';

const multipleTooltipContextDefaults = {
    active: false,
    activeIndex: undefined,
    hideCollapseItemTooltip: false,
    lastClickedItemIndex: undefined,
    setValue: () => { },
};
const MultipleTooltipContext = React__default.createContext(multipleTooltipContextDefaults);
class MultipleTooltipProvider extends React__default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = Object.assign({}, multipleTooltipContextDefaults);
        this.setValue = (value) => {
            this.setState(Object.assign({}, value));
        };
    }
    render() {
        const { children } = this.props;
        return (React__default.createElement(MultipleTooltipContext.Provider, { value: Object.assign(Object.assign({}, this.state), { setValue: this.setValue }) }, children));
    }
}

export { MultipleTooltipContext, MultipleTooltipProvider };
//# sourceMappingURL=MultipleTooltipContext.js.map
