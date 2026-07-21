export type AsideHeaderMenuDensity = 'default' | 'compact';

interface AsideHeaderDensityConfig {
    itemHeight: number;
    twoLineItemHeight: number;
    popupItemHeight: number;
    twoLinePopupItemHeight: number;
    iconSize: number;
    itemMarginInline: number;
    iconBackgroundSize: number;
    compactWidth: number;
    expandedWidth: number;
    footerItemHeight: number;
    itemExpandedRadius: number;
}

export const ASIDE_HEADER_DENSITY_CONFIG: Record<AsideHeaderMenuDensity, AsideHeaderDensityConfig> =
    {
        default: {
            itemHeight: 40,
            twoLineItemHeight: 56,
            popupItemHeight: 32,
            twoLinePopupItemHeight: 48,
            iconSize: 18,
            itemMarginInline: 8,
            iconBackgroundSize: 38,
            compactWidth: 56,
            expandedWidth: 236,
            footerItemHeight: 32,
            itemExpandedRadius: 8,
        },
        compact: {
            itemHeight: 32,
            twoLineItemHeight: 48,
            popupItemHeight: 32,
            twoLinePopupItemHeight: 44,
            iconSize: 16,
            itemMarginInline: 6,
            iconBackgroundSize: 32,
            compactWidth: 44,
            expandedWidth: 220,
            footerItemHeight: 32,
            itemExpandedRadius: 6,
        },
    };

export function getAsideHeaderDensityConfig(
    density: AsideHeaderMenuDensity = 'default',
): AsideHeaderDensityConfig {
    return ASIDE_HEADER_DENSITY_CONFIG[density];
}
