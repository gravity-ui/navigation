'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function isSectionSelected(selected, pageId, section) {
  if (!selected.section || selected.setting) {
    return false;
  } else if (selected.section.id && selected.section.id === section.id) {
    return true;
  } else if (selected.page?.id === pageId && selected.section.title && selected.section.title === section.title) {
    return true;
  } else {
    return false;
  }
}

exports.isSectionSelected = isSectionSelected;
//# sourceMappingURL=index.cjs61.js.map
