'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const CompositeBar = require('../../CompositeBar/CompositeBar.cjs');
const constants = require('../../constants.cjs');
const AsideHeaderContext = require('../AsideHeaderContext.cjs');
const utils = require('../utils.cjs');
const dividerCollapsed = require('../../../assets/icons/divider-collapsed.svg.cjs');
const Logo = require('../../Logo/Logo.cjs');

const DEFAULT_SUBHEADER_ITEMS = [];
const Header = () => {
  const { logo, onItemClick, onClosePanel, headerDecoration, subheaderItems } = AsideHeaderContext.useAsideHeaderInnerContext();
  const { compact } = AsideHeaderContext.useAsideHeaderContext();
  const onLogoClick = React.useCallback(
    (event) => {
      onClosePanel?.();
      logo?.onClick?.(event);
    },
    [onClosePanel, logo]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: utils.b("header", { ["with-decoration"]: headerDecoration }), children: [
    logo && /* @__PURE__ */ jsxRuntime.jsx(
      Logo.Logo,
      {
        ...logo,
        onClick: onLogoClick,
        compact,
        buttonWrapperClassName: utils.b("logo-button-wrapper"),
        buttonClassName: utils.b("logo-button")
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      CompositeBar.CompositeBar,
      {
        type: "subheader",
        items: subheaderItems || DEFAULT_SUBHEADER_ITEMS,
        onItemClick
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      uikit.Icon,
      {
        data: dividerCollapsed.default,
        className: utils.b("header-divider"),
        width: constants.ASIDE_HEADER_COMPACT_WIDTH,
        height: constants.HEADER_DIVIDER_HEIGHT
      }
    )
  ] });
};

exports.Header = Header;
//# sourceMappingURL=Header.cjs.map
