import React from 'react';
import {IconProps} from '@gravity-ui/uikit';
import {escapeStringForRegExp, invariant} from './helpers';

export type SettingsMenu = (SettingsMenuGroup | SettingsMenuItem)[];

interface SettingsMenuGroup {
    groupTitle: string;
    items: SettingsMenuItem[];
}

interface SettingsMenuItem {
    id: string;
    title: string;
    icon?: IconProps;
    withBadge?: boolean;
    disabled?: boolean;
}

export interface SettingsPage {
    id: string;
    sections: SettingsPageSection[];
    hidden?: boolean;
    withBadge?: boolean;
}

interface SettingsPageSection {
    title: string;
    header?: React.ReactNode;
    items: SettingsItem[];
    hidden?: boolean;
    withBadge?: boolean;
    showTitle?: boolean;
}

interface SettingsItem {
    title: string;
    element: React.ReactElement;
    hidden: boolean;
    titleComponent?: React.ReactNode;
    renderTitleComponent?: (highlightedTitle: React.ReactNode | null) => React.ReactNode;
}

interface SettingsDescription {
    menu: SettingsMenu;
    pages: Record<string, SettingsPage>;
}
export function getSettingsFromChildren(
    children: React.ReactNode,
    searchText = '',
): SettingsDescription {
    // 'abc def fg' -> abc.*?cde.*?fg
    const preparedFilter = escapeStringForRegExp(searchText).replace(/\s+/g, '.*?');
    const filterRe = new RegExp(preparedFilter, 'i');

    return getSettingsFromChildrenRecursive(children, '', filterRe);
}

function getSettingsFromChildrenRecursive(
    children: React.ReactNode,
    basepath = '',
    filterRe: RegExp,
): SettingsDescription {
    const menu: SettingsMenu = [];
    const pages: Record<string, SettingsPage> = {};
    let hasGroup = false;
    let hasItems = false;
    React.Children.forEach(children, (element) => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            const {menu: menuFragment, pages: pagesFragment} = getSettingsFromChildrenRecursive(
                element.props.children,
                basepath,
                filterRe,
            );
            menu.push(...menuFragment);
            Object.assign(pages, pagesFragment);
        } else if (element.props.groupTitle) {
            if (process.env.NODE_ENV === 'development') {
                invariant(!hasItems, 'Setting menu must not mix groups and pages on one level');
            }

            const pageId = `${basepath}/${element.props.id ?? element.props.groupTitle}`;
            hasGroup = true;

            const {menu: menuFragment, pages: pagesFragment} = getSettingsFromChildrenRecursive(
                element.props.children,
                pageId,
                filterRe,
            );

            if (process.env.NODE_ENV === 'development') {
                const hasInnerGroup = menuFragment.some((item) => 'groupTitle' in item);
                invariant(
                    !hasInnerGroup,
                    `Group ${element.props.groupTitle} should not include groups`,
                );
            }

            menu.push({
                groupTitle: element.props.groupTitle,
                // @ts-ignore
                items: menuFragment,
            });
            Object.assign(pages, pagesFragment);
        } else {
            hasItems = true;
            const pageId = `${basepath}/${element.props.id ?? element.props.title}`;

            if (process.env.NODE_ENV === 'development') {
                invariant(Boolean(element.props.title), 'Component must include title prop');
                invariant(!hasGroup, 'Setting menu must not mix groups and pages on one level');
                invariant(!pages[pageId], `Setting menu page id must be uniq (${pageId})`);
            }

            pages[pageId] = getSettingsPageFromChildren(element.props.children, filterRe);
            pages[pageId].id = pageId;
            menu.push({
                id: pageId,
                title: element.props.title,
                icon: element.props.icon,
                withBadge: pages[pageId].withBadge,
                disabled: pages[pageId].hidden,
            });
        }
    });
    return {menu, pages};
}

function getSettingsPageFromChildren(children: React.ReactNode, filterRe: RegExp): SettingsPage {
    const page: SettingsPage = {id: '', sections: [], hidden: true};
    React.Children.forEach(children, (element) => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            const {sections, withBadge, hidden} = getSettingsPageFromChildren(
                element.props.children,
                filterRe,
            );
            page.sections.push(...sections);
            page.withBadge = withBadge || page.withBadge;
            page.hidden = hidden && page.hidden;
        } else {
            const {title, header, withBadge, showTitle = true} = element.props;
            const {items, hidden} = getSettingsItemsFromChildren(element.props.children, filterRe);
            page.withBadge = withBadge || page.withBadge;
            page.hidden = hidden && page.hidden;
            page.sections.push({
                title,
                header,
                withBadge,
                items,
                hidden,
                showTitle,
            });
        }
    });
    return page;
}

function getSettingsItemsFromChildren(children: React.ReactNode, filterRe: RegExp) {
    let hidden = true;
    const items: SettingsItem[] = [];
    React.Children.forEach(children, (element) => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements.
            return;
        }
        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            const fragmentItems = getSettingsItemsFromChildren(element.props.children, filterRe);
            items.push(...fragmentItems.items);
            hidden = hidden && fragmentItems.hidden;
        } else {
            const item: SettingsItem = {
                title: element.props.title,
                renderTitleComponent: element.props.renderTitleComponent,
                element,
                hidden: !filterRe.test(element.props.title),
            };
            items.push(item);
            hidden = hidden && item.hidden;
        }
    });
    return {items, hidden};
}
