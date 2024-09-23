'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');
var helpers = require('../helpers.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('settings-menu');
const SettingsMenu = React__default["default"].forwardRef(
// eslint-disable-next-line prefer-arrow-callback
function SettingsMenu({ items, onChange, activeItemId }, ref) {
    const [focusItemId, setFocusId] = React__default["default"].useState();
    const containerRef = React__default["default"].useRef(null);
    const handleChange = helpers.useStableCallback(onChange);
    const getFocused = helpers.useCurrent(focusItemId);
    React__default["default"].useImperativeHandle(ref, () => ({
        handleKeyDown(event) {
            if (!containerRef.current) {
                return false;
            }
            const focused = getFocused();
            if (focused && event.key === 'Enter') {
                handleChange(focused);
                return true;
            }
            else if (event.key === 'ArrowDown') {
                setFocusId(focusNext(containerRef.current, focused, 1));
                return true;
            }
            else if (event.key === 'ArrowUp') {
                setFocusId(focusNext(containerRef.current, focused, -1));
                return true;
            }
            return false;
        },
        clearFocus() {
            setFocusId(undefined);
        },
    }), [getFocused, handleChange]);
    return (React__default["default"].createElement("div", { ref: containerRef, className: b() }, items.map((firstLevelItem) => {
        if ('groupTitle' in firstLevelItem) {
            return (React__default["default"].createElement("div", { key: firstLevelItem.groupTitle, className: b('group') },
                React__default["default"].createElement("span", { className: b('group-heading') }, firstLevelItem.groupTitle),
                firstLevelItem.items.map((item) => {
                    return renderMenuItem(item, onChange, activeItemId, focusItemId);
                })));
        }
        return renderMenuItem(firstLevelItem, onChange, activeItemId, focusItemId);
    })));
});
function renderMenuItem(item, onChange, activeItemId, focusItemId) {
    return (React__default["default"].createElement("span", { key: item.title, className: b('item', {
            selected: activeItemId === item.id,
            disabled: item.disabled,
            focused: focusItemId === item.id,
            badge: item.withBadge,
        }), onClick: () => {
            if (!item.disabled) {
                onChange(item.id);
            }
        }, "data-id": item.id },
        item.icon ? React__default["default"].createElement(uikit.Icon, Object.assign({ size: 16 }, item.icon, { className: b('item-icon') })) : undefined,
        React__default["default"].createElement("span", null, item.title)));
}
function focusNext(container, focused, direction) {
    var _a;
    const elements = container.querySelectorAll(`.${b('item')}:not(.${b('item')}_disabled)`);
    if (elements.length === 0) {
        return undefined;
    }
    let currentIndex = direction > 0 ? -1 : 0;
    if (focused) {
        currentIndex = Array.prototype.findIndex.call(elements, (element) => element.getAttribute('data-id') === focused);
    }
    currentIndex = (elements.length + currentIndex + direction) % elements.length;
    return (_a = elements[currentIndex].getAttribute('data-id')) !== null && _a !== void 0 ? _a : undefined;
}

exports.SettingsMenu = SettingsMenu;
//# sourceMappingURL=SettingsMenu.js.map
