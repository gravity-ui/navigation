'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var AllPagesPanel = require('../AllPagesPanel/AllPagesPanel.js');
var constants = require('../AllPagesPanel/constants.js');
var types = require('./types.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const EMPTY_MENU_ITEMS = [];
const useAsideHeaderInnerContextValue = (props) => {
    const { size, onClosePanel, menuItems, panelItems, onMenuItemsChanged } = props;
    const [innerVisiblePanel, setInnerVisiblePanel] = React.useState();
    const ALL_PAGES_MENU_ITEM = React__default["default"].useMemo(() => {
        return constants.getAllPagesMenuItem();
    }, []);
    const allPagesIsAvailable = Boolean(onMenuItemsChanged) && (!menuItems || (menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) > 0);
    React.useEffect(() => {
        // If any user panel became visible we need to switch off all inner panels
        if (panelItems === null || panelItems === void 0 ? void 0 : panelItems.some((x) => x.visible)) {
            setInnerVisiblePanel(undefined);
        }
    }, [panelItems]);
    const innerOnClosePanel = React.useCallback(() => {
        setInnerVisiblePanel(undefined);
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
    }, [onClosePanel]);
    const onItemClick = React.useCallback((item, collapsed, event) => {
        var _a;
        if (item.id === ALL_PAGES_MENU_ITEM.id) {
            onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
            setInnerVisiblePanel((prev) => prev === types.InnerPanels.AllPages ? undefined : types.InnerPanels.AllPages);
        }
        else {
            innerOnClosePanel();
        }
        (_a = item.onItemClick) === null || _a === void 0 ? void 0 : _a.call(item, item, collapsed, event);
    }, [innerOnClosePanel, ALL_PAGES_MENU_ITEM, onClosePanel]);
    const innerMenuItems = React.useMemo(() => allPagesIsAvailable
        ? [
            ...(menuItems || EMPTY_MENU_ITEMS),
            Object.assign(Object.assign({}, ALL_PAGES_MENU_ITEM), { current: innerVisiblePanel === types.InnerPanels.AllPages }),
        ]
        : menuItems || EMPTY_MENU_ITEMS, [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM]);
    const innerPanelItems = React.useMemo(() => {
        if (!allPagesIsAvailable) {
            return panelItems;
        }
        return [
            ...(panelItems || []),
            {
                id: types.InnerPanels.AllPages,
                content: React__default["default"].createElement(AllPagesPanel.AllPagesPanel, null),
                visible: innerVisiblePanel === types.InnerPanels.AllPages,
            },
        ];
    }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);
    return Object.assign(Object.assign({}, props), { onClosePanel: innerOnClosePanel, allPagesIsAvailable, menuItems: innerMenuItems, panelItems: innerPanelItems, size,
        onItemClick });
};

exports.useAsideHeaderInnerContextValue = useAsideHeaderInnerContextValue;
//# sourceMappingURL=useAsideHeaderInnerContextValue.js.map
