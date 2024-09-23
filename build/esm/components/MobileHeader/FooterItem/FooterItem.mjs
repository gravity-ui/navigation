import { jsxs, jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { eventBroker, Icon, Sheet } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
import { MOBILE_HEADER_ICON_SIZE } from '../constants.mjs';
/* empty css                 */

const b = block("mobile-header-footer-item");
const FooterItem = ({
  icon,
  iconSize = MOBILE_HEADER_ICON_SIZE,
  className,
  modalItem = { visible: false },
  onClick,
  eventBrokerMeta
}) => {
  const handleClick = React__default.useCallback(
    (event) => {
      eventBroker.publish({
        componentId: "MobileHeaderFooterItem",
        eventId: "click",
        domEvent: event,
        meta: eventBrokerMeta
      });
      onClick?.(event);
    },
    [onClick, eventBrokerMeta]
  );
  return /* @__PURE__ */ jsxs("div", { className: b(), children: [
    /* @__PURE__ */ jsx("button", { className: b("button", className), onClick: handleClick, children: icon ? /* @__PURE__ */ jsx(Icon, { data: icon, size: iconSize, className: b("icon") }) : null }),
    /* @__PURE__ */ jsx(
      Sheet,
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

export { FooterItem };
//# sourceMappingURL=FooterItem.mjs.map
