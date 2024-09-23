import { jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { Tabs } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
/* empty css           */

const b = block("settings-menu-mobile");
const SettingsMenuMobile = ({
  items,
  onChange,
  activeItemId,
  className
}) => {
  const ref = React__default.useRef(null);
  const tabItems = React__default.useMemo(() => {
    const tabItems2 = [];
    items.forEach((firstLevelItem) => {
      if ("groupTitle" in firstLevelItem) {
        tabItems2.push(
          ...firstLevelItem.items.map(({ id, title, disabled, withBadge }) => ({
            id,
            title,
            disabled,
            className: b("item", { badge: withBadge })
          }))
        );
      } else {
        const { id, title, disabled, withBadge } = firstLevelItem;
        tabItems2.push({ id, title, disabled, className: b("item", { badge: withBadge }) });
      }
    });
    return tabItems2;
  }, [items]);
  const handleTouchMove = (e) => {
    e.stopPropagation();
  };
  return /* @__PURE__ */ jsx("div", { ref, onTouchMove: handleTouchMove, children: /* @__PURE__ */ jsx(
    Tabs,
    {
      items: tabItems,
      className: b(null, className),
      size: "l",
      activeTab: activeItemId,
      onSelectTab: onChange
    }
  ) });
};

export { SettingsMenuMobile };
//# sourceMappingURL=index.es63.js.map
