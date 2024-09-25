import { jsx, jsxs } from 'react/jsx-runtime';
import React__default from 'react';
import { Loader, Flex } from '@gravity-ui/uikit';
import identity from '../../node_modules/lodash/identity.mjs';
import { block } from '../utils/cn.mjs';
import { useSettingsSelectionProviderValue, SettingsSelectionContextProvider, useSettingsSelectionContext } from './Selection/context.mjs';
import { isSectionSelected } from './Selection/utils.mjs';
import { SettingsMenu } from './SettingsMenu/SettingsMenu.mjs';
import { SettingsMenuMobile } from './SettingsMenuMobile/SettingsMenuMobile.mjs';
import { SettingsSearch } from './SettingsSearch/SettingsSearch.mjs';
import { getSettingsFromChildren } from './collect-settings.mjs';
import { escapeStringForRegExp } from './helpers.mjs';
import i18n from './i18n/index.mjs';
/* empty css               */
import { Title } from '../Title/Title.mjs';

const b = block("settings");
const SettingsContext = React__default.createContext({});
const useSettingsContext = () => React__default.useContext(SettingsContext);
function Settings({
  loading,
  renderLoading,
  children,
  view = "normal",
  renderRightAdornment,
  renderSectionRightAdornment,
  showRightAdornmentOnHover = true,
  ...props
}) {
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: b({ loading: true, view }), children: typeof renderLoading === "function" ? renderLoading() : /* @__PURE__ */ jsx(Loader, { className: b("loader"), size: "m" }) });
  }
  return /* @__PURE__ */ jsx(
    SettingsContext.Provider,
    {
      value: { renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover },
      children: /* @__PURE__ */ jsx(SettingsContent, { view, ...props, children })
    }
  );
}
const getPageTitleById = (menu, activePage) => {
  for (const firstLevel of menu) {
    if ("groupTitle" in firstLevel) {
      for (const secondLevel of firstLevel.items)
        if (secondLevel.id === activePage) return secondLevel.title;
    } else if (firstLevel.id === activePage) return firstLevel.title;
  }
  return "";
};
function SettingsContent({
  initialPage,
  initialSearch,
  selection,
  children,
  renderNotFound,
  title = i18n("label_title"),
  filterPlaceholder = i18n("label_filter-placeholder"),
  emptyPlaceholder = i18n("label_empty-placeholder"),
  view,
  onPageChange,
  onClose
}) {
  const { renderSectionRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
  const [search, setSearch] = React__default.useState(initialSearch ?? "");
  const { menu, pages } = getSettingsFromChildren(children, search);
  const selected = useSettingsSelectionProviderValue(pages, selection);
  const pageKeys = Object.keys(pages);
  const selectionInitialPage = selected.page && pageKeys.includes(selected.page.id) ? selected.page.id : void 0;
  const [selectedPage, setCurrentPage] = React__default.useState(
    selectionInitialPage || (initialPage && pageKeys.includes(initialPage) ? initialPage : void 0)
  );
  const searchInputRef = React__default.useRef(null);
  const menuRef = React__default.useRef(null);
  const isMobile = view === "mobile";
  React__default.useEffect(() => {
    menuRef.current?.clearFocus();
  }, [search]);
  React__default.useEffect(() => {
    const handler = () => {
      menuRef.current?.clearFocus();
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);
  let activePage = selectedPage;
  if (!activePage || pages[activePage]?.hidden) {
    activePage = Object.values(pages).find(({ hidden }) => !hidden)?.id;
  }
  const handlePageChange = (newPage) => {
    setCurrentPage((prevPage) => {
      if (prevPage !== newPage) {
        onPageChange?.(newPage);
      }
      return newPage;
    });
  };
  React__default.useEffect(() => {
    if (activePage !== selectedPage) {
      handlePageChange(activePage);
    }
  });
  React__default.useEffect(() => {
    if (!selectionInitialPage) return;
    setCurrentPage(selectionInitialPage);
  }, [selectionInitialPage]);
  React__default.useEffect(() => {
    if (selected.selectedRef?.current) {
      selected.selectedRef.current.scrollIntoView();
    }
  }, [selected.selectedRef]);
  const renderSetting = ({ title: settingTitle, element }) => {
    return /* @__PURE__ */ jsx("div", { className: b("section-item"), children: React__default.cloneElement(element, {
      ...element.props,
      highlightedTitle: search && settingTitle ? prepareTitle(settingTitle, search) : settingTitle
    }) }, settingTitle);
  };
  const renderSection = (page, section) => {
    const isSelected = isSectionSelected(selected, page, section);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: b("section", { selected: isSelected, "only-child": section.onlyChild }),
        ref: isSelected ? selected.selectedRef : void 0,
        children: [
          section.showTitle && /* @__PURE__ */ jsx("h3", { className: b("section-heading"), children: renderSectionRightAdornment ? /* @__PURE__ */ jsxs(Flex, { gap: 2, alignItems: "center", children: [
            section.title,
            /* @__PURE__ */ jsx(
              "div",
              {
                className: b("section-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderSectionRightAdornment(section)
              }
            )
          ] }) : section.title }),
          section.header && (isMobile ? /* @__PURE__ */ jsx("div", { className: b("section-subheader"), children: section.header }) : section.header),
          section.items.map((setting) => setting.hidden ? null : renderSetting(setting))
        ]
      },
      section.title
    );
  };
  const renderPageContent = (page) => {
    if (!page) {
      return typeof renderNotFound === "function" ? renderNotFound() : /* @__PURE__ */ jsx("div", { className: b("not-found"), children: emptyPlaceholder });
    }
    const filteredSections = pages[page].sections.filter((section) => !section.hidden);
    return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
      !isMobile && /* @__PURE__ */ jsx(Title, { hasSeparator: true, onClose, children: getPageTitleById(menu, page) }),
      /* @__PURE__ */ jsx("div", { className: b("content"), children: filteredSections.map((section) => renderSection(page, section)) })
    ] });
  };
  return /* @__PURE__ */ jsx(SettingsSelectionContextProvider, { value: selected, children: /* @__PURE__ */ jsxs("div", { className: b({ view }), children: [
    isMobile ? /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
      /* @__PURE__ */ jsx(
        SettingsSearch,
        {
          inputRef: searchInputRef,
          className: b("search"),
          initialValue: initialSearch,
          onChange: setSearch,
          autoFocus: false,
          inputSize: "xl"
        }
      ),
      /* @__PURE__ */ jsx(
        SettingsMenuMobile,
        {
          items: menu,
          onChange: handlePageChange,
          activeItemId: activePage,
          className: b("tabs")
        }
      )
    ] }) : /* @__PURE__ */ jsxs(
      "div",
      {
        className: b("menu"),
        onClick: () => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        },
        onKeyDown: (event) => {
          if (menuRef.current) {
            if (menuRef.current.handleKeyDown(event)) {
              event.preventDefault();
            }
          }
        },
        children: [
          /* @__PURE__ */ jsx(Title, { children: title }),
          /* @__PURE__ */ jsx(
            SettingsSearch,
            {
              inputRef: searchInputRef,
              className: b("search"),
              initialValue: initialSearch,
              onChange: setSearch,
              placeholder: filterPlaceholder,
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsx(
            SettingsMenu,
            {
              ref: menuRef,
              items: menu,
              onChange: handlePageChange,
              activeItemId: activePage
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: b("page"), children: renderPageContent(activePage) })
  ] }) });
}
Settings.Group = function SettingsGroup({ children }) {
  return /* @__PURE__ */ jsx(React__default.Fragment, { children });
};
Settings.Page = function SettingsPage({ children }) {
  return /* @__PURE__ */ jsx(React__default.Fragment, { children });
};
Settings.Section = function SettingsSection({ children }) {
  return /* @__PURE__ */ jsx(React__default.Fragment, { children });
};
Settings.Item = function SettingsItem(setting) {
  const {
    id,
    labelId,
    highlightedTitle,
    children,
    align = "center",
    withBadge,
    renderTitleComponent = identity,
    mode,
    description
  } = setting;
  const selected = useSettingsSelectionContext();
  const isSettingSelected = selected.setting && selected.setting.id === id;
  const { renderRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
  const titleNode = /* @__PURE__ */ jsx("span", { className: b("item-title", { badge: withBadge }), children: renderTitleComponent(highlightedTitle) });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: b("item", { align, mode, selected: isSettingSelected }),
      ref: isSettingSelected ? selected.selectedRef : void 0,
      children: [
        /* @__PURE__ */ jsxs("label", { className: b("item-heading"), id: labelId, children: [
          renderRightAdornment ? /* @__PURE__ */ jsxs(Flex, { className: b("item-title-wrapper"), gap: 3, children: [
            titleNode,
            /* @__PURE__ */ jsx(
              "div",
              {
                className: b("item-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderRightAdornment(setting)
              }
            )
          ] }) : titleNode,
          description ? /* @__PURE__ */ jsx("span", { className: b("item-description"), children: description }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: b("item-content"), children })
      ]
    }
  );
};
function prepareTitle(string, search) {
  let temp = string.slice(0);
  const title = [];
  const parts = escapeStringForRegExp(search).split(" ").filter(Boolean);
  let key = 0;
  for (const part of parts) {
    const regex = new RegExp(part, "ig");
    const match = regex.exec(temp);
    if (match) {
      const m = match[0];
      const i = match.index;
      if (i > 0) {
        title.push(temp.slice(0, i));
      }
      title.push(
        /* @__PURE__ */ jsx("strong", { className: b("found"), children: m }, key++)
      );
      temp = temp.slice(i + m.length);
    }
  }
  if (temp) {
    title.push(temp);
  }
  return title;
}

export { Settings, useSettingsContext };
//# sourceMappingURL=Settings.mjs.map
