'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var debounce = require('../../../../node_modules/lodash/debounce.js');
var cn = require('../../utils/cn.js');
var helpers = require('../helpers.js');
var index = require('../i18n/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('settings-search');
function SettingsSearch({ className, initialValue, onChange, debounce: debounce$1 = 200, inputRef, inputSize, placeholder, autoFocus = true, }) {
    const [value, setValue] = React__default["default"].useState(initialValue !== null && initialValue !== void 0 ? initialValue : '');
    const onChangeDebounced = helpers.useStableCallback(debounce["default"](onChange, debounce$1));
    const handleUpdate = helpers.useStableCallback((updated) => {
        setValue(updated);
        onChangeDebounced(updated);
    });
    return (React__default["default"].createElement("div", { className: b(null, className) },
        React__default["default"].createElement(uikit.TextInput, { value: value, controlRef: inputRef, hasClear: true, autoFocus: autoFocus, size: inputSize, placeholder: placeholder, onUpdate: handleUpdate, controlProps: {
                'aria-label': index["default"]('label_search'),
            } })));
}

exports.SettingsSearch = SettingsSearch;
//# sourceMappingURL=SettingsSearch.js.map
