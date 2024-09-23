import React__default, { useRef, useState, useCallback, useEffect } from 'react';
import { Gear } from '@gravity-ui/icons';
import { Flex, Text, Button, Icon, List } from '@gravity-ui/uikit';
import { useAsideHeaderInnerContext } from '../AsideHeader/AsideHeaderContext.js';
import { block } from '../utils/cn.js';
import { AllPagesListItem } from './AllPagesListItem/AllPagesListItem.js';
import { ALL_PAGES_ID } from './constants.js';
import i18n from './i18n/index.js';
import { useGroupedMenuItems } from './useGroupedMenuItems.js';

const b = block('all-pages-panel');
const AllPagesPanel = (props) => {
    const { startEditIcon, onEditModeChanged, className } = props;
    const { menuItems, onMenuItemsChanged } = useAsideHeaderInnerContext();
    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);
    const groupedItems = useGroupedMenuItems(menuItems);
    useEffect(() => {
        onEditModeChanged === null || onEditModeChanged === void 0 ? void 0 : onEditModeChanged(isEditMode);
    }, [isEditMode, onEditModeChanged]);
    const onItemClick = useCallback((item) => {
        var _a;
        //@ts-ignore TODO fix when @gravity-ui/uikit/List will provide event arg on item click
        (_a = item.onItemClick) === null || _a === void 0 ? void 0 : _a.call(item, item, false);
    }, []);
    const togglePageVisibility = useCallback((item) => {
        if (!onMenuItemsChanged) {
            return;
        }
        const changedItem = Object.assign(Object.assign({}, item), { hidden: !item.hidden });
        const originItems = menuItemsRef.current.filter((menuItem) => menuItem.id !== ALL_PAGES_ID);
        onMenuItemsChanged(originItems.map((menuItem) => {
            if (menuItem.id !== changedItem.id) {
                return menuItem;
            }
            return changedItem;
        }));
    }, [onMenuItemsChanged]);
    const itemRender = useCallback((item, _isActive, _itemIndex) => (React__default.createElement(AllPagesListItem, { item: item, editMode: isEditMode, onToggle: () => togglePageVisibility(item) })), [isEditMode, togglePageVisibility]);
    const onResetToDefaultClick = useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        const originItems = menuItemsRef.current.filter((item) => item.id !== ALL_PAGES_ID);
        onMenuItemsChanged(originItems.map((item) => (Object.assign(Object.assign({}, item), { hidden: false }))));
    }, [onMenuItemsChanged]);
    return (React__default.createElement(Flex, { className: b(null, className), gap: "5", direction: "column" },
        React__default.createElement(Flex, { gap: "4", alignItems: "center", justifyContent: "space-between" },
            React__default.createElement(Text, { variant: "subheader-2" }, isEditMode ? i18n('all-panel.title.editing') : i18n('all-panel.title.main')),
            React__default.createElement(Button, { selected: isEditMode, view: "normal", onClick: toggleEditMode }, startEditIcon ? startEditIcon : React__default.createElement(Icon, { data: Gear }))),
        React__default.createElement(Flex, { className: b('content'), gap: "5", direction: "column" }, Object.keys(groupedItems).map((category) => {
            return (React__default.createElement(Flex, { key: category, direction: "column", gap: "3" },
                React__default.createElement(Text, { className: b('category'), variant: "body-1", color: "secondary" }, category),
                React__default.createElement(List, { virtualized: false, filterable: false, items: groupedItems[category], onItemClick: onItemClick, renderItem: itemRender })));
        })),
        isEditMode && (React__default.createElement(Button, { onClick: onResetToDefaultClick }, i18n('all-panel.resetToDefault')))));
};

export { AllPagesPanel };
//# sourceMappingURL=AllPagesPanel.js.map
