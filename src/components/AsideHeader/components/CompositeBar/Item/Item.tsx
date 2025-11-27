import React from 'react';

import {Icon, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {ASIDE_HEADER_ICON_SIZE} from '../../../../constants';
import {MakeItemParams} from '../../../../types';
import {block} from '../../../../utils/cn';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';
import {ITEM_TYPE_REGULAR} from '../constants';

import './Item.scss';

const b = block('composite-bar-item');

export interface ItemProps extends AsideHeaderItem {}

interface ItemInnerProps extends ItemProps {
    compact?: boolean;
    className?: string;
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
        onMouseLeave,
        onMouseEnter,
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
        compact,
    } = props;

    const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
    const anchorRef = anchoreRefProp?.current ? anchoreRefProp : ref;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const type = props.type || ITEM_TYPE_REGULAR;
    const current = props.current || false;
    const icon = props.icon;
    const iconSize = props.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = props.iconQa;

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
        return compact ? <div className={b('btn-icon')}>{iconEl}</div> : iconEl;
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
                        onItemClick?.(props, false, event);
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
        </React.Fragment>
    );
};

Item.displayName = 'Item';
