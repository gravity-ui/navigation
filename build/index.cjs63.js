'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
;/* empty css             */

const b = cn.block("settings-menu-mobile");
const SettingsMenuMobile = ({
  items,
  onChange,
  activeItemId,
  className
}) => {
  const ref = React.useRef(null);
  const tabItems = React.useMemo(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { ref, onTouchMove: handleTouchMove, children: /* @__PURE__ */ jsxRuntime.jsx(
    uikit.Tabs,
    {
      items: tabItems,
      className: b(null, className),
      size: "l",
      activeTab: activeItemId,
      onSelectTab: onChange
    }
  ) });
};

exports.SettingsMenuMobile = SettingsMenuMobile;
//# sourceMappingURL=index.cjs63.js.map
