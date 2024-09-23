import { jsxs, jsx } from 'react/jsx-runtime';
import { Xmark } from '@gravity-ui/icons';
import { Text, Button, Icon } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
import i18n from './index.es47.js';
/* empty css           */

const b = block("title");
const Title = ({
  children,
  closeIconSize = 23,
  hasSeparator,
  closeTitle = i18n("button_close"),
  onClose
}) => {
  return /* @__PURE__ */ jsxs("div", { className: b({ separator: hasSeparator }), children: [
    /* @__PURE__ */ jsx(Text, { className: b("text"), as: "h3", variant: "subheader-3", children }),
    onClose && /* @__PURE__ */ jsx(
      Button,
      {
        onClick: onClose,
        view: "flat",
        size: "l",
        extraProps: {
          "aria-label": closeTitle
        },
        children: /* @__PURE__ */ jsx(Icon, { data: Xmark, size: closeIconSize })
      }
    )
  ] });
};
Title.displayName = "Title";

export { Title };
//# sourceMappingURL=index.es10.js.map
