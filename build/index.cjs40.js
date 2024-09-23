'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const icons = require('@gravity-ui/icons');
const constants = require('./index.cjs23.js');
const constants$1 = require('./index.cjs39.js');

function getItemHeight(item) {
  if (!isMenuItem(item)) {
    return constants.ITEM_HEIGHT;
  }
  switch (item.type) {
    case "action":
      return 50;
    case "divider":
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
  return index === -1 ? void 0 : index;
}
function getPinnedItems(items) {
  const pinnedItems = [];
  for (const item of items) {
    if (item.pinned) {
      pinnedItems.push(item);
    } else if (item.type === "divider") {
      if (pinnedItems.length > 0 && pinnedItems[pinnedItems.length - 1].type !== "divider") {
        pinnedItems.push(item);
      }
    }
  }
  return pinnedItems;
}
function getItemsMinHeight(items) {
  const pinnedItems = getPinnedItems(items);
  const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
  return getItemsHeight(pinnedItems) + getItemsHeight(afterMoreButtonItems) + (pinnedItems.length === items.length ? 0 : constants.ITEM_HEIGHT);
}
function getMoreButtonItem(menuMoreTitle) {
  return {
    id: constants$1.COLLAPSE_ITEM_ID,
    title: menuMoreTitle,
    icon: icons.Ellipsis,
    iconSize: 18
  };
}
function getAutosizeListItems(items, height, collapseItem) {
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
    if (item.type === "divider") {
      if (index + 1 < listItems.length && listItems[index + 1]?.type === "divider") {
        listHeight -= getItemHeight(item);
        listItems.splice(index, 1);
      }
      continue;
    }
    listHeight -= getItemHeight(item);
    collapseItems.unshift(...listItems.splice(index, 1));
  }
  if (listItems[index]?.type === "divider" && (index === 0 || listItems[index - 1]?.type === "divider")) {
    listItems.splice(index, 1);
  }
  return { listItems, collapseItems };
}
function isMenuItem(item) {
  return item?.id !== void 0;
}

exports.getAutosizeListItems = getAutosizeListItems;
exports.getItemHeight = getItemHeight;
exports.getItemsHeight = getItemsHeight;
exports.getItemsMinHeight = getItemsMinHeight;
exports.getMoreButtonItem = getMoreButtonItem;
exports.getPinnedItems = getPinnedItems;
exports.getSelectedItemIndex = getSelectedItemIndex;
exports.isMenuItem = isMenuItem;
//# sourceMappingURL=index.cjs40.js.map
