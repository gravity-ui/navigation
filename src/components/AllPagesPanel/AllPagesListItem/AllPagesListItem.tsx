import React, {MouseEvent, useCallback} from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {MenuItem} from '../../types';
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
    const {item, editMode, onToggle, enableSorting, onDragStart, onDragEnd} = props;
    const onPinButtonClick = useCallback(
        (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
        },
        [onToggle],
    );

    const onItemClick = (e: MouseEvent<HTMLDivElement>) => {
        if (editMode) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const onItemDragStart = (e: MouseEvent<HTMLDivElement>) => {
        if (editMode && onDragStart) {
            e.stopPropagation();
            e.preventDefault();
            onDragStart();
        }
    };

    const onItemDragEnd = (e: MouseEvent<HTMLDivElement>) => {
        if (editMode && onDragEnd) {
            e.stopPropagation();
            e.preventDefault();
            onDragEnd();
        }
    };

    return (
        <div
            key={item.id}
            className={b({'edit-mode': editMode && enableSorting})}
            onClick={onItemClick}
            draggable={editMode && enableSorting}
            onMouseDown={onItemDragStart}
            onMouseUp={onItemDragEnd}
        >
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
        </div>
    );
};
