'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');
var constants = require('../constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('mobile-header-footer-item');
const FooterItem = ({ icon, iconSize = constants.MOBILE_HEADER_ICON_SIZE, className, modalItem = { visible: false }, onClick, eventBrokerMeta, }) => {
    var _a;
    const handleClick = React__default["default"].useCallback((event) => {
        uikit.eventBroker.publish({
            componentId: 'MobileHeaderFooterItem',
            eventId: 'click',
            domEvent: event,
            meta: eventBrokerMeta,
        });
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    }, [onClick, eventBrokerMeta]);
    return (React__default["default"].createElement("div", { className: b() },
        React__default["default"].createElement("button", { className: b('button', className), onClick: handleClick }, icon ? React__default["default"].createElement(uikit.Icon, { data: icon, size: iconSize, className: b('icon') }) : null),
        React__default["default"].createElement(uikit.Sheet, { id: modalItem.id, title: modalItem.title, visible: modalItem.visible, className: b('modal', modalItem.className), contentClassName: b('modal-content', modalItem.contentClassName), allowHideOnContentScroll: modalItem.modalAllowHideOnContentScroll, onClose: modalItem.onClose }, (_a = modalItem.renderContent) === null || _a === void 0 ? void 0 : _a.call(modalItem))));
};

exports.FooterItem = FooterItem;
//# sourceMappingURL=FooterItem.js.map
