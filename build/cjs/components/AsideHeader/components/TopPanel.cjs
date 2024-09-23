'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const useAsideHeaderTopPanel = require('../useAsideHeaderTopPanel.cjs');
const utils = require('../utils.cjs');

const TopPanel = ({ topAlert }) => {
  const { topRef, updateTopSize } = useAsideHeaderTopPanel.useAsideHeaderTopPanel({ topAlert });
  const [opened, setOpened] = React.useState(true);
  const handleClose = React.useCallback(() => {
    setOpened(false);
    topAlert?.onCloseTopAlert?.();
  }, [topAlert]);
  React.useEffect(() => {
    if (!opened) {
      updateTopSize();
    }
  }, [opened, updateTopSize]);
  if (!topAlert || !topAlert.message) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: topRef, className: utils.b("pane-top", { opened }), children: opened && /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      uikit.Alert,
      {
        className: utils.b("pane-top-alert", {
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
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("pane-top-divider") })
  ] }) });
};

exports.TopPanel = TopPanel;
//# sourceMappingURL=TopPanel.cjs.map
