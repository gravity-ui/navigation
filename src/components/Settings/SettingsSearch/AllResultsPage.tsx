import React from 'react';

import {ListUl} from '@gravity-ui/icons';
import {Breadcrumbs} from '@gravity-ui/uikit';

import type {
    SettingBreadcrumbs,
    SettingsDescription,
    SettingsMenu,
    SettingsMenuItem,
    SettingsPage,
    SettingsPageSection,
} from '../collect-settings';
import i18n from '../i18n';

export const allSearchResultsId = 'allSearchResults';
const allSearchResultsLabel = i18n('all_results');

export function useAllResultsPage({
    pages,
    handlePageChange,
}: {
    pages: SettingsDescription['pages'];
    handlePageChange: (page: string | undefined) => void;
}) {
    const allSearchResultsPage = pages[allSearchResultsId];
    const hasAllSearchResultsPage = Boolean(allSearchResultsPage);

    React.useEffect(() => {
        if (hasAllSearchResultsPage) {
            handlePageChange(allSearchResultsId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAllSearchResultsPage]);

    return {
        isAllSearchPage: (page: string | undefined) => page === allSearchResultsId,
        renderBreadcrumbs: (breadcrumbs: SettingBreadcrumbs) => (
            <Breadcrumbs>
                {breadcrumbs.map((breadcrumb) => (
                    <Breadcrumbs.Item key={breadcrumb}>{breadcrumb}</Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        ),
    };
}

export function getSettingsDescriptionWithAllResultsPage(
    settingsDescription: SettingsDescription,
): SettingsDescription {
    const {menu, pages} = settingsDescription;
    const menuWithoutAllResults = getMenuWithoutAllResults(menu);
    const pagesList = Object.values(pages);

    return {
        ...settingsDescription,
        menu: [createAllResultsMenuItem(), ...menuWithoutAllResults],
        pages: {
            ...pages,
            [allSearchResultsId]: createAllResultsPage(pagesList, menuWithoutAllResults),
        },
    };
}

function getMenuWithoutAllResults(menu: SettingsMenu) {
    return menu.filter((item) => !('id' in item) || item.id !== allSearchResultsId);
}

function createAllResultsPage(pages: SettingsPage[], menu: SettingsMenu): SettingsPage {
    const breadcrumbsMap: Record<string, string> = {};

    for (const menuItem of menu) {
        if ('items' in menuItem) {
            for (const pageItem of menuItem.items) {
                breadcrumbsMap[pageItem.id] = `${menuItem.groupTitle} / ${pageItem.title}`;
            }
        } else {
            breadcrumbsMap[menuItem.id] = menuItem.title;
        }
    }

    return {
        id: allSearchResultsId,
        sections: Object.values(pages)
            .map((page) => {
                return page.sections.map((section): SettingsPageSection => {
                    const breadcrumbs = breadcrumbsMap[page.id];

                    return {
                        ...section,
                        title: breadcrumbs ? `${breadcrumbs} / ${section.title}` : section.title,

                        // .map((setting) => {
                        //     // const breadcrumbs = breadcrumbsMap[page.id] ?? [];

                        //     return {...setting};
                        // })
                    };
                });
            })
            .flat(),
        hidden: false,
    };
}

function createAllResultsMenuItem(): SettingsMenuItem {
    return {
        id: allSearchResultsId,
        title: allSearchResultsLabel,
        icon: {data: ListUl},
    };
}
