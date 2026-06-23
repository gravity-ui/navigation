import React from 'react';

import {ChevronDown, ChevronRight} from '@gravity-ui/icons';
import {Icon, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {useSafeAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../../density';
import {isQuickAccessPinEligible} from '../../../quickAccess';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {COLLAPSE_ITEM_ID, ITEM_TYPE_REGULAR} from '../constants';

import {ItemInnerProps, ItemProps} from './Item.types';
import {ItemCompactTooltip} from './ItemCompactTooltip';
import {ItemPopup} from './ItemPopup';
import {ItemPopupNestContext} from './ItemPopupNestContext';
import {ItemQuickAccessPin} from './ItemQuickAccessPin';
import {renderItemTitle} from './renderItemTitle';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 14};
const CHEVRON_SIZE = 16;

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
        stopClickPropagation = false,
        menuGroupNestedTreeConnector,
        menuGroupNested,
        menuItemAriaProps,
        enableQuickAccessPin,
        onToggleQuickAccess,
    } = props;

    const [compactNavPopoverOpen, setCompactNavPopoverOpen] = React.useState(false);

    const ref = React.useRef<HTMLElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const icon = props.icon;
    const asideHeaderContext = useSafeAsideHeaderContext();
    const defaultIconSize = getAsideHeaderDensityConfig(asideHeaderContext?.menuDensity).iconSize;
    const iconSize = props.iconSize || defaultIconSize;
    const iconQa = props.iconQa;
    const collapsedItem = props.id === COLLAPSE_ITEM_ID;
    const inlineGroupHeader = groupHeaderExpanded !== undefined;
    const resolvedMenuPopupItems = menuPopupItems ?? props.compositeBarMenuPopupItems;
    const resolvedMenuPopupTitle = compact
        ? (menuPopupTitle ?? props.compositeBarMenuPopupTitle)
        : undefined;

    const current = props.current || resolvedMenuPopupItems?.some((item) => item.current) || false;

    const showQuickAccessPin =
        Boolean(enableQuickAccessPin) &&
        !compact &&
        isQuickAccessPinEligible(props) &&
        typeof onToggleQuickAccess === 'function';

    const handleToggleQuickAccess = React.useCallback(() => {
        onToggleQuickAccess?.(props);
    }, [
        onToggleQuickAccess,
        props.id,
        props.quickAccess,
        props.type,
        props.compositeBarMenuPopupItems,
    ]);

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
    const showMenuPopup =
        !isDivider &&
        Boolean(resolvedMenuPopupItems?.length) &&
        (collapsedItem || !inlineGroupHeader || !groupHeaderExpanded);

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
            <ItemCompactTooltip
                content={props.tooltipText ?? title}
                disabled={compactPopoverDisabled}
                type={type}
            >
                {iconButton}
            </ItemCompactTooltip>
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const wrappedByItemWrapper = typeof itemWrapper === 'function';
        const showChevron = inlineGroupHeader
            ? !compact
            : !compact && Boolean(resolvedMenuPopupItems?.length);
        const showAsideEnd = showChevron || showQuickAccessPin;

        const rowClassName = b(
            {
                type,
                current,
                compact,
                'hide-icon': hideIcon,
                'menu-group-nested': menuGroupNested,
                'with-aside-end': showAsideEnd,
            },
            className,
        );
        const ariaLabel = typeof title === 'string' ? title : undefined;

        const handleRowClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
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

                <div className={b('title')}>{titleEl}</div>

                {showAsideEnd && (
                    <div className={b('aside-end')}>
                        {showChevron && (
                            <div className={b('chevron')}>
                                <Icon
                                    data={
                                        inlineGroupHeader
                                            ? groupHeaderExpanded
                                                ? ChevronDown
                                                : ChevronRight
                                            : ChevronRight
                                    }
                                    size={CHEVRON_SIZE}
                                />
                            </div>
                        )}
                        {showQuickAccessPin && (
                            <ItemQuickAccessPin
                                quickAccess={props.quickAccess}
                                onToggle={handleToggleQuickAccess}
                            />
                        )}
                    </div>
                )}
            </>
        );

        const rowEventProps = {
            ...(menuItemAriaProps ?? {}),
            className: rowClassName,
            'data-type': type,
            'data-qa': qa,
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
                    onOpenChange={setCompactNavPopoverOpen}
                    collapsed={collapsedItem ? true : compact}
                    onPopupItemClick={onPopupItemClick}
                    onItemClick={onItemClick}
                    enableQuickAccessPin={enableQuickAccessPin}
                    onToggleQuickAccess={onToggleQuickAccess}
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

    const iconNode =
        hideIcon || !icon ? null : (
            <Icon qa={iconQa} data={icon} size={iconSize} className={b('icon')} />
        );
    const titleNode = renderItemTitle({title, rightAdornment});
    const params = {icon: iconNode, title: titleNode};
    let highlightedNode = null;
    let node;

    const opts = {compact: Boolean(compact), collapsed: false, item: props, ref};

    if (typeof itemWrapper === 'function') {
        node = itemWrapper(params, makeNode, opts) as React.ReactElement;
        highlightedNode =
            bringForward &&
            (itemWrapper(
                params,
                ({icon: iconEl}) => makeIconNode(iconEl, false),
                opts,
            ) as React.ReactElement);
    } else {
        node = makeNode(params);
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
