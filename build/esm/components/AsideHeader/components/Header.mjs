import { jsxs, jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { CompositeBar } from '../../CompositeBar/CompositeBar.mjs';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT } from '../../constants.mjs';
import { useAsideHeaderInnerContext, useAsideHeaderContext } from '../AsideHeaderContext.mjs';
import { b } from '../utils.mjs';
import headerDividerCollapsedIcon from '../../../icons/divider-collapsed.svg.mjs';
import { Logo } from '../../Logo/Logo.mjs';

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
//# sourceMappingURL=Header.mjs.map
