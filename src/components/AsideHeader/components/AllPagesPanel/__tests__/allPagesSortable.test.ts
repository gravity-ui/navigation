import {ALL_PAGES_ID, type AsideHeaderItem} from '../../../types';
import {isAllPagesSortableItem, reorderAllPagesSortableItems} from '../allPagesSortable';

const item = (id: string, extra: Partial<AsideHeaderItem> = {}): AsideHeaderItem =>
    ({id, title: id, ...extra}) as AsideHeaderItem;

describe('isAllPagesSortableItem', () => {
    it('returns false for All pages entry', () => {
        expect(isAllPagesSortableItem(item(ALL_PAGES_ID))).toBe(false);
    });

    it('returns false when groupId is set', () => {
        expect(isAllPagesSortableItem(item('a', {groupId: 'g1'}))).toBe(false);
    });

    it('returns true for a regular top-level item', () => {
        expect(isAllPagesSortableItem(item('home'))).toBe(true);
    });
});

describe('reorderAllPagesSortableItems', () => {
    it('swaps two top-level rows while keeping grouped rows fixed', () => {
        const withoutAllPages: AsideHeaderItem[] = [
            item('home'),
            item('a1', {groupId: 'g'}),
            item('a2', {groupId: 'g'}),
            item('help'),
        ];
        const next = reorderAllPagesSortableItems(withoutAllPages, 0, 1);
        expect(next.map((i) => i.id)).toEqual(['help', 'a1', 'a2', 'home']);
    });
});
