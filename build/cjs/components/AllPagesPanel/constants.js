'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var icons = require('@gravity-ui/icons');
var index = require('./i18n/index.js');

const ALL_PAGES_ID = 'all-pages';
function getAllPagesMenuItem() {
    return {
        id: ALL_PAGES_ID,
        title: index["default"]('menu-item.all-pages.title'),
        tooltipText: index["default"]('menu-item.all-pages.title'),
        icon: icons.Ellipsis,
    };
}

exports.ALL_PAGES_ID = ALL_PAGES_ID;
exports.getAllPagesMenuItem = getAllPagesMenuItem;
//# sourceMappingURL=constants.js.map
