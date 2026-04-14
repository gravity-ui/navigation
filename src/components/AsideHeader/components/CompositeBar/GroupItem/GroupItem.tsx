import React from 'react';

import {ActionTooltip, Icon, List, Popover} from '@gravity-ui/uikit';

import {ASIDE_HEADER_ICON_SIZE} from '../../../../constants';
import {createBlock} from '../../../../utils/cn';
import {AsideHeaderItem} from '../../../types';
import {POPUP_ITEM_HEIGHT, POPUP_PLACEMENT} from '../constants';
import {GroupHeaderItem} from '../grouping';
import {getSelectedItemIndex} from '../utils';

import styles from './GroupItem.module.scss';

const b = createBlock('group-item', styles);

const POPUP_ICON_SIZE = 16;
const POPOVER_OPEN_DELAY_MS = 150;

export interface GroupItemProps extends GroupHeaderItem {
    compact?: boolean;
    enableTooltip?: boolean;
    onItemClick?: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const GroupItem: React.FC<GroupItemProps> = ({
    title,
    icon,
    iconSize = ASIDE_HEADER_ICON_SIZE,
    current = false,
    compact,
    enableTooltip = true,
    _groupChildren,
    onItemClick,
    onMouseEnter,
    onMouseLeave,
    qa,
}) => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const tooltipText = title;

    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            setPopoverOpen(open);
            if (open) {
                onMouseEnter?.();
            } else {
                onMouseLeave?.();
            }
        },
        [onMouseEnter, onMouseLeave],
    );

    const iconNode = icon ? (
        <Icon data={icon} size={iconSize} className={b('popup-item-icon')} />
    ) : null;

    const itemIconNode = compact ? (
        <ActionTooltip
            title=""
            description={tooltipText}
            disabled={!enableTooltip || popoverOpen}
            placement="right"
        >
            <div className={b('btn-icon')}>{iconNode}</div>
        </ActionTooltip>
    ) : (
        iconNode
    );

    const popoverContent = (
        <div className={b('popup-content')}>
            <List
                items={_groupChildren}
                selectedItemIndex={getSelectedItemIndex(_groupChildren)}
                itemHeight={POPUP_ITEM_HEIGHT}
                itemsHeight={_groupChildren.length * POPUP_ITEM_HEIGHT}
                virtualized={false}
                filterable={false}
                sortable={false}
                renderItem={(item) => {
                    const [Tag, tagProps] = item.href
                        ? (['a', {href: item.href}] as const)
                        : (['button', {}] as const);

                    return (
                        <Tag
                            {...tagProps}
                            className={b('popup-item')}
                            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                onItemClick?.(item, false, event);
                                item.onItemClick?.(item, false, event);
                                setPopoverOpen(false);
                            }}
                        >
                            {item.icon && (
                                <Icon
                                    data={item.icon}
                                    size={POPUP_ICON_SIZE}
                                    className={b('popup-item-icon')}
                                />
                            )}
                            <span className={b('popup-item-title')}>{item.title}</span>
                        </Tag>
                    );
                }}
            />
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            placement={POPUP_PLACEMENT}
            strategy="fixed"
            open={popoverOpen}
            onOpenChange={handleOpenChange}
            enableSafePolygon
            openDelay={POPOVER_OPEN_DELAY_MS}
        >
            <button className={b({current, compact})} data-qa={qa}>
                <div className={b('icon-place')}>{itemIconNode}</div>
                <div className={b('title')} title={typeof title === 'string' ? title : undefined}>
                    <div className={b('title-text')}>{title}</div>
                </div>
            </button>
        </Popover>
    );
};

GroupItem.displayName = 'GroupItem';
