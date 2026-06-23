import React from 'react';

import {List, Popover, PopupProps} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import {AsideHeaderItem} from '../../../types';
import {getPopupItemHeight, getPopupItemsHeight, getSelectedItemIndex} from '../utils';

import {Item} from './Item';
import {ItemPopupNestContext} from './ItemPopupNestContext';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const POPUP_MAIN_AXIS_OFFSET = 14;
const POPUP_CROSS_AXIS_OFFSET_WITH_TITLE = -30;
const POPUP_CROSS_AXIS_OFFSET_WITHOUT_TITLE = 0;

const DEFAULT_POPUP_DELAY = 100;

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
}

export const ItemPopup: React.FC<Props> = ({
    items,
    itemClassName,
    title,
    open,
    disabled,
    type,
    collapsed = false,
    hideIcon = false,
    children,
    onPopupItemClick,
    onItemClick,
    onOpenChange,
}) => {
    const nestedOpenCountRef = React.useRef(0);

    const popoverOffset = React.useMemo<NonNullable<PopupProps['offset']>>(
        () => ({
            mainAxis: POPUP_MAIN_AXIS_OFFSET,
            crossAxis: title
                ? POPUP_CROSS_AXIS_OFFSET_WITH_TITLE
                : POPUP_CROSS_AXIS_OFFSET_WITHOUT_TITLE,
        }),
        [title],
    );

    const isSingleLabel = !title && items.length === 1;

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
            <div className={b('popup-content', {collapsed})} onClick={handlePopupContentClick}>
                {title && <div className={b('popup-title')}>{title}</div>}
                <List
                    items={popupItems}
                    selectedItemIndex={getSelectedItemIndex(popupItems)}
                    itemHeight={getPopupItemHeight}
                    itemsHeight={getPopupItemsHeight}
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
            className={b('icon-popover', {'item-type': type})}
            content={content}
        >
            {children}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
