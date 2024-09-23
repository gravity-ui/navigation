'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var helpers = require('./helpers.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function getSettingsFromChildren(children, searchText = '') {
    // 'abc def fg' -> abc.*?cde.*?fg
    const preparedFilter = helpers.escapeStringForRegExp(searchText).replace(/\s+/g, '.*?');
    const filterRe = new RegExp(preparedFilter, 'i');
    return getSettingsFromChildrenRecursive(children, '', filterRe);
}
function getSettingsFromChildrenRecursive(children, basepath = '', filterRe) {
    const menu = [];
    const pages = {};
    let hasGroup = false;
    let hasItems = false;
    React__default["default"].Children.forEach(children, (element) => {
        var _a, _b;
        if (!React__default["default"].isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React__default["default"].Fragment) {
            // Transparently support React.Fragment and its children.
            const { menu: menuFragment, pages: pagesFragment } = getSettingsFromChildrenRecursive(element.props.children, basepath, filterRe);
            menu.push(...menuFragment);
            Object.assign(pages, pagesFragment);
        }
        else if (element.props.groupTitle) {
            if (process.env.NODE_ENV === 'development') {
                helpers.invariant(!hasItems, 'Setting menu must not mix groups and pages on one level');
            }
            const pageId = `${basepath}/${(_a = element.props.id) !== null && _a !== void 0 ? _a : element.props.groupTitle}`;
            hasGroup = true;
            const { menu: menuFragment, pages: pagesFragment } = getSettingsFromChildrenRecursive(element.props.children, pageId, filterRe);
            if (process.env.NODE_ENV === 'development') {
                const hasInnerGroup = menuFragment.some((item) => 'groupTitle' in item);
                helpers.invariant(!hasInnerGroup, `Group ${element.props.groupTitle} should not include groups`);
            }
            menu.push({
                groupTitle: element.props.groupTitle,
                // @ts-ignore
                items: menuFragment,
            });
            Object.assign(pages, pagesFragment);
        }
        else {
            hasItems = true;
            const pageId = `${basepath}/${(_b = element.props.id) !== null && _b !== void 0 ? _b : element.props.title}`;
            if (process.env.NODE_ENV === 'development') {
                helpers.invariant(Boolean(element.props.title), 'Component must include title prop');
                helpers.invariant(!hasGroup, 'Setting menu must not mix groups and pages on one level');
                helpers.invariant(!pages[pageId], `Setting menu page id must be uniq (${pageId})`);
            }
            pages[pageId] = getSettingsPageFromChildren(element.props.children, filterRe);
            pages[pageId].id = pageId;
            menu.push({
                id: pageId,
                title: element.props.title,
                icon: element.props.icon,
                withBadge: pages[pageId].withBadge,
                disabled: pages[pageId].hidden,
            });
        }
    });
    return { menu, pages };
}
function getSettingsPageFromChildren(children, filterRe) {
    const page = { id: '', sections: [], hidden: true };
    React__default["default"].Children.forEach(children, (element) => {
        if (!React__default["default"].isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React__default["default"].Fragment) {
            // Transparently support React.Fragment and its children.
            const { sections, withBadge, hidden } = getSettingsPageFromChildren(element.props.children, filterRe);
            page.sections.push(...sections);
            page.withBadge = withBadge || page.withBadge;
            page.hidden = hidden && page.hidden;
        }
        else {
            const { withBadge, showTitle = true } = element.props;
            const { items, hidden } = getSettingsItemsFromChildren(element.props.children, filterRe);
            page.withBadge = withBadge || page.withBadge;
            page.hidden = hidden && page.hidden;
            page.sections.push(Object.assign(Object.assign({}, element.props), { withBadge,
                items,
                hidden,
                showTitle }));
        }
    });
    return page;
}
function getSettingsItemsFromChildren(children, filterRe) {
    let hidden = true;
    const items = [];
    React__default["default"].Children.forEach(children, (element) => {
        if (!React__default["default"].isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React__default["default"].Fragment) {
            // Transparently support React.Fragment and its children.
            const fragmentItems = getSettingsItemsFromChildren(element.props.children, filterRe);
            items.push(...fragmentItems.items);
            hidden = hidden && fragmentItems.hidden;
        }
        else {
            const item = Object.assign(Object.assign({}, element.props), { element, hidden: !filterRe.test(element.props.title) });
            items.push(item);
            hidden = hidden && item.hidden;
        }
    });
    return { items, hidden };
}
function getSelectedSettingsPart(pages, selection) {
    if (!selection.settingId && !selection.section && !selection.page) {
        return {};
    }
    for (const page of Object.values(pages)) {
        if (!selection.settingId && !selection.section) {
            if (selection.page !== page.id)
                continue;
            return { page };
        }
        for (const section of page.sections) {
            if (selection.settingId) {
                for (const setting of section.items) {
                    if (setting.id === selection.settingId) {
                        return { page, section, setting };
                    }
                }
            }
            else if (selection.section &&
                ('id' in selection.section
                    ? selection.section.id === section.id
                    : selection.section.title === section.title)) {
                return { page, section };
            }
        }
    }
    return {};
}

exports.getSelectedSettingsPart = getSelectedSettingsPart;
exports.getSettingsFromChildren = getSettingsFromChildren;
//# sourceMappingURL=collect-settings.js.map
