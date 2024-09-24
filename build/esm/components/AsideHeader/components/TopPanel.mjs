import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../node_modules/react/index.mjs';
import { useAsideHeaderTopPanel } from '../useAsideHeaderTopPanel.mjs';
import { b } from '../utils.mjs';
import { Alert } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Alert/Alert.mjs';

const TopPanel = ({ topAlert }) => {
  const { topRef, updateTopSize } = useAsideHeaderTopPanel({ topAlert });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: topRef, className: b("pane-top", { opened }), children: opened && /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("pane-top-divider") })
  ] }) });
};

export { TopPanel };
//# sourceMappingURL=TopPanel.mjs.map
