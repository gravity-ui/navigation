import React, {MouseEvent, useCallback} from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text} from '@gravity-ui/uikit';

import {MenuGroup} from 'src/components/types';

import {block} from '../../../utils/cn';

import './AllPagesGroupHeader.scss';

const b = block('all-pages-group-header');

interface AllPagesGroupHeaderProps {
    group: MenuGroup;
    onTogglePin?: (groupId: string) => void;
    editMode?: boolean;
}

export const AllPagesGroupHeader: React.FC<AllPagesGroupHeaderProps> = ({
    group,
    onTogglePin,
    editMode,
}) => {
    const onPinButtonClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            onTogglePin?.(group.id);
        },
        [group.id, onTogglePin],
    );

    return (
        <Flex className={b()} gap="2" alignItems="center" justifyContent="space-between">
            <Flex gap="2" alignItems="center">
                {group.icon && <Icon data={group.icon} size={16} />}

                <Text className={b('title')} variant="body-1" color="secondary">
                    {group.title}
                </Text>
            </Flex>

            {editMode && group.id !== 'ungrouped' && (
                <Button
                    onClick={onPinButtonClick}
                    view={group.pinned ? 'flat-action' : 'flat-secondary'}
                    size="m"
                >
                    <Button.Icon>{group.pinned ? <PinFill /> : <Pin />}</Button.Icon>
                </Button>
            )}
        </Flex>
    );
};
