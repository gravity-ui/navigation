import React from 'react';

import {List, Popover, PopupProps, useThemeValue} from '@gravity-ui/uikit';

import {POPUP_REGULAR_ITEM_HEIGHT} from '../../../../constants';
import {createBlock} from '../../../../utils/cn';
import {useSafeAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig, getAsideHeaderDensityCssProperties} from '../../../density';
import {AsideHeaderItem} from '../../../types';
import {isItemPresentationCurrent} from '../presentationCurrent';
import {getPopupItemHeight} from '../utils';

import {Item} from './Item';
import type {QuickAccessToggleHandler} from './Item.types';
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
    enableQuickAccessPin?: boolean;
    onToggleQuickAccess?: QuickAccessToggleHandler;
    suppressCurrentItemIds?: ReadonlySet<string>;
}

type PopupTriggerInteractionProps = {
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    onBlur?: React.FocusEventHandler<HTMLElement>;
};

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
    enableQuickAccessPin,
    onToggleQuickAccess,
    suppressCurrentItemIds,
}) => {
    const asideHeaderContext = useSafeAsideHeaderContext();
    const theme = useThemeValue();
    const densityConfig = getAsideHeaderDensityConfig(asideHeaderContext?.menuDensity);
    const nestedOpenCountRef = React.useRef(0);
    // A nested portaled popup temporarily blocks the parent's hover-close. Remember that close
    // request and replay it after the child closes, unless the pointer/focus returned to the parent.
    const deferredCloseRef = React.useRef(false);
    const interactionInsideRef = React.useRef(false);
    const popupContentRef = React.useRef<HTMLDivElement>(null);
    const triggerElementRef = React.useRef<HTMLElement | null>(null);
    const onOpenChangeRef = React.useRef(onOpenChange);
    const densityCssProperties = getAsideHeaderDensityCssProperties(
        asideHeaderContext?.menuDensity,
    );

    const isSingleLabel = variant === 'label';
    const soloPopupTheme = theme.endsWith('-hc') ? 'dark-hc' : 'dark';

    React.useEffect(() => {
        onOpenChangeRef.current = onOpenChange;
    }, [onOpenChange]);

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

        if (
            nestedOpenCountRef.current === 0 &&
            deferredCloseRef.current &&
            !interactionInsideRef.current
        ) {
            deferredCloseRef.current = false;
            onOpenChangeRef.current?.(false);
        }
    }, []);

    const nestContextValue = React.useMemo(() => ({registerNestedOpen}), [registerNestedOpen]);

    const wrappedOnOpenChange = React.useCallback(
        (next: boolean) => {
            if (!next && nestedOpenCountRef.current > 0) {
                deferredCloseRef.current = true;
                return;
            }

            deferredCloseRef.current = false;
            onOpenChange?.(next);
        },
        [onOpenChange],
    );

    const markInteractionRegionEntered = React.useCallback(() => {
        interactionInsideRef.current = true;
        deferredCloseRef.current = false;
    }, []);

    const markInteractionRegionLeft = React.useCallback((relatedTarget: EventTarget | null) => {
        const nextTarget = relatedTarget instanceof Node ? relatedTarget : null;
        const remainsInside = Boolean(
            nextTarget &&
                (triggerElementRef.current?.contains(nextTarget) ||
                    popupContentRef.current?.contains(nextTarget)),
        );

        if (!remainsInside) {
            interactionInsideRef.current = false;
        }
    }, []);

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
    const sourceItemsById = React.useMemo(
        () => new Map(items.map((item) => [item.id, item])),
        [items],
    );
    const selectedPopupItemIndex = React.useMemo(() => {
        if (!highlightCurrentItem) {
            return undefined;
        }

        const index = popupItems.findIndex((item) =>
            isItemPresentationCurrent(item, {suppressCurrentItemIds}),
        );

        return index === -1 ? undefined : index;
    }, [highlightCurrentItem, popupItems, suppressCurrentItemIds]);

    if (!popupItems.length) {
        return children;
    }

    const content = (
        <ItemPopupNestContext.Provider value={nestContextValue}>
            <div
                ref={popupContentRef}
                className={b('popup-content', {collapsed, 'single-label': isSingleLabel})}
                onClick={handlePopupContentClick}
                onMouseEnter={markInteractionRegionEntered}
                onMouseLeave={(event) => markInteractionRegionLeft(event.relatedTarget)}
                onFocusCapture={markInteractionRegionEntered}
                onBlurCapture={(event) => markInteractionRegionLeft(event.relatedTarget)}
            >
                {title && <div className={b('popup-title')}>{title}</div>}
                <List
                    items={popupItems}
                    selectedItemIndex={selectedPopupItemIndex}
                    itemHeight={popupItemHeight}
                    itemsHeight={popupItemsHeight}
                    itemClassName={b('root-menu-item', itemClassName)}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    renderItem={(item) => {
                        const sourceItem = sourceItemsById.get(item.id) ?? item;

                        return (
                            <Item
                                {...item}
                                qa={undefined}
                                compact={false}
                                menuPopupRow
                                suppressCurrentHighlight={!highlightCurrentItem}
                                suppressCurrentItemIds={suppressCurrentItemIds}
                                className={b('popup-item')}
                                hideIcon={hideIcon}
                                menuPopupHideIcon={nestedPopupHideIcon}
                                stopClickPropagation={!sourceItem.itemWrapper}
                                enableTooltip={false}
                                bringForward={false}
                                popupVisible={false}
                                renderPopupContent={undefined}
                                onOpenChangePopup={undefined}
                                popupRef={undefined}
                                enableQuickAccessPin={!isSingleLabel && enableQuickAccessPin}
                                quickAccessPinItem={sourceItem}
                                onToggleQuickAccess={
                                    isSingleLabel ? undefined : onToggleQuickAccess
                                }
                                onItemClick={(_innerItem, _innerCollapsed, event) => {
                                    if (!sourceItem.current) {
                                        onOpenChange?.(false);
                                    }

                                    (onPopupItemClick ?? onItemClick)?.(
                                        sourceItem,
                                        collapsed,
                                        event,
                                    );
                                }}
                            />
                        );
                    }}
                />
            </div>
        </ItemPopupNestContext.Provider>
    );

    const triggerProps = children.props as PopupTriggerInteractionProps;
    const trigger = React.cloneElement(
        children as React.ReactElement<PopupTriggerInteractionProps>,
        {
            onMouseEnter: (event) => {
                triggerElementRef.current = event.currentTarget;
                markInteractionRegionEntered();
                triggerProps.onMouseEnter?.(event);
            },
            onMouseLeave: (event) => {
                markInteractionRegionLeft(event.relatedTarget);
                triggerProps.onMouseLeave?.(event);
            },
            onFocus: (event) => {
                triggerElementRef.current = event.currentTarget;
                markInteractionRegionEntered();
                triggerProps.onFocus?.(event);
            },
            onBlur: (event) => {
                markInteractionRegionLeft(event.relatedTarget);
                triggerProps.onBlur?.(event);
            },
        },
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
            {trigger}
        </Popover>
    );
};

ItemPopup.displayName = 'ItemPopup';
