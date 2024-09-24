import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import { block } from '../utils/cn.mjs';
import i18n from './i18n/index.mjs';
/* empty css            */
import Xmark from '../../node_modules/@gravity-ui/icons/esm/Xmark.mjs';
import { Text } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Text/Text.mjs';
import { Button } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.mjs';
import { Icon } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';

const b = block("title");
const Title = ({
  children,
  closeIconSize = 23,
  hasSeparator,
  closeTitle = i18n("button_close"),
  onClose
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b({ separator: hasSeparator }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { className: b("text"), as: "h3", variant: "subheader-3", children }),
    onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: onClose,
        view: "flat",
        size: "l",
        extraProps: {
          "aria-label": closeTitle
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: Xmark, size: closeIconSize })
      }
    )
  ] });
};
Title.displayName = "Title";

export { Title };
//# sourceMappingURL=Title.mjs.map
