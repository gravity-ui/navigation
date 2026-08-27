import React from 'react';

import {List, Popover, PopupProps, useThemeValue} from '@gravity-ui/uikit';

import {POPUP_REGULAR_ITEM_HEIGHT} from '../../../../constants';
import {createBlock} from '../../../../utils/cn';
import {useSafeAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig, getAsideHeaderDensityCssProperties} from '../../../density';
import {AsideHeaderItem} from '../../../types';
import {getPopupItemHeight, getSelectedItemIndex} from '../utils';

import {Item} from './Item';
import {ItemPopupNestContext} from './ItemPopupNestContext';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const POPUP_PADDING = 4;
const POPUP_MAIN_AXIS_OFFSET = 14;
const SOLO_LABEL_POPUP_ITEM_HEIGHT = 28;
const SOLO_LABEL_POPUP_BORDER_RADIUS = 4;
const POPUP_TITLE_BLOCK_HEIGHT = 30;
const DEFAULT_POPUP_DELAY = 0;

export function getItemPopoverOffset({
    isSingleLabel,
    itemHeight,
    popupRowHeight,
    titleHeight = 0,
}: {
    isSingleLabel: boolean;
    itemHeight: number;
    popupRowHeight: number;
    titleHeight?: number;
}): NonNullable<PopupProps['offset']> {
    if (isSingleLabel) {
        return {mainAxis: POPUP_MAIN_AXIS_OFFSET, crossAxis: 0};
    }

    const firstRowOffsetInAnchor = (itemHeight - popupRowHeight) / 2;

    return {
        mainAxis: POPUP_MAIN_AXIS_OFFSET,
        crossAxis: firstRowOffsetInAnchor - POPUP_PADDING - titleHeight,
    };
}

interface Props {
    items: AsideHeaderItem[];
    /** `label` is the minimal popup used by one compact leaf item. */
    variant?: 'menu' | 'label';
    /** Optional title rendered at the top of the popup. */
    title?: string;
    open?: boolean;
    disabled?: boolean;
    type?: string;
    collapsed?: boolean;
    hideIcon?: boolean;
    /** Icon visibility for a child popup opened from a row in this popup. */
    nestedPopupHideIcon?: boolean;
    itemClassName?: string;
    children: React.ReactElement;
    onOpenChange?: (open: boolean) => void;
    onPopupItemClick?: AsideHeaderItem['onItemClick'];
    onItemClick?: AsideHeaderItem['onItemClick'];
    /** Controls selected styling without altering the source items passed to callbacks. */
    highlightCurrentItem?: boolean;
}

