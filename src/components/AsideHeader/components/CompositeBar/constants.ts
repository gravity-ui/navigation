export const ITEM_TYPE_REGULAR = 'regular';
export const COLLAPSE_ITEM_ID = 'collapse-item-id';
export const COMPOSITE_BAR_ITEM_ID_ATTRIBUTE = 'data-gn-composite-bar-item-id';

/** Prefix for synthetic CompositeBar row ids for grouped section headers ({@link makeGroupHeaderAsideItem}). */
export const COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX = '__gn-composite-bar__group-header__' as const;
export const COMPOSITE_BAR_GROUP_OVERFLOW_ID_PREFIX =
    '__gn-composite-bar__group-overflow__' as const;

export const getGroupHeaderItemId = (groupId: string) =>
    `${COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX}${groupId}`;

export const getGroupOverflowItemId = (groupId: string) =>
    `${COMPOSITE_BAR_GROUP_OVERFLOW_ID_PREFIX}${groupId}`;

/** Inverse of {@link getGroupHeaderItemId}; `undefined` for non-header ids. */
export const parseGroupHeaderItemId = (itemId: string): string | undefined =>
    itemId.startsWith(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX)
        ? itemId.slice(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX.length)
        : undefined;
