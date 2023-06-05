import React from 'react';
import {block} from '../utils/cn';
import identity from 'lodash/identity';

import {IconProps, Loader} from '@gravity-ui/uikit';
import {SettingsSearch} from './SettingsSearch/SettingsSearch';
import {SettingsMenu, SettingsMenuInstance} from './SettingsMenu/SettingsMenu';

import {getSettingsFromChildren} from './collect-settings';
import {escapeStringForRegExp} from './helpers';

import './Settings.scss';

const b = block('settings');

interface SettingsProps {
    initialPage?: string;
    onPageChange?: (page: string | undefined) => void;
    children: React.ReactNode;
    renderNotFound?: () => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    loading?: boolean;
    dict?: SettingsDict;
    mode?: 'onepage';
}
type SettingsDict = Record<SettingsDictKeys, string>;
type SettingsDictKeys = 'heading_settings' | 'placeholder_search' | 'not_found';

const defaultDict: SettingsDict = {
    heading_settings: 'Settings',
    placeholder_search: 'Search settings',
    not_found: 'No results found',
};

interface SettingsGroupProps {
    id?: string;
    groupTitle: string;
    children: React.ReactNode;
}

interface SettingsPageProps {
    id?: string;
    title: string;
    icon: IconProps;
    children: React.ReactNode;
}

interface SettingsSectionProps {
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    withBadge?: boolean;
}

interface SettingsItemProps {
    title: string;
    renderTitleComponent?: (highlightedTitle: React.ReactNode | null) => React.ReactNode;
    align?: 'top' | 'center';
    children: React.ReactNode;
    withBadge?: boolean;
}

export function Settings({loading, renderLoading, children, mode, ...props}: SettingsProps) {
    if (loading) {
        return (
            <div className={b({loading: true, mode})}>
                {typeof renderLoading === 'function' ? (
                    renderLoading()
                ) : (
                    <Loader className={b('loader')} size="m" />
                )}
            </div>
        );
    }

    return (
        <SettingsContent mode={mode} {...props}>
            {children}
        </SettingsContent>
    );
}

Settings.defaultProps = {
    dict: defaultDict,
};

type SettingsContentProps = Omit<SettingsProps, 'loading' | 'renderLoading'>;
function SettingsContent({
    initialPage,
    onPageChange,
    children,
    renderNotFound,
    dict,
    mode,
}: SettingsContentProps) {
    const [search, setSearch] = React.useState('');
    const {menu, pages} = getSettingsFromChildren(children, search);
    const pageKeys = Object.keys(pages);
    const [selectedPage, setCurrentPage] = React.useState<string | undefined>(
        initialPage && pageKeys.includes(initialPage) ? initialPage : undefined,
    );
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const menuRef = React.useRef<SettingsMenuInstance>(null);

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
                <div className={b('not-found')}>{dict?.not_found}</div>
            );
        }

        return pages[activePage].sections
            .filter((section) => !section.hidden)
            .map((section) => (
                <div key={section.title} className={b('section')}>
                    <h3 className={b('section-heading')}>{section.title}</h3>
                    {section.header ? section.header : null}
                    {section.items.map(({hidden, title, element}) =>
                        hidden ? null : (
                            <div key={title} className={b('section-item')}>
                                {React.cloneElement(element, {
                                    ...element.props,
                                    title: search && title ? prepareTitle(title, search) : title,
                                })}
                            </div>
                        ),
                    )}
                </div>
            ));
    };

    return (
        <div className={b({mode})}>
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
                <h2 className={b('heading')}>{dict?.heading_settings}</h2>
                <SettingsSearch
                    inputRef={searchInputRef}
                    className={b('search')}
                    onChange={setSearch}
                    placeholder={dict?.placeholder_search}
                />
                <SettingsMenu
                    ref={menuRef}
                    items={menu}
                    onChange={handlePageChange}
                    activeItem={activePage}
                />
            </div>
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
}: SettingsItemProps) {
    return (
        <div className={b('item', {align})}>
            <label className={b('item-heading', {badge: withBadge})}>
                {renderTitleComponent(title)}
            </label>
            <div>{children}</div>
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
