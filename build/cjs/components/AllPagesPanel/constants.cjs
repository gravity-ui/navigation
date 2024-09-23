'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const icons = require('@gravity-ui/icons');
const index = require('./i18n/index.cjs');

const ALL_PAGES_ID = "all-pages";
function getAllPagesMenuItem() {
  return {
    id: ALL_PAGES_ID,
    title: index.default("menu-item.all-pages.title"),
    tooltipText: index.default("menu-item.all-pages.title"),
    icon: icons.Ellipsis
  };
}

exports.ALL_PAGES_ID = ALL_PAGES_ID;
exports.getAllPagesMenuItem = getAllPagesMenuItem;
//# sourceMappingURL=constants.cjs.map
