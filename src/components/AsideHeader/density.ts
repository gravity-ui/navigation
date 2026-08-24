import type {CSSProperties} from 'react';

import {
    ASIDE_HEADER_COMPACT_WIDTH,
    ASIDE_HEADER_EXPANDED_WIDTH,
    ASIDE_HEADER_ICON_SIZE,
    ITEM_HEIGHT,
} from '../constants';

export type AsideHeaderMenuDensity = 'default' | 'compact';

interface AsideHeaderDensityConfig {
    itemHeight: number;
    actionSize: number;
    actionItemHeight: number;
    iconSize: number;
    itemMarginInline: number;
    iconBackgroundSize: number;
    compactWidth: number;
    expandedWidth: number;
    footerItemHeight: number;
    itemExpandedRadius: number;
    itemCollapsedRadius: number;
    itemTitleGap: number;
    itemTitleGapEnd: number;
}

const ASIDE_HEADER_DENSITY_CONFIG: Record<AsideHeaderMenuDensity, AsideHeaderDensityConfig> = {
    default: {
        itemHeight: ITEM_HEIGHT,
        actionSize: 36,
        actionItemHeight: 50,
        iconSize: ASIDE_HEADER_ICON_SIZE,
        itemMarginInline: 8,
        iconBackgroundSize: 38,
        compactWidth: ASIDE_HEADER_COMPACT_WIDTH,
        expandedWidth: ASIDE_HEADER_EXPANDED_WIDTH,
        footerItemHeight: 32,
        itemExpandedRadius: 8,
        itemCollapsedRadius: 7,
        itemTitleGap: 8,
        itemTitleGapEnd: 16,
    },
    compact: {
        itemHeight: 32,
        actionSize: 32,
        actionItemHeight: 46,
        iconSize: 16,
        itemMarginInline: 6,
        iconBackgroundSize: 32,
        compactWidth: 44,
        expandedWidth: 220,
        footerItemHeight: 32,
        itemExpandedRadius: 6,
        itemCollapsedRadius: 6,
        itemTitleGap: 4,
        itemTitleGapEnd: 8,
    },
};

export function getAsideHeaderDensityConfig(
    density: AsideHeaderMenuDensity = 'default',
): AsideHeaderDensityConfig {
    return ASIDE_HEADER_DENSITY_CONFIG[density];
}

export function getAsideHeaderDensityCssProperties(
    density: AsideHeaderMenuDensity = 'default',
): CSSProperties {
    const config = getAsideHeaderDensityConfig(density);

    return {
        '--_--gn-aside-header-density-item-height': `${config.itemHeight}px`,
        '--_--gn-aside-header-density-action-size': `${config.actionSize}px`,
        '--_--gn-aside-header-density-footer-item-height': `${config.footerItemHeight}px`,
        '--_--gn-aside-header-density-item-margin-inline': `${config.itemMarginInline}px`,
        '--_--gn-aside-header-density-icon-background-size': `${config.iconBackgroundSize}px`,
        '--_--gn-aside-header-density-compact-width': `${config.compactWidth}px`,
        '--_--gn-aside-header-density-item-expanded-radius': `${config.itemExpandedRadius}px`,
        '--_--gn-aside-header-density-item-collapsed-radius': `${config.itemCollapsedRadius}px`,
        '--_--gn-aside-header-density-item-title-gap': `${config.itemTitleGap}px`,
        '--_--gn-aside-header-density-item-title-gap-end': `${config.itemTitleGapEnd}px`,
    } as CSSProperties;
}
