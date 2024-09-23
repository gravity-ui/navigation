import { jsxs, jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { CompositeBar } from './index.es102.js';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT } from './index.es23.js';
import { useAsideHeaderInnerContext, useAsideHeaderContext } from './index.es3.js';
import { b } from './index.es27.js';
import headerDividerCollapsedIcon from './index.es32.js';
import { Logo } from './index.es18.js';

const DEFAULT_SUBHEADER_ITEMS = [];
const Header = () => {
  const { logo, onItemClick, onClosePanel, headerDecoration, subheaderItems } = useAsideHeaderInnerContext();
  const { compact } = useAsideHeaderContext();
  const onLogoClick = useCallback(
    (event) => {
      onClosePanel?.();
      logo?.onClick?.(event);
    },
    [onClosePanel, logo]
  );
  return /* @__PURE__ */ jsxs("div", { className: b("header", { ["with-decoration"]: headerDecoration }), children: [
    logo && /* @__PURE__ */ jsx(
      Logo,
      {
        ...logo,
        onClick: onLogoClick,
        compact,
        buttonWrapperClassName: b("logo-button-wrapper"),
        buttonClassName: b("logo-button")
      }
    ),
    /* @__PURE__ */ jsx(
      CompositeBar,
      {
        type: "subheader",
        items: subheaderItems || DEFAULT_SUBHEADER_ITEMS,
        onItemClick
      }
    ),
    /* @__PURE__ */ jsx(
      Icon,
      {
        data: headerDividerCollapsedIcon,
        className: b("header-divider"),
        width: ASIDE_HEADER_COMPACT_WIDTH,
        height: HEADER_DIVIDER_HEIGHT
      }
    )
  ] });
};

export { Header };
//# sourceMappingURL=index.es105.js.map
