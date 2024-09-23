'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var icons = require('@gravity-ui/icons');
var uikit = require('@gravity-ui/uikit');
var AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.js');
var cn = require('../utils/cn.js');
var AllPagesListItem = require('./AllPagesListItem/AllPagesListItem.js');
var constants = require('./constants.js');
var index = require('./i18n/index.js');
var useGroupedMenuItems = require('./useGroupedMenuItems.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('all-pages-panel');
const AllPagesPanel = (props) => {
    const { startEditIcon, onEditModeChanged, className } = props;
    const { menuItems, onMenuItemsChanged } = AsideHeaderContext.useAsideHeaderInnerContext();
    const menuItemsRef = React.useRef(menuItems);
    menuItemsRef.current = menuItems;
    const [isEditMode, setIsEditMode] = React.useState(false);
    const toggleEditMode = React.useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);
    const groupedItems = useGroupedMenuItems.useGroupedMenuItems(menuItems);
    React.useEffect(() => {
        onEditModeChanged === null || onEditModeChanged === void 0 ? void 0 : onEditModeChanged(isEditMode);
    }, [isEditMode, onEditModeChanged]);
    const onItemClick = React.useCallback((item) => {
        var _a;
        //@ts-ignore TODO fix when @gravity-ui/uikit/List will provide event arg on item click
        (_a = item.onItemClick) === null || _a === void 0 ? void 0 : _a.call(item, item, false);
    }, []);
    const togglePageVisibility = React.useCallback((item) => {
        if (!onMenuItemsChanged) {
            return;
        }
        const changedItem = Object.assign(Object.assign({}, item), { hidden: !item.hidden });
        const originItems = menuItemsRef.current.filter((menuItem) => menuItem.id !== constants.ALL_PAGES_ID);
        onMenuItemsChanged(originItems.map((menuItem) => {
            if (menuItem.id !== changedItem.id) {
                return menuItem;
            }
            return changedItem;
        }));
    }, [onMenuItemsChanged]);
    const itemRender = React.useCallback((item, _isActive, _itemIndex) => (React__default["default"].createElement(AllPagesListItem.AllPagesListItem, { item: item, editMode: isEditMode, onToggle: () => togglePageVisibility(item) })), [isEditMode, togglePageVisibility]);
    const onResetToDefaultClick = React.useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        const originItems = menuItemsRef.current.filter((item) => item.id !== constants.ALL_PAGES_ID);
        onMenuItemsChanged(originItems.map((item) => (Object.assign(Object.assign({}, item), { hidden: false }))));
    }, [onMenuItemsChanged]);
    return (React__default["default"].createElement(uikit.Flex, { className: b(null, className), gap: "5", direction: "column" },
        React__default["default"].createElement(uikit.Flex, { gap: "4", alignItems: "center", justifyContent: "space-between" },
            React__default["default"].createElement(uikit.Text, { variant: "subheader-2" }, isEditMode ? index["default"]('all-panel.title.editing') : index["default"]('all-panel.title.main')),
            React__default["default"].createElement(uikit.Button, { selected: isEditMode, view: "normal", onClick: toggleEditMode }, startEditIcon ? startEditIcon : React__default["default"].createElement(uikit.Icon, { data: icons.Gear }))),
        React__default["default"].createElement(uikit.Flex, { className: b('content'), gap: "5", direction: "column" }, Object.keys(groupedItems).map((category) => {
            return (React__default["default"].createElement(uikit.Flex, { key: category, direction: "column", gap: "3" },
                React__default["default"].createElement(uikit.Text, { className: b('category'), variant: "body-1", color: "secondary" }, category),
                React__default["default"].createElement(uikit.List, { virtualized: false, filterable: false, items: groupedItems[category], onItemClick: onItemClick, renderItem: itemRender })));
        })),
        isEditMode && (React__default["default"].createElement(uikit.Button, { onClick: onResetToDefaultClick }, index["default"]('all-panel.resetToDefault')))));
};

exports.AllPagesPanel = AllPagesPanel;
//# sourceMappingURL=AllPagesPanel.js.map
