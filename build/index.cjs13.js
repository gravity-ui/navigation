'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const identity = require('./index.cjs60.js');
const cn = require('./index.cjs24.js');
const context = require('./index.cjs12.js');
const utils = require('./index.cjs61.js');
const SettingsMenu = require('./index.cjs62.js');
const SettingsMenuMobile = require('./index.cjs63.js');
const SettingsSearch = require('./index.cjs64.js');
const collectSettings = require('./index.cjs65.js');
const helpers = require('./index.cjs66.js');
const index = require('./index.cjs67.js');
;/* empty css             */
const Title = require('./index.cjs10.js');

const b = cn.block("settings");
const SettingsContext = React.createContext({});
const useSettingsContext = () => React.useContext(SettingsContext);
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
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: b({ loading: true, view }), children: typeof renderLoading === "function" ? renderLoading() : /* @__PURE__ */ jsxRuntime.jsx(uikit.Loader, { className: b("loader"), size: "m" }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    SettingsContext.Provider,
    {
      value: { renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover },
      children: /* @__PURE__ */ jsxRuntime.jsx(SettingsContent, { view, ...props, children })
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
  title = index.default("label_title"),
  filterPlaceholder = index.default("label_filter-placeholder"),
  emptyPlaceholder = index.default("label_empty-placeholder"),
  view,
  onPageChange,
  onClose
}) {
  const { renderSectionRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
  const [search, setSearch] = React.useState(initialSearch ?? "");
  const { menu, pages } = collectSettings.getSettingsFromChildren(children, search);
  const selected = context.useSettingsSelectionProviderValue(pages, selection);
  const pageKeys = Object.keys(pages);
  const selectionInitialPage = selected.page && pageKeys.includes(selected.page.id) ? selected.page.id : void 0;
  const [selectedPage, setCurrentPage] = React.useState(
    selectionInitialPage || (initialPage && pageKeys.includes(initialPage) ? initialPage : void 0)
  );
  const searchInputRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const isMobile = view === "mobile";
  React.useEffect(() => {
    menuRef.current?.clearFocus();
  }, [search]);
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (activePage !== selectedPage) {
      handlePageChange(activePage);
    }
  });
  React.useEffect(() => {
    if (!selectionInitialPage) return;
    setCurrentPage(selectionInitialPage);
  }, [selectionInitialPage]);
  React.useEffect(() => {
    if (selected.selectedRef?.current) {
      selected.selectedRef.current.scrollIntoView();
    }
  }, [selected.selectedRef]);
  const renderSetting = ({ title: settingTitle, element }) => {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("section-item"), children: React.cloneElement(element, {
      ...element.props,
      highlightedTitle: search && settingTitle ? prepareTitle(settingTitle, search) : settingTitle
    }) }, settingTitle);
  };
  const renderSection = (page, section) => {
    const isSelected = utils.isSectionSelected(selected, page, section);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: b("section", { selected: isSelected, "only-child": section.onlyChild }),
        ref: isSelected ? selected.selectedRef : void 0,
        children: [
          section.showTitle && /* @__PURE__ */ jsxRuntime.jsx("h3", { className: b("section-heading"), children: renderSectionRightAdornment ? /* @__PURE__ */ jsxRuntime.jsxs(uikit.Flex, { gap: 2, alignItems: "center", children: [
            section.title,
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: b("section-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderSectionRightAdornment(section)
              }
            )
          ] }) : section.title }),
          section.header && (isMobile ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("section-subheader"), children: section.header }) : section.header),
          section.items.map((setting) => setting.hidden ? null : renderSetting(setting))
        ]
      },
      section.title
    );
  };
  const renderPageContent = (page) => {
    if (!page) {
      return typeof renderNotFound === "function" ? renderNotFound() : /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("not-found"), children: emptyPlaceholder });
    }
    const filteredSections = pages[page].sections.filter((section) => !section.hidden);
    return /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
      !isMobile && /* @__PURE__ */ jsxRuntime.jsx(Title.Title, { hasSeparator: true, onClose, children: getPageTitleById(menu, page) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("content"), children: filteredSections.map((section) => renderSection(page, section)) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(context.SettingsSelectionContextProvider, { value: selected, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b({ view }), children: [
    isMobile ? /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        SettingsSearch.SettingsSearch,
        {
          inputRef: searchInputRef,
          className: b("search"),
          initialValue: initialSearch,
          onChange: setSearch,
          autoFocus: false,
          inputSize: "xl"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        SettingsMenuMobile.SettingsMenuMobile,
        {
          items: menu,
          onChange: handlePageChange,
          activeItemId: activePage,
          className: b("tabs")
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs(
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
          /* @__PURE__ */ jsxRuntime.jsx(Title.Title, { children: title }),
          /* @__PURE__ */ jsxRuntime.jsx(
            SettingsSearch.SettingsSearch,
            {
              inputRef: searchInputRef,
              className: b("search"),
              initialValue: initialSearch,
              onChange: setSearch,
              placeholder: filterPlaceholder,
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            SettingsMenu.SettingsMenu,
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
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("page"), children: renderPageContent(activePage) })
  ] }) });
}
Settings.Group = function SettingsGroup({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(React.Fragment, { children });
};
Settings.Page = function SettingsPage({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(React.Fragment, { children });
};
Settings.Section = function SettingsSection({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(React.Fragment, { children });
};
Settings.Item = function SettingsItem(setting) {
  const {
    id,
    labelId,
    highlightedTitle,
    children,
    align = "center",
    withBadge,
    renderTitleComponent = identity.default,
    mode,
    description
  } = setting;
  const selected = context.useSettingsSelectionContext();
  const isSettingSelected = selected.setting && selected.setting.id === id;
  const { renderRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
  const titleNode = /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("item-title", { badge: withBadge }), children: renderTitleComponent(highlightedTitle) });
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: b("item", { align, mode, selected: isSettingSelected }),
      ref: isSettingSelected ? selected.selectedRef : void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("label", { className: b("item-heading"), id: labelId, children: [
          renderRightAdornment ? /* @__PURE__ */ jsxRuntime.jsxs(uikit.Flex, { className: b("item-title-wrapper"), gap: 3, children: [
            titleNode,
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: b("item-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderRightAdornment(setting)
              }
            )
          ] }) : titleNode,
          description ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("item-description"), children: description }) : null
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("item-content"), children })
      ]
    }
  );
};
function prepareTitle(string, search) {
  let temp = string.slice(0);
  const title = [];
  const parts = helpers.escapeStringForRegExp(search).split(" ").filter(Boolean);
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
        /* @__PURE__ */ jsxRuntime.jsx("strong", { className: b("found"), children: m }, key++)
      );
      temp = temp.slice(i + m.length);
    }
  }
  if (temp) {
    title.push(temp);
  }
  return title;
}

exports.Settings = Settings;
exports.useSettingsContext = useSettingsContext;
//# sourceMappingURL=index.cjs13.js.map
