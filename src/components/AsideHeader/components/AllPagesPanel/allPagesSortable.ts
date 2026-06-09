import {ALL_PAGES_ID, AsideHeaderItem} from '../../types';

export function isAllPagesSortableItem(item: AsideHeaderItem): boolean {
    return (
        item.id !== ALL_PAGES_ID &&
        !item.afterMoreButton &&
        item.type !== 'divider' &&
        !item.groupId
    );
}

/**
 * Reorders only {@link isAllPagesSortableItem} entries; every other row stays in place.
 * Indices refer to the contiguous sortable subset (same order as in the drag-and-drop list).
 */
export function reorderAllPagesSortableItems(
    withoutAllPagesItem: AsideHeaderItem[],
    oldIndex: number,
    newIndex: number,
): AsideHeaderItem[] {
    const sortable = withoutAllPagesItem.filter(isAllPagesSortableItem);
    const reordered = [...sortable];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    let i = 0;
    return withoutAllPagesItem.map((item) =>
        isAllPagesSortableItem(item) ? reordered[i++]! : item,
    );
}
