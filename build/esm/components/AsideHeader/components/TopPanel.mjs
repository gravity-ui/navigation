import { jsx, jsxs } from 'react/jsx-runtime';
import React__default from 'react';
import { Alert } from '@gravity-ui/uikit';
import { useAsideHeaderTopPanel } from '../useAsideHeaderTopPanel.mjs';
import { b } from '../utils.mjs';

const TopPanel = ({ topAlert }) => {
  const { topRef, updateTopSize } = useAsideHeaderTopPanel({ topAlert });
  const [opened, setOpened] = React__default.useState(true);
  const handleClose = React__default.useCallback(() => {
    setOpened(false);
    topAlert?.onCloseTopAlert?.();
  }, [topAlert]);
  React__default.useEffect(() => {
    if (!opened) {
      updateTopSize();
    }
  }, [opened, updateTopSize]);
  if (!topAlert || !topAlert.message) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { ref: topRef, className: b("pane-top", { opened }), children: opened && /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    /* @__PURE__ */ jsx(
      Alert,
      {
        className: b("pane-top-alert", {
          centered: topAlert.centered,
          dense: topAlert.dense
        }),
        corners: "square",
        layout: "horizontal",
        theme: topAlert.theme || "warning",
        view: topAlert.view,
        icon: topAlert.icon,
        title: topAlert.title,
        message: topAlert.message,
        actions: topAlert.actions,
        onClose: topAlert.closable ? handleClose : void 0
      }
    ),
    /* @__PURE__ */ jsx("div", { className: b("pane-top-divider") })
  ] }) });
};

export { TopPanel };
//# sourceMappingURL=TopPanel.mjs.map
