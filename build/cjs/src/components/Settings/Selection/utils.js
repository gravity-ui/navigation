'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isSectionSelected(selected, pageId, section) {
    var _a;
    if (!selected.section || selected.setting) {
        return false;
    }
    else if (selected.section.id && selected.section.id === section.id) {
        return true;
    }
    else if (((_a = selected.page) === null || _a === void 0 ? void 0 : _a.id) === pageId &&
        selected.section.title &&
        selected.section.title === section.title) {
        return true;
    }
    else {
        return false;
    }
}

exports.isSectionSelected = isSectionSelected;
//# sourceMappingURL=utils.js.map
