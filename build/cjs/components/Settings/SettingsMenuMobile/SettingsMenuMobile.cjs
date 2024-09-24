'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                          */
const Tabs = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Tabs/Tabs.cjs');

const b = cn.block("settings-menu-mobile");
const SettingsMenuMobile = ({
  items,
  onChange,
  activeItemId,
  className
}) => {
  const ref = index.default.useRef(null);
  const tabItems = index.default.useMemo(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { ref, onTouchMove: handleTouchMove, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    Tabs.Tabs,
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
//# sourceMappingURL=SettingsMenuMobile.cjs.map
