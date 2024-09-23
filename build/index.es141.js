import { jsxs, jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { Pin, PinFill } from '@gravity-ui/icons';
import { Icon, Button } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
/* empty css            */

const b = block("all-pages-list-item");
const AllPagesListItem = (props) => {
  const { item, editMode, onToggle } = props;
  const onPinButtonClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onToggle();
    },
    [onToggle]
  );
  const onItemClick = (e) => {
    if (editMode) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: b(), onClick: onItemClick, children: [
    item.icon ? /* @__PURE__ */ jsx(Icon, { className: b("icon"), data: item.icon, size: item.iconSize }) : null,
    /* @__PURE__ */ jsx("span", { className: b("text"), children: item.title }),
    editMode && /* @__PURE__ */ jsx(
      Button,
      {
        onClick: onPinButtonClick,
        view: item.hidden ? "flat-secondary" : "flat-action",
        children: /* @__PURE__ */ jsx(Button.Icon, { children: item.hidden ? /* @__PURE__ */ jsx(Pin, {}) : /* @__PURE__ */ jsx(PinFill, {}) })
      }
    )
  ] });
};

export { AllPagesListItem };
//# sourceMappingURL=index.es141.js.map
