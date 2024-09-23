'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const helpers = require('./index.cjs66.js');
;/* empty css             */

const b = cn.block("settings-menu");
const SettingsMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SettingsMenu2({ items, onChange, activeItemId }, ref) {
    const [focusItemId, setFocusId] = React.useState();
    const containerRef = React.useRef(null);
    const handleChange = helpers.useStableCallback(onChange);
    const getFocused = helpers.useCurrent(focusItemId);
    React.useImperativeHandle(
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
    return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: containerRef, className: b(), children: items.map((firstLevelItem) => {
      if ("groupTitle" in firstLevelItem) {
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b("group"), children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("group-heading"), children: firstLevelItem.groupTitle }),
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        item.icon ? /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { size: 16, ...item.icon, className: b("item-icon") }) : void 0,
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: item.title })
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
//# sourceMappingURL=index.cjs62.js.map
