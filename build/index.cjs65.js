'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');
const helpers = require('./index.cjs66.js');

function getSettingsFromChildren(children, searchText = "") {
  const preparedFilter = helpers.escapeStringForRegExp(searchText).replace(/\s+/g, ".*?");
  const filterRe = new RegExp(preparedFilter, "i");
  return getSettingsFromChildrenRecursive(children, "", filterRe);
}
function getSettingsFromChildrenRecursive(children, basepath = "", filterRe) {
  const menu = [];
  const pages = {};
  let hasGroup = false;
  let hasItems = false;
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }
    if (element.type === React.Fragment) {
      const { menu: menuFragment, pages: pagesFragment } = getSettingsFromChildrenRecursive(
        element.props.children,
        basepath,
        filterRe
      );
      menu.push(...menuFragment);
      Object.assign(pages, pagesFragment);
    } else if (element.props.groupTitle) {
      if (process.env.NODE_ENV === "development") {
        helpers.invariant(!hasItems, "Setting menu must not mix groups and pages on one level");
      }
      const pageId = `${basepath}/${element.props.id ?? element.props.groupTitle}`;
      hasGroup = true;
      const { menu: menuFragment, pages: pagesFragment } = getSettingsFromChildrenRecursive(
        element.props.children,
        pageId,
        filterRe
      );
      if (process.env.NODE_ENV === "development") {
        const hasInnerGroup = menuFragment.some((item) => "groupTitle" in item);
        helpers.invariant(
          !hasInnerGroup,
          `Group ${element.props.groupTitle} should not include groups`
        );
      }
      menu.push({
        groupTitle: element.props.groupTitle,
        // @ts-ignore
        items: menuFragment
      });
      Object.assign(pages, pagesFragment);
    } else {
      hasItems = true;
      const pageId = `${basepath}/${element.props.id ?? element.props.title}`;
      if (process.env.NODE_ENV === "development") {
        helpers.invariant(Boolean(element.props.title), "Component must include title prop");
        helpers.invariant(!hasGroup, "Setting menu must not mix groups and pages on one level");
        helpers.invariant(!pages[pageId], `Setting menu page id must be uniq (${pageId})`);
      }
      pages[pageId] = getSettingsPageFromChildren(element.props.children, filterRe);
      pages[pageId].id = pageId;
      menu.push({
        id: pageId,
        title: element.props.title,
        icon: element.props.icon,
        withBadge: pages[pageId].withBadge,
        disabled: pages[pageId].hidden
      });
    }
  });
  return { menu, pages };
}
function getSettingsPageFromChildren(children, filterRe) {
  const page = { id: "", sections: [], hidden: true };
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }
    if (element.type === React.Fragment) {
      const { sections, withBadge, hidden } = getSettingsPageFromChildren(
        element.props.children,
        filterRe
      );
      page.sections.push(...sections);
      page.withBadge = withBadge || page.withBadge;
      page.hidden = hidden && page.hidden;
    } else {
      const { withBadge, showTitle = true } = element.props;
      const { items, hidden } = getSettingsItemsFromChildren(element.props.children, filterRe);
      page.withBadge = withBadge || page.withBadge;
      page.hidden = hidden && page.hidden;
      page.sections.push({
        ...element.props,
        withBadge,
        items,
        hidden,
        showTitle
      });
    }
  });
  return page;
}
function getSettingsItemsFromChildren(children, filterRe) {
  let hidden = true;
  const items = [];
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }
    if (element.type === React.Fragment) {
      const fragmentItems = getSettingsItemsFromChildren(element.props.children, filterRe);
      items.push(...fragmentItems.items);
      hidden = hidden && fragmentItems.hidden;
    } else {
      const item = {
        ...element.props,
        element,
        hidden: !filterRe.test(element.props.title)
      };
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
      if (selection.page !== page.id) continue;
      return { page };
    }
    for (const section of page.sections) {
      if (selection.settingId) {
        for (const setting of section.items) {
          if (setting.id === selection.settingId) {
            return { page, section, setting };
          }
        }
      } else if (selection.section && ("id" in selection.section ? selection.section.id === section.id : selection.section.title === section.title)) {
        return { page, section };
      }
    }
  }
  return {};
}

exports.getSelectedSettingsPart = getSelectedSettingsPart;
exports.getSettingsFromChildren = getSettingsFromChildren;
//# sourceMappingURL=index.cjs65.js.map
