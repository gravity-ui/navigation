import React from 'react';

import {Icon, List, Popup} from '@gravity-ui/uikit';

import {MakeItemParams} from '../../../../types';
import {createBlock} from '../../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../../AsideHeaderContext';
import {POPUP_ITEM_HEIGHT, POPUP_PLACEMENT} from '../constants';
import {getSelectedItemIndex} from '../utils';

import type {ItemInnerProps} from './Item.types';
import {renderItemTitle} from './renderItemTitle';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

export interface CollapsedPopupProps {
    anchorRef: React.RefObject<HTMLElement>;
    onOpenChange: () => void;
}

export function CollapsedPopup({
    onItemClick,
    collapseItems,
    anchorRef,
    onOpenChange,
}: ItemInnerProps & CollapsedPopupProps) {
    const {compact} = useAsideHeaderInnerContext();
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

CollapsedPopup.displayName = 'CollapsedPopup';
