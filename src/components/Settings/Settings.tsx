import React, {PropsWithChildren} from 'react';

import {Flex, Loader, TabPanel, TabProvider} from '@gravity-ui/uikit';
import identity from 'lodash/identity';

import {Title} from '../Title';

import {
    SettingsSelectionContextProvider,
    SettingsSelectionProviderContextValue,
    useSettingsSelectionContext,
    useSettingsSelectionProviderValue,
} from './Selection/context';
import {SettingsContext} from './SettingsContext/SettingsContext';
import {useSettingsContext} from './SettingsContext/useSettingsContext';
import {SettingsMenu, SettingsMenuInstance} from './SettingsMenu/SettingsMenu';
import {SettingsMenuMobile} from './SettingsMenuMobile/SettingsMenuMobile';
import {SettingsPageComponent} from './SettingsPage/SettingsPageComponent';
import {useAllResultsPage} from './SettingsSearch/AllResultsPage';
import {SettingsSearch} from './SettingsSearch/SettingsSearch';
import {b} from './b';
import {SettingsMenu as SettingsMenuType, getSettingsFromChildren} from './collect-settings';
import i18n from './i18n';
import type {
    SettingsContentProps,
    SettingsGroupProps,
    SettingsItemProps,
    SettingsPageProps,
    SettingsProps,
    SettingsSectionProps,
} from './types';

export function Settings({
    loading,
    renderLoading,
    children,
    view = 'normal',
    renderRightAdornment,
    renderSectionRightAdornment,
    showRightAdornmentOnHover = true,
    ...props
}: SettingsProps) {
    if (loading) {
        return (
            <div className={b({loading: true, view})}>
                {typeof renderLoading === 'function' ? (
                    renderLoading()
                ) : (
                    <Loader className={b('loader')} size="m" />
                )}
            </div>
        );
    }

    return (
        <SettingsContext.Provider
            value={{renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover}}
        >
            <SettingsContent view={view} {...props}>
                {children}
            </SettingsContent>
        </SettingsContext.Provider>
    );
}

interface SettingsContentInnerProps
    extends PropsWithChildren,
        Pick<SettingsContentProps, 'initialSearch' | 'selection' | 'title' | 'filterPlaceholder'> {
    initialSearch?: string;
    selected: SettingsSelectionProviderContextValue;
    activePage?: string;
    menu: SettingsMenuType;
    search: string;
    setSearch: (newValue: string) => void;
    onPageChange: (newPage: string | undefined) => void;
}

function SettingsContentInnerMobile({
    initialSearch,
    selection,
    menu,
    activePage,
    setSearch,
    onPageChange,
    children,
    enableTabsScroll,
}: SettingsContentInnerProps & {enableTabsScroll?: boolean}) {
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <TabProvider value={activePage} onUpdate={onPageChange}>
            <React.Fragment>
                <SettingsSearch
                    inputRef={searchInputRef}
                    className={b('search')}
                    initialValue={initialSearch}
                    selection={selection}
                    onChange={setSearch}
                    autoFocus={false}
                    inputSize={'xl'}
                />
                <SettingsMenuMobile
                    items={menu}
                    className={b('tabs')}
                    enableTabsScroll={enableTabsScroll}
                />
            </React.Fragment>
            {activePage ? <TabPanel value={activePage}>{children}</TabPanel> : children}
        </TabProvider>
    );
}

function SettingsContentInnerDesktop({
    title,
    selection,
    menu,
    activePage,
    filterPlaceholder,
    initialSearch,
    search,
    setSearch,
    onPageChange,
    children,
}: SettingsContentInnerProps) {
    const menuRef = React.useRef<SettingsMenuInstance>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        menuRef.current?.clearFocus();
    }, [search]);

    React.useEffect(() => {
        const handler = () => {
            menuRef.current?.clearFocus();
        };
        window.addEventListener('click', handler);
        return () => {
            window.removeEventListener('click', handler);
        };
    }, []);

    return (
        <React.Fragment>
            <div
                className={b('menu')}
                onClick={() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }}
                onKeyDown={(event) => {
                    if (menuRef.current) {
                        if (menuRef.current.handleKeyDown(event)) {
                            event.preventDefault();
                        }
                    }
                }}
            >
                <Title>{title}</Title>
                <SettingsSearch
                    inputRef={searchInputRef}
                    className={b('search')}
                    initialValue={initialSearch}
                    selection={selection}
                    onChange={setSearch}
                    placeholder={filterPlaceholder}
                    autoFocus
                />
                <SettingsMenu
                    ref={menuRef}
                    items={menu}
                    onChange={onPageChange}
                    activeItemId={activePage}
                />
            </div>
            {children}
        </React.Fragment>
    );
}

