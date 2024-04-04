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
    popupAnchor?: PopupProps['anchorRef'];
    popupPlacement?: PopupProps['placement'];
    popupOffset?: PopupProps['offset'];
    popupKeepMounted?: PopupProps['keepMounted'];
    popupContentClassName?: PopupProps['contentClassName'];
    renderPopupContent?: () => React.ReactNode;
    onClosePopup?: () => void;
}

export interface ItemProps extends ItemPopup {
    item: MenuItem;
    enableTooltip?: boolean;
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
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

    if (item.description) {
        titleNode = (
            <div className={b('title-with-description')}>
                {titleNode}
                <div className={b('title-description')}>{item.description}</div>
            </div>
        );
    }
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

export const defaultPopupPlacement: PopupPlacement = ['right-end'];
export const defaultPopupOffset: NonNullable<PopupProps['offset']> = [-20, 8];

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
        popupPlacement = defaultPopupPlacement,
        popupOffset = defaultPopupOffset,
        popupKeepMounted,
        popupContentClassName,
        renderPopupContent,
        onClosePopup,
        onItemClick,
        onItemClickCapture,
        bringForward,
    } = props;

    const {compact} = useAsideHeaderContext();

    const [open, toggleOpen] = React.useState<boolean>(false);

    const ref = React.useRef<HTMLDivElement>(null);
    const anchorRef = popupAnchor || ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = item.type || ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || ASIDE_HEADER_ICON_SIZE;
    const collapsedItem = item.id === COLLAPSE_ITEM_ID;

    const modifiers: Required<PopupProps>['modifiers'] = React.useMemo(
        () => [
            {
                name: 'compact',
                enabled: true,
                options: {compact},
                phase: 'main',
                fn() {},
            },
        ],
        [compact],
    );

    const onClose = React.useCallback(
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
        const nodeTittle = [];
        if (typeof item.title === 'string') {
            nodeTittle.push(item.title);
        }
        if (typeof item.description === 'string') {
            nodeTittle.push(item.description);
        }

        const createdNode = (
            <React.Fragment>
                <div
                    className={b({type, current, compact}, className)}
                    ref={ref}
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if (collapsedItem) {
                            /**
                             * If we call onItemClick for collapsedItem then:
                             * - User get unexpected item in onItemClick callback
                             * - onClosePanel calls twice for each popuped item, as result it will prevent opening of panelItems
                             */
                            toggleOpen(!open);
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

                    <div className={b('title')} title={nodeTittle.join('. ')}>
                        {titleEl}
                    </div>
                </div>
                {renderPopupContent && Boolean(anchorRef?.current) && (
                    <Popup
                        contentClassName={b('popup', popupContentClassName)}
                        open={popupVisible}
                        keepMounted={popupKeepMounted}
                        placement={popupPlacement}
                        offset={popupOffset}
                        anchorRef={anchorRef}
                        onClose={onClose}
                        modifiers={modifiers}
                    >
                        {renderPopupContent()}
                    </Popup>
                )}
            </React.Fragment>
        );

        return item.link ? (
            <a href={item.link} className={b('link')}>
                {createdNode}
            </a>
        ) : (
            createdNode
        );
    };

    const iconNode = icon ? <Icon data={icon} size={iconSize} className={b('icon')} /> : null;
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
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
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
        <Popup placement={POPUP_PLACEMENT} open={true} anchorRef={anchorRef} onClose={onClose}>
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
                        const makeCollapseNode = ({title: titleEl}: MakeItemParams) => {
                            const res = (
                                <div
                                    className={b('collapse-item')}
                                    onClick={(
                                        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                                    ) => {
                                        onItemClick?.(collapseItem, true, event);
                                    }}
                                >
                                    {titleEl}
                                </div>
                            );

                            return collapseItem.link ? (
                                <a href={collapseItem.link} className={b('link')}>
                                    {res}
                                </a>
                            ) : (
                                res
                            );
                        };

                        const titleNode = renderItemTitle(collapseItem);
                        const params = {title: titleNode};
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
