import { MOBILE_ITEM_HEIGHT } from './constants.mjs';

const getItemHeight = (item) => {
  switch (item.type) {
    case "divider":
      return 1;
    default:
      return MOBILE_ITEM_HEIGHT;
  }
};
const getSelectedItemIndex = (items) => {
  const index = items.findIndex(({ current }) => Boolean(current));
  return index === -1 ? void 0 : index;
};
const getMobileHeaderCustomEvent = (eventName, detail) => {
  return new CustomEvent(eventName, { detail });
};

export { getItemHeight, getMobileHeaderCustomEvent, getSelectedItemIndex };
//# sourceMappingURL=utils.mjs.map