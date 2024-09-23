'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var useAsideHeaderTopPanel = require('../useAsideHeaderTopPanel.js');
var utils = require('../utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const TopPanel = ({ topAlert }) => {
    const { topRef, updateTopSize } = useAsideHeaderTopPanel.useAsideHeaderTopPanel({ topAlert });
    const [opened, setOpened] = React__default["default"].useState(true);
    const handleClose = React__default["default"].useCallback(() => {
        var _a;
        setOpened(false);
        (_a = topAlert === null || topAlert === void 0 ? void 0 : topAlert.onCloseTopAlert) === null || _a === void 0 ? void 0 : _a.call(topAlert);
    }, [topAlert]);
    React__default["default"].useEffect(() => {
        if (!opened) {
            updateTopSize();
        }
    }, [opened, updateTopSize]);
    if (!topAlert || !topAlert.message) {
        return null;
    }
    return (React__default["default"].createElement("div", { ref: topRef, className: utils.b('pane-top', { opened }) }, opened && (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(uikit.Alert, { className: utils.b('pane-top-alert', {
                centered: topAlert.centered,
                dense: topAlert.dense,
            }), corners: "square", layout: "horizontal", theme: topAlert.theme || 'warning', view: topAlert.view, icon: topAlert.icon, title: topAlert.title, message: topAlert.message, actions: topAlert.actions, onClose: topAlert.closable ? handleClose : undefined }),
        React__default["default"].createElement("div", { className: utils.b('pane-top-divider') })))));
};

exports.TopPanel = TopPanel;
//# sourceMappingURL=TopPanel.js.map
