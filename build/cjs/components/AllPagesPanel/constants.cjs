'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('./i18n/index.cjs');
const Ellipsis = require('../../node_modules/@gravity-ui/icons/esm/Ellipsis.cjs');

const ALL_PAGES_ID = "all-pages";
function getAllPagesMenuItem() {
  return {
    id: ALL_PAGES_ID,
    title: index.default("menu-item.all-pages.title"),
    tooltipText: index.default("menu-item.all-pages.title"),
    icon: Ellipsis.default
  };
}

exports.ALL_PAGES_ID = ALL_PAGES_ID;
exports.getAllPagesMenuItem = getAllPagesMenuItem;
//# sourceMappingURL=constants.cjs.map
