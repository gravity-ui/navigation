import React from 'react';

import {List, Popover, PopupProps} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import {useAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../../density';
import {AsideHeaderItem} from '../../../types';
import {getPopupItemHeight, getPopupItemsHeight, getSelectedItemIndex} from '../utils';

import {Item} from './Item';
import {ItemPopupNestContext} from './ItemPopupNestContext';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const POPUP_PADDING = 2;
const POPUP_MAIN_AXIS_OFFSET = 14;

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
}) => {
    const {menuDensity} = useAsideHeaderContext();
    const {
        itemExpandedRadius,
        popupItemHeight: popupRowHeight,
        itemHeight,
    } = getAsideHeaderDensityConfig(menuDensity);
    const nestedOpenCountRef = React.useRef(0);

    const popoverStyle = React.useMemo(
        () =>
            ({
                '--gn-aside-header-item-expanded-radius': `${itemExpandedRadius}px`,
            }) as React.CSSProperties,
        [itemExpandedRadius],
    );

    const popupItemHeight = React.useCallback(
        (item: AsideHeaderItem) => getPopupItemHeight(item, menuDensity),
        [menuDensity],
    );

    const popupItemsHeight = React.useCallback(
        (listItems: AsideHeaderItem[]) => getPopupItemsHeight(listItems, menuDensity),
        [menuDensity],
    );

    const popoverOffset = React.useMemo<NonNullable<PopupProps['offset']>>(() => {
        // Shift popup so the first menu row lines up with the anchor row, not the popover box top.
        const firstRowOffsetInAnchor = (itemHeight - popupRowHeight) / 2;
        const crossAxis =
            firstRowOffsetInAnchor - POPUP_PADDING - (title ? POPUP_TITLE_BLOCK_HEIGHT : 0);

        return {
            mainAxis: POPUP_MAIN_AXIS_OFFSET,
            crossAxis,
        };
    }, [title, popupRowHeight, itemHeight]);

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

    if (!items.length) {
        return children;
    }

    const content = (
        <ItemPopupNestContext.Provider value={nestContextValue}>
            <div className={b('popup-content', {collapsed})} onClick={handlePopupContentClick}>
                {title && <div className={b('popup-title')}>{title}</div>}
                <List
                    items={items}
                    selectedItemIndex={getSelectedItemIndex(items)}
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
            placement="right-start"
            strategy="fixed"
            openDelay={POPUP_OPEN_DELAY}
            closeDelay={POPUP_CLOSE_DELAY}
            offset={popoverOffset}
            enableSafePolygon
            // Popover forwards this to Popup; typings omit disableTransition.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- UIKit PopoverProps gap
            // @ts-expect-error
            disableTransition
            className={b('icon-popover', {'item-type': type})}
            style={popoverStyle}
            content={content}
        >
            {children}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