export const ItemPopup: React.FC<Props> = ({
    items,
    variant = 'menu',
    itemClassName,
    title,
    open,
    disabled,
    type,
    collapsed = false,
    hideIcon = false,
    nestedPopupHideIcon,
    children,
    onPopupItemClick,
    onItemClick,
    onOpenChange,
    highlightCurrentItem = true,
}) => {
    const asideHeaderContext = useSafeAsideHeaderContext();
    const theme = useThemeValue();
    const densityConfig = getAsideHeaderDensityConfig(asideHeaderContext?.menuDensity);
    const nestedOpenCountRef = React.useRef(0);
    const densityCssProperties = getAsideHeaderDensityCssProperties(
        asideHeaderContext?.menuDensity,
    );

    const isSingleLabel = variant === 'label';
    const soloPopupTheme = theme.endsWith('-hc') ? 'dark-hc' : 'dark';

    const popoverStyle = React.useMemo(() => {
        const popupPadding = isSingleLabel ? 0 : POPUP_PADDING;
        const popupBorderRadius = isSingleLabel
            ? SOLO_LABEL_POPUP_BORDER_RADIUS
            : densityConfig.itemExpandedRadius + popupPadding;

        return {
            ...densityCssProperties,
            '--_--popup-padding': `${popupPadding}px`,
            '--_--popup-border-radius': `${popupBorderRadius}px`,
            '--_--popup-title-height': `${POPUP_TITLE_BLOCK_HEIGHT}px`,
            '--g-popup-border-radius': `${popupBorderRadius}px`,
        } as React.CSSProperties;
    }, [densityConfig.itemExpandedRadius, densityCssProperties, isSingleLabel]);

    const popupItemHeight = React.useCallback(
        (item: AsideHeaderItem) =>
            isSingleLabel ? SOLO_LABEL_POPUP_ITEM_HEIGHT : getPopupItemHeight(item),
        [isSingleLabel],
    );

    const popupItemsHeight = React.useCallback(
        (listItems: AsideHeaderItem[]) =>
            listItems.reduce((sum, item) => sum + popupItemHeight(item), 0),
        [popupItemHeight],
    );

    const popoverOffset = React.useMemo<NonNullable<PopupProps['offset']>>(
        () =>
            getItemPopoverOffset({
                isSingleLabel,
                itemHeight: densityConfig.itemHeight,
                popupRowHeight: POPUP_REGULAR_ITEM_HEIGHT,
                titleHeight: title ? POPUP_TITLE_BLOCK_HEIGHT : 0,
            }),
        [densityConfig.itemHeight, isSingleLabel, title],
    );

    const registerNestedOpen = React.useCallback((delta: number) => {
        nestedOpenCountRef.current = Math.max(0, nestedOpenCountRef.current + delta);
    }, []);

    const nestContextValue = React.useMemo(() => ({registerNestedOpen}), [registerNestedOpen]);

    const wrappedOnOpenChange = React.useCallback(
        (next: boolean) => {
            if (!next && nestedOpenCountRef.current > 0) {
                return;
            }

            onOpenChange?.(next);
        },
        [onOpenChange],
    );

    const handlePopupContentClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    // Inside a popup list, action items must look like regular menu rows, not floating
    // action buttons (e.g. when an `action` item overflows into the "More" popup).
    const popupItems = React.useMemo(
        () =>
            items.map((item) =>
                item.type === 'action' ? {...item, type: 'regular' as const} : item,
            ),
        [items],
    );

    if (!popupItems.length) {
        return children;
    }

    const content = (
        <ItemPopupNestContext.Provider value={nestContextValue}>
            <div
                className={b('popup-content', {collapsed, 'single-label': isSingleLabel})}
                onClick={handlePopupContentClick}
            >
                {title && <div className={b('popup-title')}>{title}</div>}
                <List
                    items={popupItems}
                    selectedItemIndex={
                        highlightCurrentItem ? getSelectedItemIndex(popupItems) : undefined
                    }
                    itemHeight={popupItemHeight}
                    itemsHeight={popupItemsHeight}
                    itemClassName={b('root-menu-item', itemClassName)}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    renderItem={(item) => (
                        <Item
                            {...item}
                            qa={undefined}
                            compact={false}
                            menuPopupRow
                            suppressCurrentHighlight={!highlightCurrentItem}
                            className={b('popup-item')}
                            hideIcon={hideIcon}
                            menuPopupHideIcon={nestedPopupHideIcon}
                            stopClickPropagation={!item.itemWrapper}
                            enableTooltip={false}
                            bringForward={false}
                            popupVisible={false}
                            renderPopupContent={undefined}
                            onOpenChangePopup={undefined}
                            popupRef={undefined}
                            onItemClick={(_innerItem, _innerCollapsed, event) => {
                                if (!item.current) {
                                    onOpenChange?.(false);
                                }

                                (onPopupItemClick ?? onItemClick)?.(item, collapsed, event);
                            }}
                        />
                    )}
                />
            </div>
        </ItemPopupNestContext.Provider>
    );

    return (
        <Popover
            disabled={disabled}
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen && disabled) return;
                wrappedOnOpenChange(nextOpen);
            }}
            placement={isSingleLabel ? 'right' : 'right-start'}
            strategy="fixed"
            openDelay={DEFAULT_POPUP_DELAY}
            closeDelay={DEFAULT_POPUP_DELAY}
            offset={popoverOffset}
            enableSafePolygon
            className={b(
                'icon-popover',
                {'item-type': type, 'single-label': isSingleLabel},
                isSingleLabel ? `g-root g-root_theme_${soloPopupTheme}` : undefined,
            )}
            style={popoverStyle}
            content={content}
        >
            {children}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
