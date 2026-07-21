import React from 'react';

import {List, Popover, PopupProps, RealTheme, getThemeType, useThemeValue} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import {useAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../../density';
import {AsideHeaderItem} from '../../../types';
import {getPopupItemHeight, getSelectedItemIndex} from '../utils';

import {Item} from './Item';
import {ItemPopupNestContext} from './ItemPopupNestContext';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const POPUP_PADDING = 2;
const POPUP_MAIN_AXIS_OFFSET = 14;
/** Compact solo label in collapsed sidebar: body line + vertical padding (spacing-1). */
const SOLO_LABEL_POPUP_ITEM_HEIGHT = 28;
const SOLO_LABEL_POPUP_BORDER_RADIUS = 4;

/** Keep in sync with `&__popup-title` in Item.module.scss (caption-2 row + padding + border + gap). */
const POPUP_TITLE_VERTICAL_PADDING = 4; // var(--g-spacing-1)
const POPUP_TITLE_LINE_HEIGHT = 16; // caption-2
const POPUP_TITLE_BORDER = 1;
const POPUP_TITLE_MARGIN_AFTER = 4; // var(--g-spacing-1)
const POPUP_TITLE_BLOCK_HEIGHT =
    POPUP_TITLE_VERTICAL_PADDING * 2 +
    POPUP_TITLE_LINE_HEIGHT +
    POPUP_TITLE_BORDER +
    POPUP_TITLE_MARGIN_AFTER;

const POPUP_OPEN_DELAY = 0;
const POPUP_CLOSE_DELAY = 0;

export function getOppositeTheme(theme: RealTheme): RealTheme {
    const oppositeThemeType = getThemeType(theme) === 'light' ? 'dark' : 'light';

    return theme.endsWith('-hc') ? `${oppositeThemeType}-hc` : oppositeThemeType;
}

export function getItemPopoverOffset({
    isSingleLabel,
    itemHeight,
    popupRowHeight,
    title,
}: {
    isSingleLabel: boolean;
    itemHeight: number;
    popupRowHeight: number;
    title?: string;
}): NonNullable<PopupProps['offset']> {
    if (isSingleLabel) {
        return {
            mainAxis: POPUP_MAIN_AXIS_OFFSET,
            crossAxis: 0,
        };
    }

    const firstRowOffsetInAnchor = (itemHeight - popupRowHeight) / 2;
    const crossAxis =
        firstRowOffsetInAnchor - POPUP_PADDING - (title ? POPUP_TITLE_BLOCK_HEIGHT : 0);

    return {
        mainAxis: POPUP_MAIN_AXIS_OFFSET,
        crossAxis,
    };
}

interface Props {
    items: AsideHeaderItem[];
    /** Optional title rendered at the top of the popup. */
    title?: string;
    open?: boolean;
    disabled?: boolean;
    type?: string;
    collapsed?: boolean;
    hideIcon?: boolean;
    itemClassName?: string;
    children: React.ReactElement;
    onOpenChange?: (open: boolean) => void;
    onPopupItemClick?: AsideHeaderItem['onItemClick'];
    onItemClick?: AsideHeaderItem['onItemClick'];
    enableQuickAccessPin?: boolean;
    onToggleQuickAccess?: (item: AsideHeaderItem) => void;
    invertTheme?: boolean;
}

export const ItemPopup: React.FC<Props> = ({
    items,
    itemClassName,
    title,
    open,
    disabled,
    type,
    collapsed = false,
    hideIcon = true,
    children,
    onPopupItemClick,
    onItemClick,
    onOpenChange,
    enableQuickAccessPin,
    onToggleQuickAccess,
    invertTheme = false,
}) => {
    const {menuDensity} = useAsideHeaderContext();
    const theme = useThemeValue();
    const {
        itemExpandedRadius,
        popupItemHeight: popupRowHeight,
        itemHeight,
    } = getAsideHeaderDensityConfig(menuDensity);
    const nestedOpenCountRef = React.useRef(0);

    const isSingleLabel = !title && items.length === 1;
    const oppositeTheme = invertTheme && isSingleLabel ? getOppositeTheme(theme) : undefined;

    const popoverStyle = React.useMemo(() => {
        if (isSingleLabel) {
            return {
                '--g-popup-border-radius': `${SOLO_LABEL_POPUP_BORDER_RADIUS}px`,
            } as React.CSSProperties;
        }

        const borderRadius = itemExpandedRadius + POPUP_PADDING;

        return {
            '--gn-aside-header-item-expanded-radius': `${itemExpandedRadius}px`,
            '--g-popup-border-radius': `${borderRadius}px`,
        } as React.CSSProperties;
    }, [isSingleLabel, itemExpandedRadius]);

    const popupItemHeight = React.useCallback(
        (item: AsideHeaderItem) =>
            isSingleLabel ? SOLO_LABEL_POPUP_ITEM_HEIGHT : getPopupItemHeight(item, menuDensity),
        [isSingleLabel, menuDensity],
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
                itemHeight,
                popupRowHeight,
                title,
            }),
        [isSingleLabel, title, popupRowHeight, itemHeight],
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
                    selectedItemIndex={getSelectedItemIndex(popupItems)}
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
                            className={b('popup-item')}
                            hideIcon={hideIcon}
                            stopClickPropagation={!item.itemWrapper}
                            enableTooltip={false}
                            bringForward={false}
                            popupVisible={false}
                            renderPopupContent={undefined}
                            onOpenChangePopup={undefined}
                            popupRef={undefined}
                            enableQuickAccessPin={enableQuickAccessPin}
                            onToggleQuickAccess={onToggleQuickAccess}
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
            openDelay={POPUP_OPEN_DELAY}
            closeDelay={POPUP_CLOSE_DELAY}
            offset={popoverOffset}
            enableSafePolygon
            // Popover forwards this to Popup; typings omit disableTransition.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- UIKit PopoverProps gap
            // @ts-expect-error
            disableTransition
            className={b(
                'icon-popover',
                {'item-type': type, 'single-label': isSingleLabel},
                oppositeTheme ? `g-root g-root_theme_${oppositeTheme}` : undefined,
            )}
            style={popoverStyle}
            content={content}
        >
            {children}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
