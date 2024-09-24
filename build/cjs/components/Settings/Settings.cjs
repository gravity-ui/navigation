'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');
const identity = require('../../node_modules/lodash/identity.cjs');
const cn = require('../utils/cn.cjs');
const context = require('./Selection/context.cjs');
const utils = require('./Selection/utils.cjs');
const SettingsMenu = require('./SettingsMenu/SettingsMenu.cjs');
const SettingsMenuMobile = require('./SettingsMenuMobile/SettingsMenuMobile.cjs');
const SettingsSearch = require('./SettingsSearch/SettingsSearch.cjs');
const collectSettings = require('./collect-settings.cjs');
const helpers = require('./helpers.cjs');
const index$1 = require('./i18n/index.cjs');
;/* empty css                */
const Title = require('../Title/Title.cjs');
const Loader = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Loader/Loader.cjs');
const Flex = require('../../node_modules/@gravity-ui/uikit/build/esm/components/layout/Flex/Flex.cjs');

const b = cn.block("settings");
const SettingsContext = index.default.createContext({});
const useSettingsContext = () => index.default.useContext(SettingsContext);
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
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b({ loading: true, view }), children: typeof renderLoading === "function" ? renderLoading() : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Loader.Loader, { className: b("loader"), size: "m" }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    SettingsContext.Provider,
    {
      value: { renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover },
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(SettingsContent, { view, ...props, children })
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
  title = index$1.default("label_title"),
  filterPlaceholder = index$1.default("label_filter-placeholder"),
  emptyPlaceholder = index$1.default("label_empty-placeholder"),
  view,
  onPageChange,
  onClose
}) {
  const { renderSectionRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
  const [search, setSearch] = index.default.useState(initialSearch ?? "");
  const { menu, pages } = collectSettings.getSettingsFromChildren(children, search);
  const selected = context.useSettingsSelectionProviderValue(pages, selection);
  const pageKeys = Object.keys(pages);
  const selectionInitialPage = selected.page && pageKeys.includes(selected.page.id) ? selected.page.id : void 0;
  const [selectedPage, setCurrentPage] = index.default.useState(
    selectionInitialPage || (initialPage && pageKeys.includes(initialPage) ? initialPage : void 0)
  );
  const searchInputRef = index.default.useRef(null);
  const menuRef = index.default.useRef(null);
  const isMobile = view === "mobile";
  index.default.useEffect(() => {
    menuRef.current?.clearFocus();
  }, [search]);
  index.default.useEffect(() => {
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
  index.default.useEffect(() => {
    if (activePage !== selectedPage) {
      handlePageChange(activePage);
    }
  });
  index.default.useEffect(() => {
    if (!selectionInitialPage) return;
    setCurrentPage(selectionInitialPage);
  }, [selectionInitialPage]);
  index.default.useEffect(() => {
    if (selected.selectedRef?.current) {
      selected.selectedRef.current.scrollIntoView();
    }
  }, [selected.selectedRef]);
  const renderSetting = ({ title: settingTitle, element }) => {
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("section-item"), children: index.default.cloneElement(element, {
      ...element.props,
      highlightedTitle: search && settingTitle ? prepareTitle(settingTitle, search) : settingTitle
    }) }, settingTitle);
  };
  const renderSection = (page, section) => {
    const isSelected = utils.isSectionSelected(selected, page, section);
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
      "div",
      {
        className: b("section", { selected: isSelected, "only-child": section.onlyChild }),
        ref: isSelected ? selected.selectedRef : void 0,
        children: [
          section.showTitle && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("h3", { className: b("section-heading"), children: renderSectionRightAdornment ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(Flex.Flex, { gap: 2, alignItems: "center", children: [
            section.title,
            /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
              "div",
              {
                className: b("section-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderSectionRightAdornment(section)
              }
            )
          ] }) : section.title }),
          section.header && (isMobile ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("section-subheader"), children: section.header }) : section.header),
          section.items.map((setting) => setting.hidden ? null : renderSetting(setting))
        ]
      },
      section.title
    );
  };
  const renderPageContent = (page) => {
    if (!page) {
      return typeof renderNotFound === "function" ? renderNotFound() : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("not-found"), children: emptyPlaceholder });
    }
    const filteredSections = pages[page].sections.filter((section) => !section.hidden);
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(index.default.Fragment, { children: [
      !isMobile && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Title.Title, { hasSeparator: true, onClose, children: getPageTitleById(menu, page) }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("content"), children: filteredSections.map((section) => renderSection(page, section)) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(context.SettingsSelectionContextProvider, { value: selected, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b({ view }), children: [
    isMobile ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(index.default.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        SettingsMenuMobile.SettingsMenuMobile,
        {
          items: menu,
          onChange: handlePageChange,
          activeItemId: activePage,
          className: b("tabs")
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
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
          /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Title.Title, { children: title }),
          /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
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
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("page"), children: renderPageContent(activePage) })
  ] }) });
}
Settings.Group = function SettingsGroup({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(index.default.Fragment, { children });
};
Settings.Page = function SettingsPage({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(index.default.Fragment, { children });
};
Settings.Section = function SettingsSection({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(index.default.Fragment, { children });
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
  const titleNode = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("item-title", { badge: withBadge }), children: renderTitleComponent(highlightedTitle) });
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
    "div",
    {
      className: b("item", { align, mode, selected: isSettingSelected }),
      ref: isSettingSelected ? selected.selectedRef : void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("label", { className: b("item-heading"), id: labelId, children: [
          renderRightAdornment ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(Flex.Flex, { className: b("item-title-wrapper"), gap: 3, children: [
            titleNode,
            /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
              "div",
              {
                className: b("item-right-adornment", {
                  hidden: showRightAdornmentOnHover
                }),
                children: renderRightAdornment(setting)
              }
            )
          ] }) : titleNode,
          description ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("item-description"), children: description }) : null
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("item-content"), children })
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
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("strong", { className: b("found"), children: m }, key++)
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
//# sourceMappingURL=Settings.cjs.map
