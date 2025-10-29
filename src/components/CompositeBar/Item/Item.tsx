import React from 'react';

import {ActionTooltip, Icon, List, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {useAsideHeaderContext} from '../../AsideHeader/AsideHeaderContext';
import {ASIDE_HEADER_ICON_SIZE} from '../../constants';
import {MakeItemParams, MenuItem} from '../../types';
import {block} from '../../utils/cn';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {
    COLLAPSE_ITEM_ID,
    ITEM_TYPE_REGULAR,
    POPUP_ITEM_HEIGHT,
    POPUP_PLACEMENT,
} from '../constants';
import {getSelectedItemIndex} from '../utils';

import './Item.scss';

const b = block('composite-bar-item');

interface ItemPopup {
    popupVisible?: PopupProps['open'];
    /**
     * floating element anchor ref object
     *
     * @deprecated Use `popupAnchorElement` instead
     * */
    popupAnchor?: PopupProps['anchorRef'];
    popupAnchorElement?: PopupProps['anchorElement'];
    popupPlacement?: PopupProps['placement'];
    popupOffset?: PopupProps['offset'];
    popupKeepMounted?: PopupProps['keepMounted'];
    renderPopupContent?: () => React.ReactNode;
    /**
     * This callback will be called when Escape key pressed on keyboard, or click outside was made
     * This behaviour could be disabled with `disableEscapeKeyDown`
     * and `disableOutsideClick` options
     *
     * @deprecated Use `onOpenChangePopup` instead
     */
    onClosePopup?: () => void;
    onOpenChangePopup?: PopupProps['onOpenChange'];
}

export interface ItemProps extends ItemPopup {
    item: MenuItem;
    enableTooltip?: boolean;
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
    onCollapseItemClick?: () => void;
    bringForward?: boolean;
}

interface ItemInnerProps extends ItemProps {
    className?: string;
    collapseItems?: MenuItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

function renderItemTitle(item: MenuItem) {
    let titleNode = <div className={b('title-text')}>{item.title}</div>;

    if (item.rightAdornment) {
        titleNode = (
            <React.Fragment>
                {titleNode}
                <div className={b('title-adornment')}>{item.rightAdornment}</div>
            </React.Fragment>
        );
    }

    return titleNode;
}

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 8, crossAxis: -20};

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        item,
        className,
        collapseItems,
        onMouseLeave,
        onMouseEnter,
        enableTooltip = true,
        popupVisible = false,
        popupAnchor,
        popupAnchorElement,
        popupPlacement = defaultPopupPlacement,
        popupOffset = defaultPopupOffset,
        popupKeepMounted,
        renderPopupContent,
        onClosePopup,
        onOpenChangePopup,
        onItemClick,
        onItemClickCapture,
        onCollapseItemClick,
        bringForward,
    } = props;

    const {compact} = useAsideHeaderContext();

    const [open, toggleOpen] = React.useState<boolean>(false);

    const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    const anchorRef = popupAnchorElement ? {current: popupAnchorElement} : popupAnchor || ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = item.type || ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = item.iconQa;
    const collapsedItem = item.id === COLLAPSE_ITEM_ID;

    const handleClosePopup = React.useCallback(
        (event: MouseEvent | KeyboardEvent) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onClosePopup?.();
        },
        [onClosePopup],
    );

    const handleOpenChangePopup = React.useCallback<NonNullable<ItemProps['onOpenChangePopup']>>(
        (open, event, reason) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onOpenChangePopup?.(open, event, reason);
        },
        [onClosePopup],
    );

    if (item.type === 'divider') {
        return <div className={b('menu-divider')} />;
    }

    const makeIconNode = (iconEl: React.ReactNode): React.ReactNode => {
        return compact ? (
            <ActionTooltip
                title=""
                description={tooltipText}
                disabled={!enableTooltip || (collapsedItem && open) || popupVisible}
                placement="right"
                className={b('icon-tooltip', {'item-type': type})}
            >
                <div
                    onMouseEnter={() => onMouseEnter?.()}
                    onMouseLeave={() => onMouseLeave?.()}
                    className={b('btn-icon')}
                >
                    {iconEl}
                </div>
            </ActionTooltip>
        ) : (
            iconEl
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const [Tag, tagProps] = item.link
            ? ['a' as const, {href: item.link}]
            : ['button' as const, {}];

        const createdNode = (
            <React.Fragment>
                <Tag
                    {...tagProps}
                    className={b({type, current, compact}, [className, item.className])}
                    ref={ref}
                    data-qa={item.qa}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                        if (collapsedItem) {
                            /**
                             * If we call onItemClick for collapsedItem then:
                             * - User get unexpected item in onItemClick callback
                             * - onClosePanel calls twice for each popuped item, as result it will prevent opening of panelItems
                             */
                            toggleOpen(!open);
                            onCollapseItemClick?.();
                        } else {
                            onItemClick?.(item, false, event);
                        }
                    }}
                    onClickCapture={onItemClickCapture}
                    onMouseEnter={() => {
                        if (!compact) {
                            onMouseEnter?.();
                        }
                    }}
                    onMouseLeave={() => {
                        if (!compact) {
                            onMouseLeave?.();
                        }
                    }}
                >
                    <div className={b('icon-place')} ref={highlightedRef}>
                        {makeIconNode(iconEl)}
                    </div>

                    <div
                        className={b('title')}
                        title={typeof item.title === 'string' ? item.title : undefined}
                    >
                        {titleEl}
                    </div>
                </Tag>
                {renderPopupContent && Boolean(anchorRef?.current) && (
                    <Popup
                        strategy="fixed"
                        open={popupVisible}
                        keepMounted={popupKeepMounted}
                        placement={popupPlacement}
                        offset={popupOffset}
                        anchorRef={anchorRef}
                        onClose={handleClosePopup}
                        onOpenChange={handleOpenChangePopup}
                    >
                        {renderPopupContent()}
                    </Popup>
                )}
            </React.Fragment>
        );

        return createdNode;
    };

    const iconNode = icon ? (
        <Icon qa={iconQa} data={icon} size={iconSize} className={b('icon')} />
    ) : null;
    const titleNode = renderItemTitle(item);
    const params = {icon: iconNode, title: titleNode};
    let highlightedNode = null;
    let node;

    const opts = {compact: Boolean(compact), collapsed: false, item, ref};

    if (typeof item.itemWrapper === 'function') {
        node = item.itemWrapper(params, makeNode, opts) as React.ReactElement;
        highlightedNode =
            bringForward &&
            (item.itemWrapper(
                params,
                ({icon: iconEl}) => makeIconNode(iconEl),
                opts,
            ) as React.ReactElement);
    } else {
        node = makeNode(params);
        highlightedNode = bringForward && makeIconNode(iconNode);
    }

    return (
        <React.Fragment>
            {bringForward && (
                <HighlightedItem
                    iconNode={highlightedNode}
                    iconRef={highlightedRef}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        onItemClick?.(item, false, event)
                    }
                    onClickCapture={onItemClickCapture}
                />
            )}
            {node}
            {open && collapsedItem && collapseItems?.length && Boolean(anchorRef?.current) && (
                <CollapsedPopup {...props} anchorRef={ref} onClose={() => toggleOpen(false)} />
            )}
        </React.Fragment>
    );
};

