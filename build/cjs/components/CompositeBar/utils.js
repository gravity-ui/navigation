'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var icons = require('@gravity-ui/icons');
var constants = require('../constants.js');
var constants$1 = require('./constants.js');

function getItemHeight(item) {
    if (!isMenuItem(item)) {
        return constants.ITEM_HEIGHT;
    }
    switch (item.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;
        default:
            return constants.ITEM_HEIGHT;
    }
}
function getItemsHeight(items) {
    return items.reduce((sum, item) => sum + getItemHeight(item), 0);
}
function getSelectedItemIndex(items) {
    const index = items.findIndex(({ current }) => Boolean(current));
    return index === -1 ? undefined : index;
}
function getPinnedItems(items) {
    const pinnedItems = [];
    for (const item of items) {
        if (item.pinned) {
            pinnedItems.push(item);
        }
        else if (item.type === 'divider') {
            if (pinnedItems.length > 0 && pinnedItems[pinnedItems.length - 1].type !== 'divider') {
                pinnedItems.push(item);
            }
        }
    }
    return pinnedItems;
}
function getItemsMinHeight(items) {
    const pinnedItems = getPinnedItems(items);
    const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
    return (getItemsHeight(pinnedItems) +
        getItemsHeight(afterMoreButtonItems) +
        (pinnedItems.length === items.length ? 0 : constants.ITEM_HEIGHT));
}
function getMoreButtonItem(menuMoreTitle) {
    return {
        id: constants$1.COLLAPSE_ITEM_ID,
        title: menuMoreTitle,
        icon: icons.Ellipsis,
        iconSize: 18,
    };
}
function getAutosizeListItems(items, height, collapseItem) {
    var _a, _b, _c;
    const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
    const regularItems = items.filter((item) => !item.afterMoreButton);
    const listItems = [...regularItems, ...afterMoreButtonItems];
    const allItemsHeight = getItemsHeight(listItems);
    if (allItemsHeight <= height) {
        return { listItems, collapseItems: [] };
    }
    const collapseItemHeight = getItemHeight(collapseItem);
    listItems.splice(regularItems.length, 0, collapseItem);
    const collapseItems = [];
    let listHeight = allItemsHeight + collapseItemHeight;
    let index = listItems.length;
    while (listHeight > height) {
        if (index === 0) {
            break;
        }
        index--;
        const item = listItems[index];
        if (item.pinned || item.id === constants$1.COLLAPSE_ITEM_ID || item.afterMoreButton) {
            continue;
        }
        if (item.type === 'divider') {
            if (index + 1 < listItems.length && ((_a = listItems[index + 1]) === null || _a === void 0 ? void 0 : _a.type) === 'divider') {
                listHeight -= getItemHeight(item);
                listItems.splice(index, 1);
            }
            continue;
        }
        listHeight -= getItemHeight(item);
        collapseItems.unshift(...listItems.splice(index, 1));
    }
    if (((_b = listItems[index]) === null || _b === void 0 ? void 0 : _b.type) === 'divider' &&
        (index === 0 || ((_c = listItems[index - 1]) === null || _c === void 0 ? void 0 : _c.type) === 'divider')) {
        listItems.splice(index, 1);
    }
    return { listItems, collapseItems };
}
function isMenuItem(item) {
    return (item === null || item === void 0 ? void 0 : item.id) !== undefined;
}

exports.getAutosizeListItems = getAutosizeListItems;
exports.getItemHeight = getItemHeight;
exports.getItemsHeight = getItemsHeight;
exports.getItemsMinHeight = getItemsMinHeight;
exports.getMoreButtonItem = getMoreButtonItem;
exports.getPinnedItems = getPinnedItems;
exports.getSelectedItemIndex = getSelectedItemIndex;
exports.isMenuItem = isMenuItem;
//# sourceMappingURL=utils.js.map
