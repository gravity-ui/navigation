import React, {MouseEvent, useCallback, useRef} from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {MakeItemParams, MenuItem} from '../../types';
import {block} from '../../utils/cn';

import './AllPagesListItem.scss';

const b = block('all-pages-list-item');

interface AllPagesListItemProps {
    item: MenuItem;
    editMode?: boolean;
    enableSorting?: boolean;
    onToggle: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export const AllPagesListItem: React.FC<AllPagesListItemProps> = (props) => {
    const {item, editMode, onToggle} = props;
    const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

    const onPinButtonClick = useCallback(
        (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
        },
        [onToggle],
    );

    const onItemClick = (e: MouseEvent<HTMLElement>) => {
        if (editMode) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const [Tag, tagProps] = item.link ? ['a' as const, {href: item.link}] : ['button' as const, {}];

    const makeNode = useCallback(
        (params: MakeItemParams) => {
            return (
                <Tag {...tagProps} className={b()} onClick={onItemClick} ref={ref}>
                    {params.icon}
                    <span className={b('text')}>{params.title}</span>
                    {editMode && !item.preventUserRemoving && (
                        <Button
                            onClick={onPinButtonClick}
                            view={item.hidden ? 'flat-secondary' : 'flat-action'}
                        >
                            <Button.Icon>{item.hidden ? <Pin /> : <PinFill />}</Button.Icon>
                        </Button>
                    )}
                </Tag>
            );
        },
        [Tag, tagProps, onItemClick, editMode, item, onPinButtonClick],
    );

    const iconNode = item.icon ? (
        <Icon className={b('icon')} data={item.icon} size={item.iconSize} />
    ) : null;
    const titleNode = item.title;
    const params: MakeItemParams = {icon: iconNode, title: titleNode};
    const opts = {collapsed: false, compact: false, item, ref};

    if (typeof item.itemWrapper === 'function') {
        return item.itemWrapper(params, makeNode, opts) as React.ReactElement;
    }

    return makeNode(params);
};
