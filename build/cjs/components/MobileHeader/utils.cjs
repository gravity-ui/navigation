'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const constants = require('./constants.cjs');

const getItemHeight = (item) => {
  switch (item.type) {
    case "divider":
      return 1;
    default:
      return constants.MOBILE_ITEM_HEIGHT;
  }
};
const getSelectedItemIndex = (items) => {
  const index = items.findIndex(({ current }) => Boolean(current));
  return index === -1 ? void 0 : index;
};
const getMobileHeaderCustomEvent = (eventName, detail) => {
  return new CustomEvent(eventName, { detail });
};

exports.getItemHeight = getItemHeight;
exports.getMobileHeaderCustomEvent = getMobileHeaderCustomEvent;
exports.getSelectedItemIndex = getSelectedItemIndex;
//# sourceMappingURL=utils.cjs.map
