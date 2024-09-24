import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { useCallback } from 'react';
import { Pin, PinFill } from '@gravity-ui/icons';
import { Icon, Button } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
/* empty css                       */

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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b(), onClick: onItemClick, children: [
    item.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: b("icon"), data: item.icon, size: item.iconSize }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: b("text"), children: item.title }),
    editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: onPinButtonClick,
        view: item.hidden ? "flat-secondary" : "flat-action",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button.Icon, { children: item.hidden ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(PinFill, {}) })
      }
    )
  ] });
};

export { AllPagesListItem };
//# sourceMappingURL=AllPagesListItem.mjs.map
