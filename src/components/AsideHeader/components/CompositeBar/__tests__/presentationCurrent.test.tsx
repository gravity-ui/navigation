/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {render, screen} from '@testing-library/react';

import type {AsideHeaderItem} from '../../../types';
import {Item} from '../Item/Item';
import {COLLAPSE_ITEM_ID} from '../constants';
import {getItemPresentationCurrentIds, isItemPresentationCurrent} from '../presentationCurrent';

jest.mock('../../../i18n');

describe('presentation current metadata', () => {
    it('renders semantic current ids on a selected leaf and a collapsed representative', () => {
        render(
            <ThemeProvider theme="light">
                <Item id="selected" title="Selected" icon={Gear} current />
                <Item
                    id={COLLAPSE_ITEM_ID}
                    title="More"
                    icon={Gear}
                    menuPopupItems={[
                        {id: 'later', title: 'Later', icon: Gear, current: true},
                        {id: 'earlier', title: 'Earlier', icon: Gear, current: true},
                    ]}
                />
            </ThemeProvider>,
        );

        const selected = screen.getByRole('button', {name: 'Selected'});
        const more = screen.getByRole('button', {name: 'More'});

        expect(selected.getAttribute('data-gn-aside-current-ids')).toBe('["selected"]');
        expect(selected.className).toContain('current');
        expect(more.getAttribute('data-gn-aside-current-ids')).toBe('["earlier","later"]');
        expect(more.className).toContain('current');
    });

    it('omits popup metadata while only suppressed rows lose selected styling', () => {
        render(
            <ThemeProvider theme="light">
                <Item id="popup" title="Popup" icon={Gear} current menuPopupRow />
                <Item
                    id="suppressed"
                    title="Suppressed"
                    icon={Gear}
                    current
                    suppressCurrentHighlight
                />
            </ThemeProvider>,
        );

        const popup = screen.getByRole('button', {name: 'Popup'});
        const suppressed = screen.getByRole('button', {name: 'Suppressed'});

        expect(popup.getAttribute('data-gn-aside-current-ids')).toBeNull();
        expect(popup.className).toContain('current');
        expect(suppressed.getAttribute('data-gn-aside-current-ids')).toBeNull();
        expect(suppressed.className).not.toContain('current');
    });
});

describe('getItemPresentationCurrentIds', () => {
    it('returns no ids when neither the item nor its descendants are current', () => {
        const item: AsideHeaderItem = {
            id: 'parent',
            title: 'Parent',
            compositeBarMenuPopupItems: [{id: 'child', title: 'Child'}],
        };

        expect(getItemPresentationCurrentIds(item)).toEqual([]);
        expect(isItemPresentationCurrent(item)).toBe(false);
    });

    it('returns the unsuppressed current item id', () => {
        const item: AsideHeaderItem = {id: 'self', title: 'Self', current: true};

        expect(getItemPresentationCurrentIds(item)).toEqual(['self']);
        expect(isItemPresentationCurrent(item)).toBe(true);
    });

    it('recursively resolves actual current descendants through group and More representatives', () => {
        const item: AsideHeaderItem = {
            id: 'more',
            title: 'More',
            compositeBarMenuPopupItems: [
                {
                    id: 'group',
                    title: 'Group',
                    compositeBarMenuPopupItems: [
                        {id: 'deep-current', title: 'Deep current', current: true},
                        {id: 'deep-idle', title: 'Deep idle'},
                    ],
                },
                {id: 'direct-current', title: 'Direct current', current: true},
            ],
        };

        expect(getItemPresentationCurrentIds(item)).toEqual(['deep-current', 'direct-current']);
    });

    it('omits a suppressed current self while retaining an unsuppressed current descendant', () => {
        const item: AsideHeaderItem = {
            id: 'parent',
            title: 'Parent',
            current: true,
            compositeBarMenuPopupItems: [
                {id: 'child', title: 'Child', current: true},
                {id: 'suppressed-child', title: 'Suppressed child', current: true},
            ],
        };
        const suppressCurrentItemIds = new Set(['parent', 'suppressed-child']);

        expect(getItemPresentationCurrentIds(item, {suppressCurrentItemIds})).toEqual(['child']);
        expect(isItemPresentationCurrent(item, {suppressCurrentItemIds})).toBe(true);
    });

    it('honors explicitly supplied empty popup items instead of falling back to item children', () => {
        const item: AsideHeaderItem = {
            id: 'parent',
            title: 'Parent',
            compositeBarMenuPopupItems: [{id: 'child', title: 'Child', current: true}],
        };

        expect(getItemPresentationCurrentIds(item)).toEqual(['child']);
        expect(getItemPresentationCurrentIds(item, {popupItems: []})).toEqual([]);
        expect(isItemPresentationCurrent(item, {popupItems: []})).toBe(false);
    });

    it('sorts and deduplicates multiple active ids without mutating the item tree', () => {
        const item: AsideHeaderItem = {
            id: 'z-current',
            title: 'Root',
            current: true,
            compositeBarMenuPopupItems: [
                {id: 'b-current', title: 'B', current: true},
                {
                    id: 'group',
                    title: 'Group',
                    compositeBarMenuPopupItems: [
                        {id: 'b-current', title: 'B duplicate', current: true},
                        {id: 'a-current', title: 'A', current: true},
                    ],
                },
            ],
        };
        const originalOrder = item.compositeBarMenuPopupItems?.map(({id}) => id);

        expect(getItemPresentationCurrentIds(item)).toEqual([
            'a-current',
            'b-current',
            'z-current',
        ]);
        expect(item.compositeBarMenuPopupItems?.map(({id}) => id)).toEqual(originalOrder);
    });
});
