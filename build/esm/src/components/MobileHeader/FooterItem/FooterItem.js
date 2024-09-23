import React__default from 'react';
import { eventBroker, Icon, Sheet } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';
import { MOBILE_HEADER_ICON_SIZE } from '../constants.js';

const b = block('mobile-header-footer-item');
const FooterItem = ({ icon, iconSize = MOBILE_HEADER_ICON_SIZE, className, modalItem = { visible: false }, onClick, eventBrokerMeta, }) => {
    var _a;
    const handleClick = React__default.useCallback((event) => {
        eventBroker.publish({
            componentId: 'MobileHeaderFooterItem',
            eventId: 'click',
            domEvent: event,
            meta: eventBrokerMeta,
        });
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    }, [onClick, eventBrokerMeta]);
    return (React__default.createElement("div", { className: b() },
        React__default.createElement("button", { className: b('button', className), onClick: handleClick }, icon ? React__default.createElement(Icon, { data: icon, size: iconSize, className: b('icon') }) : null),
        React__default.createElement(Sheet, { id: modalItem.id, title: modalItem.title, visible: modalItem.visible, className: b('modal', modalItem.className), contentClassName: b('modal-content', modalItem.contentClassName), allowHideOnContentScroll: modalItem.modalAllowHideOnContentScroll, onClose: modalItem.onClose }, (_a = modalItem.renderContent) === null || _a === void 0 ? void 0 : _a.call(modalItem))));
};

export { FooterItem };
//# sourceMappingURL=FooterItem.js.map
