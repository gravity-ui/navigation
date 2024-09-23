'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const multipleTooltipContextDefaults = {
    active: false,
    activeIndex: undefined,
    hideCollapseItemTooltip: false,
    lastClickedItemIndex: undefined,
    setValue: () => { },
};
const MultipleTooltipContext = React__default["default"].createContext(multipleTooltipContextDefaults);
class MultipleTooltipProvider extends React__default["default"].PureComponent {
    constructor() {
        super(...arguments);
        this.state = Object.assign({}, multipleTooltipContextDefaults);
        this.setValue = (value) => {
            this.setState(Object.assign({}, value));
        };
    }
    render() {
        const { children } = this.props;
        return (React__default["default"].createElement(MultipleTooltipContext.Provider, { value: Object.assign(Object.assign({}, this.state), { setValue: this.setValue }) }, children));
    }
}

exports.MultipleTooltipContext = MultipleTooltipContext;
exports.MultipleTooltipProvider = MultipleTooltipProvider;
//# sourceMappingURL=MultipleTooltipContext.js.map
