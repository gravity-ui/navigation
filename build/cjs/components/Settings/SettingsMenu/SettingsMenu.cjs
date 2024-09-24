'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
const helpers = require('../helpers.cjs');
;/* empty css                    */
const Icon = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');

const b = cn.block("settings-menu");
const SettingsMenu = index.default.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SettingsMenu2({ items, onChange, activeItemId }, ref) {
    const [focusItemId, setFocusId] = index.default.useState();
    const containerRef = index.default.useRef(null);
    const handleChange = helpers.useStableCallback(onChange);
    const getFocused = helpers.useCurrent(focusItemId);
    index.default.useImperativeHandle(
      ref,
      () => ({
        handleKeyDown(event) {
          if (!containerRef.current) {
            return false;
          }
          const focused = getFocused();
          if (focused && event.key === "Enter") {
            handleChange(focused);
            return true;
          } else if (event.key === "ArrowDown") {
            setFocusId(focusNext(containerRef.current, focused, 1));
            return true;
          } else if (event.key === "ArrowUp") {
            setFocusId(focusNext(containerRef.current, focused, -1));
            return true;
          }
          return false;
        },
        clearFocus() {
          setFocusId(void 0);
        }
      }),
      [getFocused, handleChange]
    );
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { ref: containerRef, className: b(), children: items.map((firstLevelItem) => {
      if ("groupTitle" in firstLevelItem) {
        return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("group"), children: [
          /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("group-heading"), children: firstLevelItem.groupTitle }),
          firstLevelItem.items.map((item) => {
            return renderMenuItem(
              item,
              onChange,
              activeItemId,
              focusItemId
            );
          })
        ] }, firstLevelItem.groupTitle);
      }
      return renderMenuItem(firstLevelItem, onChange, activeItemId, focusItemId);
    }) });
  }
);
function renderMenuItem(item, onChange, activeItemId, focusItemId) {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
    "span",
    {
      className: b("item", {
        selected: activeItemId === item.id,
        disabled: item.disabled,
        focused: focusItemId === item.id,
        badge: item.withBadge
      }),
      onClick: () => {
        if (!item.disabled) {
          onChange(item.id);
        }
      },
      "data-id": item.id,
      children: [
        item.icon ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { size: 16, ...item.icon, className: b("item-icon") }) : void 0,
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { children: item.title })
      ]
    },
    item.title
  );
}
function focusNext(container, focused, direction) {
  const elements = container.querySelectorAll(`.${b("item")}:not(.${b("item")}_disabled)`);
  if (elements.length === 0) {
    return void 0;
  }
  let currentIndex = direction > 0 ? -1 : 0;
  if (focused) {
    currentIndex = Array.prototype.findIndex.call(
      elements,
      (element) => element.getAttribute("data-id") === focused
    );
  }
  currentIndex = (elements.length + currentIndex + direction) % elements.length;
  return elements[currentIndex].getAttribute("data-id") ?? void 0;
}

exports.SettingsMenu = SettingsMenu;
//# sourceMappingURL=SettingsMenu.cjs.map
