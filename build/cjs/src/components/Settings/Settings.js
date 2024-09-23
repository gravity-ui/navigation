'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var React = require('react');
var uikit = require('@gravity-ui/uikit');
var identity = require('../../../node_modules/lodash/identity.js');
var Title = require('../Title/Title.js');
var cn = require('../utils/cn.js');
var context = require('./Selection/context.js');
var utils = require('./Selection/utils.js');
var SettingsMenu = require('./SettingsMenu/SettingsMenu.js');
var SettingsMenuMobile = require('./SettingsMenuMobile/SettingsMenuMobile.js');
var SettingsSearch = require('./SettingsSearch/SettingsSearch.js');
var collectSettings = require('./collect-settings.js');
var helpers = require('./helpers.js');
var index = require('./i18n/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('settings');
const SettingsContext = React__default["default"].createContext({});
const useSettingsContext = () => React__default["default"].useContext(SettingsContext);
function Settings(_a) {
    var { loading, renderLoading, children, view = 'normal', renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover = true } = _a, props = tslib_es6.__rest(_a, ["loading", "renderLoading", "children", "view", "renderRightAdornment", "renderSectionRightAdornment", "showRightAdornmentOnHover"]);
    if (loading) {
        return (React__default["default"].createElement("div", { className: b({ loading: true, view }) }, typeof renderLoading === 'function' ? (renderLoading()) : (React__default["default"].createElement(uikit.Loader, { className: b('loader'), size: "m" }))));
    }
    return (React__default["default"].createElement(SettingsContext.Provider, { value: { renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover } },
        React__default["default"].createElement(SettingsContent, Object.assign({ view: view }, props), children)));
}
const getPageTitleById = (menu, activePage) => {
    for (const firstLevel of menu) {
        if ('groupTitle' in firstLevel) {
            for (const secondLevel of firstLevel.items)
                if (secondLevel.id === activePage)
                    return secondLevel.title;
        }
        else if (firstLevel.id === activePage)
            return firstLevel.title;
    }
    return '';
};
function SettingsContent({ initialPage, initialSearch, selection, children, renderNotFound, title = index["default"]('label_title'), filterPlaceholder = index["default"]('label_filter-placeholder'), emptyPlaceholder = index["default"]('label_empty-placeholder'), view, onPageChange, onClose, }) {
    var _a, _b;
    const { renderSectionRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
    const [search, setSearch] = React__default["default"].useState(initialSearch !== null && initialSearch !== void 0 ? initialSearch : '');
    const { menu, pages } = collectSettings.getSettingsFromChildren(children, search);
    const selected = context.useSettingsSelectionProviderValue(pages, selection);
    const pageKeys = Object.keys(pages);
    const selectionInitialPage = selected.page && pageKeys.includes(selected.page.id) ? selected.page.id : undefined;
    const [selectedPage, setCurrentPage] = React__default["default"].useState(selectionInitialPage ||
        (initialPage && pageKeys.includes(initialPage) ? initialPage : undefined));
    const searchInputRef = React__default["default"].useRef(null);
    const menuRef = React__default["default"].useRef(null);
    const isMobile = view === 'mobile';
    React__default["default"].useEffect(() => {
        var _a;
        (_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.clearFocus();
    }, [search]);
    React__default["default"].useEffect(() => {
        const handler = () => {
            var _a;
            (_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.clearFocus();
        };
        window.addEventListener('click', handler);
        return () => {
            window.removeEventListener('click', handler);
        };
    }, []);
    let activePage = selectedPage;
    if (!activePage || ((_a = pages[activePage]) === null || _a === void 0 ? void 0 : _a.hidden)) {
        activePage = (_b = Object.values(pages).find(({ hidden }) => !hidden)) === null || _b === void 0 ? void 0 : _b.id;
    }
    const handlePageChange = (newPage) => {
        setCurrentPage((prevPage) => {
            if (prevPage !== newPage) {
                onPageChange === null || onPageChange === void 0 ? void 0 : onPageChange(newPage);
            }
            return newPage;
        });
    };
    React__default["default"].useEffect(() => {
        if (activePage !== selectedPage) {
            handlePageChange(activePage);
        }
    });
    React__default["default"].useEffect(() => {
        if (!selectionInitialPage)
            return;
        setCurrentPage(selectionInitialPage);
    }, [selectionInitialPage]);
    React__default["default"].useEffect(() => {
        var _a;
        if ((_a = selected.selectedRef) === null || _a === void 0 ? void 0 : _a.current) {
            selected.selectedRef.current.scrollIntoView();
        }
    }, [selected.selectedRef]);
    const renderSetting = ({ title: settingTitle, element }) => {
        return (React__default["default"].createElement("div", { key: settingTitle, className: b('section-item') }, React__default["default"].cloneElement(element, Object.assign(Object.assign({}, element.props), { highlightedTitle: search && settingTitle ? prepareTitle(settingTitle, search) : settingTitle }))));
    };
    const renderSection = (page, section) => {
        const isSelected = utils.isSectionSelected(selected, page, section);
        return (React__default["default"].createElement("div", { key: section.title, className: b('section', { selected: isSelected, 'only-child': section.onlyChild }), ref: isSelected ? selected.selectedRef : undefined },
            section.showTitle && (React__default["default"].createElement("h3", { className: b('section-heading') }, renderSectionRightAdornment ? (React__default["default"].createElement(uikit.Flex, { gap: 2, alignItems: 'center' },
                section.title,
                React__default["default"].createElement("div", { className: b('section-right-adornment', {
                        hidden: showRightAdornmentOnHover,
                    }) }, renderSectionRightAdornment(section)))) : (section.title))),
            section.header &&
                (isMobile ? (React__default["default"].createElement("div", { className: b('section-subheader') }, section.header)) : (section.header)),
            section.items.map((setting) => (setting.hidden ? null : renderSetting(setting)))));
    };
    const renderPageContent = (page) => {
        if (!page) {
            return typeof renderNotFound === 'function' ? (renderNotFound()) : (React__default["default"].createElement("div", { className: b('not-found') }, emptyPlaceholder));
        }
        const filteredSections = pages[page].sections.filter((section) => !section.hidden);
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            !isMobile && (React__default["default"].createElement(Title.Title, { hasSeparator: true, onClose: onClose }, getPageTitleById(menu, page))),
            React__default["default"].createElement("div", { className: b('content') }, filteredSections.map((section) => renderSection(page, section)))));
    };
    return (React__default["default"].createElement(context.SettingsSelectionContextProvider, { value: selected },
        React__default["default"].createElement("div", { className: b({ view }) },
            isMobile ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                React__default["default"].createElement(SettingsSearch.SettingsSearch, { inputRef: searchInputRef, className: b('search'), initialValue: initialSearch, onChange: setSearch, autoFocus: false, inputSize: 'xl' }),
                React__default["default"].createElement(SettingsMenuMobile.SettingsMenuMobile, { items: menu, onChange: handlePageChange, activeItemId: activePage, className: b('tabs') }))) : (React__default["default"].createElement("div", { className: b('menu'), onClick: () => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }, onKeyDown: (event) => {
                    if (menuRef.current) {
                        if (menuRef.current.handleKeyDown(event)) {
                            event.preventDefault();
                        }
                    }
                } },
                React__default["default"].createElement(Title.Title, null, title),
                React__default["default"].createElement(SettingsSearch.SettingsSearch, { inputRef: searchInputRef, className: b('search'), initialValue: initialSearch, onChange: setSearch, placeholder: filterPlaceholder, autoFocus: true }),
                React__default["default"].createElement(SettingsMenu.SettingsMenu, { ref: menuRef, items: menu, onChange: handlePageChange, activeItemId: activePage }))),
            React__default["default"].createElement("div", { className: b('page') }, renderPageContent(activePage)))));
}
Settings.Group = function SettingsGroup({ children }) {
    return React__default["default"].createElement(React__default["default"].Fragment, null, children);
};
Settings.Page = function SettingsPage({ children }) {
    return React__default["default"].createElement(React__default["default"].Fragment, null, children);
};
Settings.Section = function SettingsSection({ children }) {
    return React__default["default"].createElement(React__default["default"].Fragment, null, children);
};
Settings.Item = function SettingsItem(setting) {
    const { id, labelId, highlightedTitle, children, align = 'center', withBadge, renderTitleComponent = identity["default"], mode, description, } = setting;
    const selected = context.useSettingsSelectionContext();
    const isSettingSelected = selected.setting && selected.setting.id === id;
    const { renderRightAdornment, showRightAdornmentOnHover } = useSettingsContext();
    const titleNode = (React__default["default"].createElement("span", { className: b('item-title', { badge: withBadge }) }, renderTitleComponent(highlightedTitle)));
    return (React__default["default"].createElement("div", { className: b('item', { align, mode, selected: isSettingSelected }), ref: isSettingSelected ? selected.selectedRef : undefined },
        React__default["default"].createElement("label", { className: b('item-heading'), id: labelId },
            renderRightAdornment ? (React__default["default"].createElement(uikit.Flex, { className: b('item-title-wrapper'), gap: 3 },
                titleNode,
                React__default["default"].createElement("div", { className: b('item-right-adornment', {
                        hidden: showRightAdornmentOnHover,
                    }) }, renderRightAdornment(setting)))) : (titleNode),
            description ? React__default["default"].createElement("span", { className: b('item-description') }, description) : null),
        React__default["default"].createElement("div", { className: b('item-content') }, children)));
};
function prepareTitle(string, search) {
    let temp = string.slice(0);
    const title = [];
    const parts = helpers.escapeStringForRegExp(search).split(' ').filter(Boolean);
    let key = 0;
    for (const part of parts) {
        const regex = new RegExp(part, 'ig');
        const match = regex.exec(temp);
        if (match) {
            const m = match[0];
            const i = match.index;
            if (i > 0) {
                title.push(temp.slice(0, i));
            }
            title.push(React__default["default"].createElement("strong", { key: key++, className: b('found') }, m));
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
//# sourceMappingURL=Settings.js.map
