import React from 'react';

import {Flex, Loader} from '@gravity-ui/uikit';
import identity from 'lodash/identity';

import {Title} from '../Title';

import {
    SettingsSelectionContextProvider,
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
import {getSettingsFromChildren} from './collect-settings';
import i18n from './i18n';
import type {
    SettingsContentProps,
    SettingsGroupProps,
    SettingsItemProps,
    SettingsPageProps,
    SettingsProps,
    SettingsSectionProps,
} from './types';

import './Settings.scss';

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
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const menuRef = React.useRef<SettingsMenuInstance>(null);
    const isMobile = view === 'mobile';

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

    let activePage = selectedPage;

    if (!activePage || !pages[activePage] || pages[activePage].hidden) {
        activePage = Object.values(pages).find(({hidden}) => !hidden)?.id;
    }

    const handlePageChange = (newPage: string | undefined) => {
        setCurrentPage((prevPage) => {
            if (prevPage !== newPage && !isFakePage(newPage)) {
                onPageChange?.(newPage);
            }
            return newPage;
        });
    };

    const {isAllSearchPage} = useAllResultsPage({pages, handlePageChange});

    function isFakePage(page: string | undefined) {
        return isAllSearchPage(page);
    }

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

    return (
        <SettingsSelectionContextProvider value={selected}>
            <div className={b({view})}>
                {isMobile ? (
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
                            onChange={handlePageChange}
                            activeItemId={activePage}
                            className={b('tabs')}
                        />
                    </React.Fragment>
                ) : (
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
                            onChange={handlePageChange}
                            activeItemId={activePage}
                        />
                    </div>
                )}
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
        showTitle = true,
    } = setting;

    const selected = useSettingsSelectionContext();
    const isSettingSelected = selected.setting && selected.setting.id === id;

    const {renderRightAdornment, showRightAdornmentOnHover} = useSettingsContext();
    const titleNode = (
        <span className={b('item-title', {badge: withBadge})}>
            {renderTitleComponent(highlightedTitle)}
        </span>
    );
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
