'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const constants = require('./index.cjs16.js');
;/* empty css             */

const b = cn.block("mobile-header-footer-item");
const FooterItem = ({
  icon,
  iconSize = constants.MOBILE_HEADER_ICON_SIZE,
  className,
  modalItem = { visible: false },
  onClick,
  eventBrokerMeta
}) => {
  const handleClick = React.useCallback(
    (event) => {
      uikit.eventBroker.publish({
        componentId: "MobileHeaderFooterItem",
        eventId: "click",
        domEvent: event,
        meta: eventBrokerMeta
      });
      onClick?.(event);
    },
    [onClick, eventBrokerMeta]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b(), children: [
    /* @__PURE__ */ jsxRuntime.jsx("button", { className: b("button", className), onClick: handleClick, children: icon ? /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { data: icon, size: iconSize, className: b("icon") }) : null }),
    /* @__PURE__ */ jsxRuntime.jsx(
      uikit.Sheet,
      {
        id: modalItem.id,
        title: modalItem.title,
        visible: modalItem.visible,
        className: b("modal", modalItem.className),
        contentClassName: b("modal-content", modalItem.contentClassName),
        allowHideOnContentScroll: modalItem.modalAllowHideOnContentScroll,
        onClose: modalItem.onClose,
        children: modalItem.renderContent?.()
      }
    )
  ] });
};

exports.FooterItem = FooterItem;
//# sourceMappingURL=index.cjs14.js.map
