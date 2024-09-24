'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
const constants = require('../constants.cjs');
;/* empty css                  */
const EventBroker = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/utils/event-broker/EventBroker.cjs');
const Icon = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');
const Sheet = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Sheet/Sheet.cjs');

const b = cn.block("mobile-header-footer-item");
const FooterItem = ({
  icon,
  iconSize = constants.MOBILE_HEADER_ICON_SIZE,
  className,
  modalItem = { visible: false },
  onClick,
  eventBrokerMeta
}) => {
  const handleClick = index.default.useCallback(
    (event) => {
      EventBroker.eventBroker.publish({
        componentId: "MobileHeaderFooterItem",
        eventId: "click",
        domEvent: event,
        meta: eventBrokerMeta
      });
      onClick?.(event);
    },
    [onClick, eventBrokerMeta]
  );
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b(), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("button", { className: b("button", className), onClick: handleClick, children: icon ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: icon, size: iconSize, className: b("icon") }) : null }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      Sheet.Sheet,
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
//# sourceMappingURL=FooterItem.cjs.map
