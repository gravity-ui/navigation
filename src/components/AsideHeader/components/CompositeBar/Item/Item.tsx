import React from 'react';

import {ChevronDown, ChevronRight} from '@gravity-ui/icons';
import {Icon, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {useSafeAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../../density';
import {isQuickAccessPinEligible} from '../../../quickAccess';
import {AsideHeaderItem} from '../../../types';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {COLLAPSE_ITEM_ID, COMPOSITE_BAR_ITEM_ID_ATTRIBUTE, ITEM_TYPE_REGULAR} from '../constants';
import {isItemPresentationCurrent} from '../presentationCurrent';

import {ItemInnerProps, ItemProps, QuickAccessToggleHandler} from './Item.types';
import {ItemPopup} from './ItemPopup';
import {ItemPopupNestContext} from './ItemPopupNestContext';
import {ItemQuickAccessPin} from './ItemQuickAccessPin';
import {renderItemTitle} from './renderItemTitle';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};
const CHEVRON_SIZE = 16;

function shouldShowMenuPopup({
    type,
    popupItems,
    collapsedItem,
    inlineGroupHeader,
    groupHeaderExpanded,
}: {
    type: string;
    popupItems?: ItemInnerProps['menuPopupItems'];
    collapsedItem: boolean;
    inlineGroupHeader: boolean;
    groupHeaderExpanded?: boolean;
}) {
    return (
        type !== 'divider' &&
        Boolean(popupItems?.length) &&
        (collapsedItem || !inlineGroupHeader || !groupHeaderExpanded)
    );
}

function shouldShowChevron({
    compact,
    inlineGroupHeader,
    hasPopupItems,
}: {
    compact?: boolean;
    inlineGroupHeader: boolean;
    hasPopupItems: boolean;
}) {
    if (inlineGroupHeader) {
        return !compact;
    }

    return !compact && hasPopupItems;
}

function getExpandedTitleLines({
    type,
    compact,
    menuPopupRow,
    titleLines,
}: {
    type: string;
    compact?: boolean;
    menuPopupRow?: boolean;
    titleLines?: ItemInnerProps['titleLines'];
}) {
    if (type !== ITEM_TYPE_REGULAR || compact || menuPopupRow) {
        return 1;
    }

    return titleLines;
}

function shouldShowQuickAccessPin({
    enabled,
    compact,
    popupItems,
    item,
    onToggle,
}: {
    enabled?: boolean;
    compact?: boolean;
    popupItems?: AsideHeaderItem[];
    item: AsideHeaderItem;
    onToggle?: QuickAccessToggleHandler;
}) {
    return (
        Boolean(enabled) &&
        !compact &&
        !popupItems?.length &&
        isQuickAccessPinEligible(item) &&
        typeof onToggle === 'function'
    );
}

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        className,
        popupItemClassName,
        menuPopupItems,
        menuPopupTitle,
        groupHeaderExpanded,
        compact,
        onMouseLeave,
        onMouseEnter,
        enableTooltip = true,
        popupVisible = false,
        popupRef: anchoreRefProp,
        popupPlacement = defaultPopupPlacement,
        popupOffset = defaultPopupOffset,
        popupKeepMounted,
        renderPopupContent,
        onOpenChangePopup,
        onItemClick,
        onPopupItemClick,
        onItemClickCapture,
        itemWrapper,
        bringForward,
        rightAdornment,
        title,
        href,
        qa,
        hideIcon = false,
        menuPopupHideIcon,
        menuPopupNestedHideIcon,
        stopClickPropagation = false,
        menuGroupNestedTreeConnector,
        menuGroupNested,
        menuItemAriaProps,
        menuPopupRow,
        suppressCurrentHighlight = false,
        suppressCurrentItemIds,
        enableQuickAccessPin,
        quickAccessPinItem: quickAccessPinItemProp,
        onToggleQuickAccess,
    } = props;

    const [compactNavPopoverOpen, setCompactNavPopoverOpen] = React.useState(false);

    const ref = React.useRef<HTMLElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);
    const interactiveRowRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const icon = props.icon;
    const asideHeaderContext = useSafeAsideHeaderContext();
    const defaultIconSize = getAsideHeaderDensityConfig(asideHeaderContext?.menuDensity).iconSize;
    const iconSize = props.iconSize || defaultIconSize;
    const iconQa = props.iconQa;
    const collapsedItem = props.id === COLLAPSE_ITEM_ID;
    const inlineGroupHeader = groupHeaderExpanded !== undefined;
    const resolvedMenuPopupItems = menuPopupItems ?? props.compositeBarMenuPopupItems;
    const resolvedMenuPopupTitle = menuPopupTitle ?? props.compositeBarMenuPopupTitle;

    const current =
        !suppressCurrentHighlight &&
        isItemPresentationCurrent(props, {
            suppressCurrentItemIds,
            popupItems: resolvedMenuPopupItems,
        });
    const quickAccessPinItem = quickAccessPinItemProp ?? props;
    const showQuickAccessPin = shouldShowQuickAccessPin({
        enabled: enableQuickAccessPin,
        compact,
        popupItems: resolvedMenuPopupItems,
        item: quickAccessPinItem,
        onToggle: onToggleQuickAccess,
    });
    const [quickAccessPinSuppressed, setQuickAccessPinSuppressed] = React.useState(false);

    const handleToggleQuickAccess = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            onToggleQuickAccess?.(quickAccessPinItem, event);

            // Pointer clicks should not leave the control under the cursor after the row moves.
            // Keep keyboard-triggered controls visible and focused.
            if (event.detail > 0) {
                setQuickAccessPinSuppressed(true);
                event.currentTarget.blur();
            }
        },
        [onToggleQuickAccess, quickAccessPinItem],
    );

    const handleOpenChangePopup = React.useCallback<NonNullable<ItemProps['onOpenChangePopup']>>(
        (newOpen, event, reason) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }

            if (newOpen) {
                setCompactNavPopoverOpen(false);
            }

            onOpenChangePopup?.(newOpen, event, reason);
        },
        [onOpenChangePopup],
    );

    const isDivider = type === 'divider';
    const showMenuPopup = shouldShowMenuPopup({
        type,
        popupItems: resolvedMenuPopupItems,
        collapsedItem,
        inlineGroupHeader,
        groupHeaderExpanded,
    });

    const submenuNest = React.useContext(ItemPopupNestContext);

    React.useEffect(() => {
        if (!submenuNest || !showMenuPopup || !compactNavPopoverOpen) {
            return undefined;
        }

        submenuNest.registerNestedOpen(1);

        return () => {
            submenuNest.registerNestedOpen(-1);
        };
    }, [submenuNest, showMenuPopup, compactNavPopoverOpen]);

    if (isDivider) {
        return <div className={b('menu-divider')} />;
    }

    const compactPopoverDisabled = !enableTooltip || popupVisible || type === 'action';
    const expandedTitleLines = getExpandedTitleLines({
        type,
        compact,
        menuPopupRow,
        titleLines: props.titleLines,
    });

    const makeIconNode = (iconEl: React.ReactNode, withCompactPopover = true): React.ReactNode => {
        if (!compact) {
            return iconEl;
        }

        const iconButton = (
            <div
                onMouseEnter={() => onMouseEnter?.()}
                onMouseLeave={() => onMouseLeave?.()}
                className={b('btn-icon')}
            >
                {iconEl}
            </div>
        );

        if (!withCompactPopover || resolvedMenuPopupItems?.length) {
            return iconButton;
        }

        return (
            <ItemPopup
                items={[quickAccessPinItem]}
                variant="label"
                highlightCurrentItem={false}
                open={compactNavPopoverOpen}
                onOpenChange={(nextOpen) => {
                    if (nextOpen && compactPopoverDisabled) return;
                    setCompactNavPopoverOpen(nextOpen);
                }}
                hideIcon
                itemClassName={popupItemClassName}
                disabled={compactPopoverDisabled}
                type={type}
                collapsed={compact}
                onPopupItemClick={onPopupItemClick}
                onItemClick={onItemClick}
                suppressCurrentItemIds={suppressCurrentItemIds}
            >
                {iconButton}
            </ItemPopup>
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const wrappedByItemWrapper = typeof itemWrapper === 'function';
        const showChevron = shouldShowChevron({
            compact,
            inlineGroupHeader,
            hasPopupItems: Boolean(resolvedMenuPopupItems?.length),
        });
        const rowClassName = b(
            {
                type,
                current,
                compact,
                'hide-icon': hideIcon,
                'menu-group-nested': menuGroupNested,
                'menu-popup-row': menuPopupRow,
                'with-quick-access-pin': showQuickAccessPin,
                'title-lines': expandedTitleLines?.toString(),
            },
            className,
        );
        const ariaLabel = typeof title === 'string' ? title : undefined;

        const handleRowClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (compact && !collapsedItem && !showMenuPopup && !current) {
                setCompactNavPopoverOpen(false);
            }

            if (event.detail > 0) {
                const activeElement = event.currentTarget.ownerDocument.activeElement;

                if (
                    activeElement instanceof HTMLElement &&
                    interactiveRowRef.current?.contains(activeElement)
                ) {
                    activeElement.blur();
                }
            }

            onItemClick?.(props, collapsedItem, event);

            if (stopClickPropagation) {
                event.stopPropagation();
            }
        };

        const rowChildren = (
            <>
                {menuGroupNestedTreeConnector}
                <div className={b('icon-place')} ref={highlightedRef}>
                    {makeIconNode(iconEl)}
                </div>

                <div className={b('title')} title={typeof title === 'string' ? title : undefined}>
                    {titleEl}
                </div>

                {showChevron && inlineGroupHeader ? (
                    <div className={b('chevron')}>
                        <Icon
                            data={groupHeaderExpanded ? ChevronDown : ChevronRight}
                            size={CHEVRON_SIZE}
                        />
                    </div>
                ) : (
                    showChevron && (
                        <div className={b('chevron')}>
                            <Icon data={ChevronRight} size={CHEVRON_SIZE} />
                        </div>
                    )
                )}
            </>
        );

        const rowEventProps = {
            ...(menuItemAriaProps ?? {}),
            className: rowClassName,
            'data-type': type,
            'data-qa': qa,
            [COMPOSITE_BAR_ITEM_ID_ATTRIBUTE]: props.id,
            'aria-label': menuItemAriaProps?.['aria-label'] ?? ariaLabel,
            onClick: handleRowClick,
            onClickCapture: onItemClickCapture,
            onMouseEnter: () => {
                if (!compact) {
                    onMouseEnter?.();
                }
            },
            onMouseLeave: () => {
                if (!compact) {
                    onMouseLeave?.();
                }
            },
        };

        let tagNode: React.ReactNode;

        if (href) {
            tagNode = (
                <a {...rowEventProps} href={href} ref={ref as React.RefObject<HTMLAnchorElement>}>
                    {rowChildren}
                </a>
            );
        } else if (wrappedByItemWrapper) {
            tagNode = (
                <div
                    {...rowEventProps}
                    role={menuItemAriaProps?.role ?? 'button'}
                    ref={ref as React.RefObject<HTMLDivElement>}
                >
                    {rowChildren}
                </div>
            );
        } else {
            tagNode = (
                <button {...rowEventProps} ref={ref as React.RefObject<HTMLButtonElement>}>
                    {rowChildren}
                </button>
            );
        }

        const expandedMenuRows = resolvedMenuPopupItems;

        const wrappedTagNode =
            showMenuPopup && expandedMenuRows ? (
                <ItemPopup
                    items={expandedMenuRows}
                    title={resolvedMenuPopupTitle}
                    open={compactNavPopoverOpen}
                    itemClassName={popupItemClassName}
                    hideIcon={menuPopupHideIcon}
                    nestedPopupHideIcon={menuPopupNestedHideIcon}
                    onOpenChange={setCompactNavPopoverOpen}
                    collapsed={collapsedItem ? true : compact}
                    onPopupItemClick={onPopupItemClick}
                    onItemClick={onItemClick}
                    enableQuickAccessPin={enableQuickAccessPin}
                    onToggleQuickAccess={onToggleQuickAccess}
                    suppressCurrentItemIds={suppressCurrentItemIds}
                >
                    {tagNode}
                </ItemPopup>
            ) : (
                tagNode
            );

        const createdNode = (
            <React.Fragment>
                {wrappedTagNode}
                {renderPopupContent && Boolean(anchorRef?.current) && (
                    <Popup
                        strategy="fixed"
                        open={popupVisible}
                        keepMounted={popupKeepMounted}
                        placement={popupPlacement}
                        offset={popupOffset}
                        anchorElement={anchorRef.current}
                        onOpenChange={handleOpenChangePopup}
                    >
                        {renderPopupContent()}
                    </Popup>
                )}
            </React.Fragment>
        );

        return createdNode;
    };

    const wrapWithQuickAccessPin = (rowNode: React.ReactNode) => {
        if (!showQuickAccessPin) {
            return rowNode;
        }

        return (
            <div
                ref={interactiveRowRef}
                className={b('interactive-row', {'menu-popup': menuPopupRow})}
                onMouseLeave={() => setQuickAccessPinSuppressed(false)}
            >
                {rowNode}
                <span
                    className={b('quick-access-pin-slot', {
                        suppressed: quickAccessPinSuppressed,
                    })}
                >
                    <ItemQuickAccessPin
                        quickAccess={quickAccessPinItem.quickAccess}
                        onToggle={handleToggleQuickAccess}
                    />
                </span>
            </div>
        );
    };

    const iconNode =
        hideIcon || !icon ? null : (
            <Icon qa={iconQa} data={icon} size={iconSize} className={b('icon')} />
        );
    const titleNode = renderItemTitle({
        title,
        rightAdornment,
        titleLines: expandedTitleLines,
    });
    const params = {icon: iconNode, title: titleNode};
    let highlightedNode = null;
    let node;

    const opts = {compact: Boolean(compact), collapsed: false, item: props, ref};

    if (typeof itemWrapper === 'function') {
        node = wrapWithQuickAccessPin(itemWrapper(params, makeNode, opts) as React.ReactElement);
        highlightedNode =
            bringForward &&
            (itemWrapper(
                params,
                ({icon: iconEl}) => makeIconNode(iconEl, false),
                opts,
            ) as React.ReactElement);
    } else {
        node = wrapWithQuickAccessPin(makeNode(params));
        highlightedNode = bringForward && makeIconNode(iconNode, false);
    }

    return (
        <React.Fragment>
            {bringForward && (
                <HighlightedItem
                    iconNode={highlightedNode}
                    iconRef={highlightedRef}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        onItemClick?.(props, false, event)
                    }
                    onClickCapture={onItemClickCapture}
                />
            )}
            {node}
        </React.Fragment>
    );
};

Item.displayName = 'Item';