function SettingsContent({
    initialPage,
    initialSearch,
    selection,
    children,
    renderNotFound,
    title = i18n('label_title'),
    filterPlaceholder = i18n('label_filter-placeholder'),
    emptyPlaceholder = i18n('label_empty-placeholder'),
    view,
    onPageChange,
    onClose,
    enableMobileSettingsTabsScroll,
}: SettingsContentProps) {
    const [search, setSearch] = React.useState(initialSearch ?? '');
    const {menu, pages} = getSettingsFromChildren(children, search);

    const selected = useSettingsSelectionProviderValue(pages, selection);

    const pageKeys = Object.keys(pages);
    const selectionInitialPage =
        selected.page && pageKeys.includes(selected.page.id) ? selected.page.id : undefined;
    const [selectedPage, setCurrentPage] = React.useState<string | undefined>(
        selectionInitialPage ||
            (initialPage && pageKeys.includes(initialPage) ? initialPage : undefined),
    );
    const isMobile = view === 'mobile';

    let activePage = selectedPage;

    if (!activePage || !pages[activePage] || pages[activePage].hidden) {
        activePage = Object.values(pages).find(({hidden}) => !hidden)?.id;
    }

    const {isAllSearchPage, hasAllSearchResultsPage, allSearchResultsId} = useAllResultsPage({
        pages,
    });

    const handlePageChange = React.useCallback(
        (newPage: string | undefined) => {
            setCurrentPage((prevPage) => {
                if (prevPage !== newPage && !isAllSearchPage(newPage)) {
                    onPageChange?.(newPage);
                }
                return newPage;
            });
        },
        [isAllSearchPage, onPageChange],
    );

    React.useEffect(() => {
        if (hasAllSearchResultsPage) {
            handlePageChange(allSearchResultsId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAllSearchResultsPage]);

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

    const tabContent = React.useMemo(
        () => (
            <div className={b('page')}>
                <SettingsPageComponent
                    menu={menu}
                    pages={pages}
                    selected={selected}
                    search={search}
                    isMobile={isMobile}
                    page={activePage}
                    emptyPlaceholder={emptyPlaceholder}
                    renderNotFound={renderNotFound}
                    onClose={onClose}
                />
            </div>
        ),
        [
            activePage,
            emptyPlaceholder,
            isMobile,
            menu,
            onClose,
            pages,
            renderNotFound,
            search,
            selected,
        ],
    );

    const contentInnerProps = React.useMemo<SettingsContentInnerProps>(
        () => ({
            menu,
            onPageChange: handlePageChange,
            selected,
            setSearch,
            activePage,
            filterPlaceholder,
            selection,
            initialSearch,
            title,
            search,
        }),
        [
            activePage,
            filterPlaceholder,
            handlePageChange,
            initialSearch,
            menu,
            search,
            selected,
            selection,
            title,
        ],
    );

    return (
        <SettingsSelectionContextProvider value={selected}>
            <div className={b({view})}>
                {isMobile ? (
                    <SettingsContentInnerMobile
                        {...contentInnerProps}
                        enableTabsScroll={enableMobileSettingsTabsScroll}
                    >
                        {tabContent}
                    </SettingsContentInnerMobile>
                ) : (
                    <SettingsContentInnerDesktop {...contentInnerProps}>
                        {tabContent}
                    </SettingsContentInnerDesktop>
                )}
            </div>
        </SettingsSelectionContextProvider>
    );
}

Settings.Group = function SettingsGroup({children}: SettingsGroupProps) {
    return <React.Fragment>{children}</React.Fragment>;
};

Settings.Page = function SettingsPage({children}: SettingsPageProps) {
    return <React.Fragment>{children}</React.Fragment>;
};

Settings.Section = function SettingsSection({children}: SettingsSectionProps) {
    return <React.Fragment>{children}</React.Fragment>;
};

Settings.Item = function SettingsItem(setting: SettingsItemProps) {
    const {
        id,
        labelId,
        highlightedTitle,
        children,
        align = 'center',
        withBadge,
        renderTitleComponent = identity,
        mode,
        description,
    } = setting;

    const selected = useSettingsSelectionContext();
    const isSettingSelected = selected.setting && selected.setting.id === id;

    const {renderRightAdornment, showRightAdornmentOnHover} = useSettingsContext();
    const titleComponent = renderTitleComponent(highlightedTitle);
    const titleNode = <span className={b('item-title', {badge: withBadge})}>{titleComponent}</span>;

    const showTitle = titleComponent !== null;

    return (
        <div
            className={b('item', {
                align,
                mode,
                selected: isSettingSelected,
                title: showTitle ? 'show' : 'hide',
            })}
            ref={isSettingSelected ? selected.selectedRef : undefined}
        >
            {showTitle ? (
                <label className={b('item-heading')} id={labelId}>
                    {renderRightAdornment ? (
                        <Flex className={b('item-title-wrapper')} gap={3}>
                            {titleNode}
                            <div
                                className={b('item-right-adornment', {
                                    hidden: showRightAdornmentOnHover,
                                })}
                            >
                                {renderRightAdornment(setting)}
                            </div>
                        </Flex>
                    ) : (
                        titleNode
                    )}
                    {description ? (
                        <span className={b('item-description')}>{description}</span>
                    ) : null}
                </label>
            ) : null}
            <div className={b('item-content')}>{children}</div>
        </div>
    );
};