Item.displayName = 'Item';

interface CollapsedPopupProps {
    anchorRef: React.RefObject<HTMLElement>;
    onClose: () => void;
}

function CollapsedPopup({
    onItemClick,
    collapseItems,
    anchorRef,
    onClose,
}: ItemInnerProps & CollapsedPopupProps) {
    const {compact} = useAsideHeaderContext();
    return collapseItems?.length ? (
        <Popup
            strategy="fixed"
            placement={POPUP_PLACEMENT}
            open={true}
            anchorRef={anchorRef}
            onClose={onClose}
        >
            <div className={b('collapse-items-popup-content')}>
                <List
                    itemClassName={b('root-collapse-item')}
                    items={collapseItems}
                    selectedItemIndex={getSelectedItemIndex(collapseItems)}
                    itemHeight={POPUP_ITEM_HEIGHT}
                    itemsHeight={collapseItems.length * POPUP_ITEM_HEIGHT}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    onItemClick={onClose}
                    renderItem={(collapseItem) => {
                        const makeCollapseNode = ({
                            title: titleEl,
                            icon: iconEl,
                        }: MakeItemParams) => {
                            const [Tag, tagProps] = collapseItem.link
                                ? ['a' as const, {href: collapseItem.link}]
                                : ['button' as const, {}];

                            return (
                                <Tag
                                    {...tagProps}
                                    className={b('collapse-item')}
                                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                        onItemClick?.(collapseItem, true, event);
                                    }}
                                >
                                    {iconEl}
                                    {titleEl}
                                </Tag>
                            );
                        };

                        const titleNode = renderItemTitle(collapseItem);
                        const iconNode = collapseItem.icon && (
                            <Icon
                                data={collapseItem.icon}
                                size={14}
                                className={b('collapse-item-icon')}
                            />
                        );

                        const params = {title: titleNode, icon: iconNode};
                        const opts = {
                            compact: Boolean(compact),
                            collapsed: true,
                            item: collapseItem,
                            ref: anchorRef,
                        };
                        if (typeof collapseItem.itemWrapper === 'function') {
                            return collapseItem.itemWrapper(params, makeCollapseNode, opts);
                        } else {
                            return makeCollapseNode(params);
                        }
                    }}
                />
            </div>
        </Popup>
    ) : null;
}
