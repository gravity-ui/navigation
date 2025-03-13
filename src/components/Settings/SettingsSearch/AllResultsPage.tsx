import React from 'react';

import {ListUl} from '@gravity-ui/icons';
import last from 'lodash/last';

import type {
    SettingsDescription,
    SettingsMenu,
    SettingsMenuItem,
    SettingsPage,
    SettingsPageSection,
} from '../collect-settings';
import i18n from '../i18n';

const allSearchResultsId = 'allSearchResults';
const allSearchResultsLabel = i18n('label_all-results');

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
    const breadcrumbsMap: Record<string, string[] | undefined> = {};

    for (const menuItem of menu) {
        if ('items' in menuItem) {
            for (const pageItem of menuItem.items) {
                breadcrumbsMap[pageItem.id] = [menuItem.groupTitle, pageItem.title];
            }
        } else {
            breadcrumbsMap[menuItem.id] = [menuItem.title];
        }
    }

    return {
        id: allSearchResultsId,
        sections: Object.values(pages)
            .map((page) => {
                return page.sections.map((section): SettingsPageSection => {
                    const breadcrumbs = breadcrumbsMap[page.id] ?? [];
                    const lastBreadcrumb = last(breadcrumbs);
                    const breadcrumbsTitlePart = breadcrumbs.join(' / ');

                    return {
                        ...section,
                        title:
                            section.title === lastBreadcrumb
                                ? breadcrumbsTitlePart
                                : `${breadcrumbsTitlePart} / ${section.title}`,
                    };
                });
            })
            .flat(),
    };
}

function createAllResultsMenuItem(): SettingsMenuItem {
    return {
        id: allSearchResultsId,
        title: allSearchResultsLabel,
        icon: {data: ListUl},
    };
}
