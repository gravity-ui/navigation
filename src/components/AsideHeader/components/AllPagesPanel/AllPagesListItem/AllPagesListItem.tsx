import React, {MouseEvent, useCallback} from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {block} from '../../../../utils/cn';

import './AllPagesListItem.scss';

const b = block('all-pages-list-item');

interface AllPagesListItemProps {
    item: AsideHeaderItem;
    editMode?: boolean;
    enableSorting?: boolean;
    onToggle: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export const AllPagesListItem: React.FC<AllPagesListItemProps> = (props) => {
    const {item, editMode, onToggle} = props;
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

    return (
        <Tag {...tagProps} className={b()} onClick={onItemClick}>
            {item.icon ? (
                <Icon className={b('icon')} data={item.icon} size={item.iconSize} />
            ) : null}
            <span className={b('text')}>{item.title}</span>
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
};
