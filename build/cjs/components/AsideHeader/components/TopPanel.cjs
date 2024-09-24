'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const useAsideHeaderTopPanel = require('../useAsideHeaderTopPanel.cjs');
const utils = require('../utils.cjs');
const Alert = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Alert/Alert.cjs');

const TopPanel = ({ topAlert }) => {
  const { topRef, updateTopSize } = useAsideHeaderTopPanel.useAsideHeaderTopPanel({ topAlert });
  const [opened, setOpened] = index.default.useState(true);
  const handleClose = index.default.useCallback(() => {
    setOpened(false);
    topAlert?.onCloseTopAlert?.();
  }, [topAlert]);
  index.default.useEffect(() => {
    if (!opened) {
      updateTopSize();
    }
  }, [opened, updateTopSize]);
  if (!topAlert || !topAlert.message) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { ref: topRef, className: utils.b("pane-top", { opened }), children: opened && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(index.default.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      Alert.Alert,
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
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("pane-top-divider") })
  ] }) });
};

exports.TopPanel = TopPanel;
//# sourceMappingURL=TopPanel.cjs.map
