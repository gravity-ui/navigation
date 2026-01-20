import React from 'react';

import {ActionTooltip, Icon, List, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {ASIDE_HEADER_ICON_SIZE} from '../../../../constants';
import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {useAsideHeaderContext} from '../../../AsideHeaderContext';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {
    COLLAPSE_ITEM_ID,
    ITEM_TYPE_REGULAR,
    POPUP_ITEM_HEIGHT,
    POPUP_PLACEMENT,
} from '../constants';
import {getSelectedItemIndex} from '../utils';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

export interface ItemProps extends AsideHeaderItem {}

interface ItemInnerProps extends ItemProps {
    className?: string;
    collapseItems?: AsideHeaderItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

function renderItemTitle(params: Pick<AsideHeaderItem, 'title' | 'rightAdornment'>) {
    let titleNode = <div className={b('title-text')}>{params.title}</div>;

    if (params.rightAdornment) {
        titleNode = (
            <React.Fragment>
                {titleNode}
                <div className={b('title-adornment')}>{params.rightAdornment}</div>
            </React.Fragment>
        );
    }

    return titleNode;
}

const defaultPopupPlacement: PopupPlacement = ['right-end'];
const defaultPopupOffset: NonNullable<PopupProps['offset']> = {mainAxis: 8, crossAxis: -20};

export const Item: React.FC<ItemInnerProps> = (props) => {
    const {
        className,
        collapseItems,
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
        onItemClickCapture,
        itemWrapper,
        bringForward,
        rightAdornment,
        title,
        href,
        qa,
    } = props;

    const [open, toggleOpen] = React.useState<boolean>(false);

    const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const current = props.current || false;
    const tooltipText = props.tooltipText || props.title;
    const icon = props.icon;
    const iconSize = props.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = props.iconQa;
    const collapsedItem = props.id === COLLAPSE_ITEM_ID;

    const handleOpenChangePopup = React.useCallback<NonNullable<ItemProps['onOpenChangePopup']>>(
        (newOpen, event, reason) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onOpenChangePopup?.(newOpen, event, reason);
        },
        [onOpenChangePopup],
    );

    if (type === 'divider') {
        return <div className={b('menu-divider')} />;
    }

    const makeIconNode = (iconEl: React.ReactNode): React.ReactNode => {
        // Add b('icon') class only when no itemWrapper is provided.
        // When itemWrapper is present, the user controls the icon and may have custom styles
        // that we shouldn't override.
        let processedIconEl = iconEl;
        if (React.isValidElement(iconEl) && typeof itemWrapper !== 'function') {
            const existingClassName = (iconEl.props as {className?: string}).className || '';
            if (!existingClassName.includes(b('icon'))) {
                processedIconEl = React.cloneElement(iconEl, {
                    className: `${existingClassName} ${b('icon')}`.trim(),
                } as React.Attributes);
            }
        }

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
                    {processedIconEl}
                </div>
            </ActionTooltip>
        ) : (
            processedIconEl
        );
    };

    const makeNode = ({icon: iconEl, title: titleEl}: MakeItemParams) => {
        const [Tag, tagProps] = href ? ['a' as const, {href}] : ['button' as const, {}];

        const createdNode = (
            <React.Fragment>
                <Tag
                    {...tagProps}
                    className={b({type, current, compact}, className)}
                    ref={ref}
                    data-qa={qa}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                        if (collapsedItem) {
                            /**
                             * This is the "more" button (three dots) that shows additional menu items in a popup.
                             * We call onItemClick with collapsed=true to indicate this is a collapse action.
                             */
                            toggleOpen(!open);
                            onItemClick?.(props, true, event);
                        } else {
                            onItemClick?.(props, false, event);
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
                        title={typeof title === 'string' ? title : undefined}
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

    const iconNode = icon ? (
        <Icon qa={iconQa} data={icon} size={iconSize} className={b('icon')} />
    ) : null;
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
                        onItemClick?.(props, false, event)
                    }
                    onClickCapture={onItemClickCapture}
                />
            )}
            {node}
            {open && collapsedItem && collapseItems?.length && Boolean(anchorRef?.current) && (
                <CollapsedPopup
                    {...props}
                    anchorRef={anchorRef}
                    onOpenChange={() => toggleOpen(false)}
                />
            )}
        </React.Fragment>
    );
};

Item.displayName = 'Item';

interface CollapsedPopupProps {
    anchorRef: React.RefObject<HTMLElement>;
    onOpenChange: () => void;
}

function CollapsedPopup({
    onItemClick,
    collapseItems,
    anchorRef,
    onOpenChange,
}: ItemInnerProps & CollapsedPopupProps) {
    const {compact} = useAsideHeaderContext();
    return collapseItems?.length ? (
        <Popup
            strategy="fixed"
            placement={POPUP_PLACEMENT}
            open={true}
            anchorElement={anchorRef.current}
            onOpenChange={onOpenChange}
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
                    onItemClick={onOpenChange}
                    renderItem={(item) => {
                        const makeCollapseNode = ({
                            title: titleEl,
                            icon: iconEl,
                        }: MakeItemParams) => {
                            const [Tag, tagProps] = item.href
                                ? ['a' as const, {href: item.href}]
                                : ['button' as const, {}];

                            return (
                                <Tag
                                    {...tagProps}
                                    className={b('collapse-item')}
                                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                        onItemClick?.(item, true, event);
                                    }}
                                >
                                    {iconEl}
                                    {titleEl}
                                </Tag>
                            );
                        };

                        const titleNode = renderItemTitle(item);
                        const iconNode = item.icon && (
                            <Icon data={item.icon} size={14} className={b('collapse-item-icon')} />
                        );

                        const params = {title: titleNode, icon: iconNode};
                        const opts = {
                            compact: Boolean(compact),
                            collapsed: true,
                            item,
                            ref: anchorRef,
                        };
                        if (typeof item.itemWrapper === 'function') {
                            return item.itemWrapper(params, makeCollapseNode, opts);
                        } else {
                            return makeCollapseNode(params);
                        }
                    }}
                />
            </div>
        </Popup>
    ) : null;
}
