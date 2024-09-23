'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('settings-menu-mobile');
const SettingsMenuMobile = ({ items, onChange, activeItemId, className, }) => {
    const ref = React__default["default"].useRef(null);
    const tabItems = React__default["default"].useMemo(() => {
        const tabItems = [];
        items.forEach((firstLevelItem) => {
            if ('groupTitle' in firstLevelItem) {
                tabItems.push(...firstLevelItem.items.map(({ id, title, disabled, withBadge }) => ({
                    id,
                    title,
                    disabled,
                    className: b('item', { badge: withBadge }),
                })));
            }
            else {
                const { id, title, disabled, withBadge } = firstLevelItem;
                tabItems.push({ id, title, disabled, className: b('item', { badge: withBadge }) });
            }
        });
        return tabItems;
    }, [items]);
    const handleTouchMove = (e) => {
        e.stopPropagation();
    };
    return (React__default["default"].createElement("div", { ref: ref, onTouchMove: handleTouchMove },
        React__default["default"].createElement(uikit.Tabs, { items: tabItems, className: b(null, className), size: "l", activeTab: activeItemId, onSelectTab: onChange })));
};

exports.SettingsMenuMobile = SettingsMenuMobile;
//# sourceMappingURL=SettingsMenuMobile.js.map
