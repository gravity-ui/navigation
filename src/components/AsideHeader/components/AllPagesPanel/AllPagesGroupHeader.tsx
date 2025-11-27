import React, {MouseEvent, ReactNode, useCallback} from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';

import {UNGROUPED_ID} from './constants';

import './AllPagesGroupHeader.scss';

const b = block('all-pages-group-header');

interface AllPagesGroupHeaderProps {
    id: string;
    title: string | ReactNode;
    hidden: boolean;
    isDisabled: boolean;
    icon?: SVGIconData;
    editMode?: boolean;
    onToggleHidden?: (groupId: string) => void;
}

export const AllPagesGroupHeader: React.FC<AllPagesGroupHeaderProps> = ({
    onToggleHidden,
    editMode,
    id,
    icon,
    title,
    hidden,
    isDisabled,
}) => {
    const onHideButtonClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleHidden?.(id);
        },
        [id, onToggleHidden],
    );

    return (
        <Flex className={b()} gap="2" alignItems="center" justifyContent="space-between">
            <Flex className={b('title-container')} alignItems="center">
                {icon && <Icon data={icon} size={16} />}

                <Text className={b('title')} variant="body-1" color="secondary">
                    {title}
                </Text>
            </Flex>

            {editMode && id !== UNGROUPED_ID && (
                <Button
                    onClick={onHideButtonClick}
                    disabled={isDisabled}
                    view={hidden ? 'flat-secondary' : 'flat-action'}
                >
                    <Button.Icon>{hidden ? <Pin /> : <PinFill />}</Button.Icon>
                </Button>
            )}
        </Flex>
    );
};
