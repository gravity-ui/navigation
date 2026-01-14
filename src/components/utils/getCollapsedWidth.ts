import {
    ASIDE_HEADER_COLLAPSED_WIDTH,
    ASIDE_HEADER_COLLAPSED_WIDTH_COMPACT_MODE,
} from '../constants';

export function getCollapsedWidth(isCompactMode?: boolean): number {
    return isCompactMode ? ASIDE_HEADER_COLLAPSED_WIDTH_COMPACT_MODE : ASIDE_HEADER_COLLAPSED_WIDTH;
}
