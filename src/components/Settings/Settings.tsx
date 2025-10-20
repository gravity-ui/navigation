import React from 'react';

import {Flex, Loader} from '@gravity-ui/uikit';
import identity from 'lodash/identity';

import {Title} from '../Title';

import {
    SettingsSelectionContextProvider,
    SettingsSelectionProviderContextValue,
    useSettingsSelectionContext,
    useSettingsSelectionProviderValue,
} from './Selection/context';
import {isSectionSelected} from './Selection/utils';
import {SettingsContext} from './SettingsContext/SettingsContext';
import {useSettingsContext} from './SettingsContext/useSettingsContext';
import {SettingsMenu, SettingsMenuInstance} from './SettingsMenu/SettingsMenu';
import {SettingsMenuMobile} from './SettingsMenuMobile/SettingsMenuMobile';
import {SettingRow} from './SettingsRow/SettingsRow';
import {useAllResultsPage} from './SettingsSearch/AllResultsPage';
import {SettingsSearch} from './SettingsSearch/SettingsSearch';
import {b} from './b';
import type {SettingsMenu as SettingsMenuType, SettingsPageSection} from './collect-settings';
import {
    SettingsMenu as CollectSettingsSettingsMenu,
    SettingsPage,
    getSettingsFromChildren,
} from './collect-settings';
import i18n from './i18n';
import type {
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

const getPageTitleById = (menu: SettingsMenuType, activePage: string) => {
    for (const firstLevel of menu) {
        if ('groupTitle' in firstLevel) {
            for (const secondLevel of firstLevel.items)
                if (secondLevel.id === activePage) return secondLevel.title;
        } else if (firstLevel.id === activePage) return firstLevel.title;
    }

    return '';
};

const SectionItem = React.forwardRef<
    HTMLDivElement,
    SettingsPageSection & {
        search: string;
        isMobile: boolean;
        isSelected: boolean;
    }
>(({search, isMobile, isSelected, ...section}, ref) => {
    const {renderSectionRightAdornment, showRightAdornmentOnHover} = useSettingsContext();

    return (
        <div className={b('section', {selected: isSelected})} ref={isSelected ? ref : undefined}>
            {section.title && !section.hideTitle && (
                <h3 className={b('section-heading')}>
                    {renderSectionRightAdornment ? (
                        <Flex gap={2} alignItems={'center'}>
                            {section.title}
                            <div
                                className={b('section-right-adornment', {
                                    hidden: showRightAdornmentOnHover,
                                })}
                            >
                                {renderSectionRightAdornment(section)}
                            </div>
                        </Flex>
                    ) : (
                        section.title
                    )}
                </h3>
            )}

            {section.header &&
                (isMobile ? (
                    <div className={b('section-subheader')}>{section.header}</div>
                ) : (
                    section.header
                ))}

            {section.items.map((setting) =>
                setting.hidden ? null : (
                    <SettingRow {...setting} key={setting.title} search={search} />
                ),
            )}
        </div>
    );
});

SectionItem.displayName = 'SectionItem';

const PageContentComponent = ({
    menu,
    pages,
    selected,
    isMobile,
    search,
    page,
    renderNotFound,
    emptyPlaceholder,
    onClose,
}: {
    menu: CollectSettingsSettingsMenu;
    pages: Record<string, SettingsPage>;
    page: string | undefined;
    isMobile: boolean;
    search: string;
    selected: SettingsSelectionProviderContextValue;
} & Pick<
    SettingsContentProps,
    'renderNotFound' | 'emptyPlaceholder' | 'onClose'
>): React.ReactElement => {
    if (!page) {
        return typeof renderNotFound === 'function' ? (
            <>{renderNotFound()}</>
        ) : (
            <div className={b('not-found')}>{emptyPlaceholder}</div>
        );
    }

    const filteredSections = pages[page].sections.filter((section) => !section.hidden);

    return (
        <React.Fragment>
            {!isMobile && (
                <Title hasSeparator onClose={onClose}>
                    {getPageTitleById(menu, page)}
                </Title>
            )}

            <div className={b('content')}>
                {filteredSections.map((section) => {
                    const isSelected = isSectionSelected(selected, page, section);

                    return (
                        <SectionItem
                            isSelected={isSelected}
                            isMobile={isMobile}
                            search={search}
                            {...section}
                            key={section.title}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

type SettingsContentProps = Omit<SettingsProps, 'loading' | 'renderLoading'>;
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
                    <PageContentComponent
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
            className={b('item', {align, mode, selected: isSettingSelected})}
            ref={isSettingSelected ? selected.selectedRef : undefined}
        >
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
                {description ? <span className={b('item-description')}>{description}</span> : null}
            </label>
            <div className={b('item-content')}>{children}</div>
        </div>
    );
};
