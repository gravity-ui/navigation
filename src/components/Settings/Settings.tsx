import React from 'react';
import {block} from '../utils/cn';
import identity from 'lodash/identity';

import {Flex, IconProps, Loader} from '@gravity-ui/uikit';
import {SettingsSearch} from './SettingsSearch/SettingsSearch';
import {SettingsMenu, SettingsMenuInstance} from './SettingsMenu/SettingsMenu';
import {SettingsMenuMobile} from './SettingsMenuMobile/SettingsMenuMobile';
import {Title} from '../Title';
import i18n from './i18n';

import type {SettingsMenu as SettingsMenuType} from './collect-settings';
import {getSettingsFromChildren} from './collect-settings';
import {escapeStringForRegExp} from './helpers';

import './Settings.scss';

const b = block('settings');

export interface SettingsProps {
    children: React.ReactNode;
    title?: string;
    filterPlaceholder?: string;
    emptyPlaceholder?: string;
    initialPage?: string;
    onPageChange?: (page: string | undefined) => void;
    renderNotFound?: () => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    loading?: boolean;
    view?: 'normal' | 'mobile';
    onClose?: () => void;
    renderRightAdornment?: (item: Pick<SettingsItemProps, 'title'>) => React.ReactNode;
    showRightAdornmentOnHover?: boolean;
}

export interface SettingsGroupProps {
    id?: string;
    groupTitle: string;
    children: React.ReactNode;
}

export interface SettingsPageProps {
    id?: string;
    title: string;
    icon?: IconProps;
    children: React.ReactNode;
}

export interface SettingsSectionProps {
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    withBadge?: boolean;
    showTitle?: boolean;
}

export interface SettingsItemProps {
    title: string;
    renderTitleComponent?: (highlightedTitle: React.ReactNode | null) => React.ReactNode;
    align?: 'top' | 'center';
    children: React.ReactNode;
    withBadge?: boolean;
    mode?: 'row';
    description?: string;
}

export interface SettingsContextType
    extends Pick<SettingsProps, 'renderRightAdornment' | 'showRightAdornmentOnHover'> {}

const SettingsContext = React.createContext<SettingsContextType>({});

export const useSettingsContext = () => React.useContext(SettingsContext);

export function Settings({
    loading,
    renderLoading,
    children,
    view = 'normal',
    renderRightAdornment,
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
        <SettingsContext.Provider value={{renderRightAdornment, showRightAdornmentOnHover}}>
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

type SettingsContentProps = Omit<SettingsProps, 'loading' | 'renderLoading'>;
function SettingsContent({
    initialPage,
    children,
    renderNotFound,
    title = i18n('label_title'),
    filterPlaceholder = i18n('label_filter-placeholder'),
    emptyPlaceholder = i18n('label_empty-placeholder'),
    view,
    onPageChange,
    onClose,
}: SettingsContentProps) {
    const [search, setSearch] = React.useState('');
    const {menu, pages} = getSettingsFromChildren(children, search);
    const pageKeys = Object.keys(pages);
    const [selectedPage, setCurrentPage] = React.useState<string | undefined>(
        initialPage && pageKeys.includes(initialPage) ? initialPage : undefined,
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
    if (!activePage || pages[activePage]?.hidden) {
        activePage = Object.values(pages).find(({hidden}) => !hidden)?.id;
    }

    const handlePageChange = (newPage: string | undefined) => {
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

    const renderPageContent = () => {
        if (!activePage) {
            return typeof renderNotFound === 'function' ? (
                renderNotFound()
            ) : (
                <div className={b('not-found')}>{emptyPlaceholder}</div>
            );
        }

        const filteredSections = pages[activePage].sections.filter((section) => !section.hidden);

        return (
            <>
                {!isMobile && (
                    <Title hasSeparator onClose={onClose}>
                        {getPageTitleById(menu, activePage)}
                    </Title>
                )}

                <div className={b('content')}>
                    {filteredSections.map((section) => (
                        <div key={section.title} className={b('section')}>
                            {section.showTitle && (
                                <h3 className={b('section-heading')}>{section.title}</h3>
                            )}

                            {section.header &&
                                (isMobile ? (
                                    <div className={b('section-subheader')}>{section.header}</div>
                                ) : (
                                    section.header
                                ))}

                            {section.items.map(({hidden, title, element}) =>
                                hidden ? null : (
                                    <div key={title} className={b('section-item')}>
                                        {React.cloneElement(element, {
                                            ...element.props,
                                            title:
                                                search && title
                                                    ? prepareTitle(title, search)
                                                    : title,
                                        })}
                                    </div>
                                ),
                            )}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className={b({view})}>
            {isMobile ? (
                <>
                    <SettingsSearch
                        inputRef={searchInputRef}
                        className={b('search')}
                        onChange={setSearch}
                        autoFocus={false}
                        inputSize={'l'}
                    />
                    <SettingsMenuMobile
                        items={menu}
                        onChange={handlePageChange}
                        activeItemId={activePage}
                        className={b('tabs')}
                    />
                </>
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
            <div className={b('page')}>{renderPageContent()}</div>
        </div>
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

Settings.Item = function SettingsItem({
    title,
    children,
    align = 'center',
    withBadge,
    renderTitleComponent = identity,
    mode,
    description,
}: SettingsItemProps) {
    const {renderRightAdornment, showRightAdornmentOnHover} = useSettingsContext();
    const titleNode = (
        <span className={b('item-title', {badge: withBadge})}>{renderTitleComponent(title)}</span>
    );
    return (
        <div className={b('item', {align, mode})}>
            <label className={b('item-heading')}>
                {renderRightAdornment ? (
                    <Flex className={b('item-title-wrapper')} gap={3}>
                        {titleNode}
                        <div
                            className={b('item-right-adornment', {
                                hidden: showRightAdornmentOnHover,
                            })}
                        >
                            {renderRightAdornment({title})}
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

function prepareTitle(string: string, search: string) {
    let temp = string.slice(0);
    const title: React.ReactNode[] = [];
    const parts = escapeStringForRegExp(search).split(' ').filter(Boolean);
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
            title.push(
                <strong key={key++} className={b('found')}>
                    {m}
                </strong>,
            );
            temp = temp.slice(i + m.length);
        }
    }
    if (temp) {
        title.push(temp);
    }
    return title;
}
