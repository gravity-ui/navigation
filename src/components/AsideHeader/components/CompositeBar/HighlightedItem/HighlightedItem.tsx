import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {Portal} from '@gravity-ui/uikit';
import debounceFn from 'lodash/debounce';

import {block} from '../../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../../AsideHeaderContext';

import './HighlightedItem.scss';

const b = block('composite-bar-highlighted-item');

interface ItemInnerProps {
    iconRef: React.RefObject<HTMLDivElement>;
    iconNode: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onClickCapture?: (event: React.SyntheticEvent) => void;
}

const DEBOUNCE_TIME = 200;

export const HighlightedItem: React.FC<ItemInnerProps> = ({
    iconRef,
    iconNode,
    onClick,
    onClickCapture,
}: ItemInnerProps) => {
    const {openModalSubscriber} = useAsideHeaderInnerContext();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleResizeDebounced = useMemo(
        () =>
            debounceFn(
                () => {
                    const {
                        top = 0,
                        left = 0,
                        width = 0,
                        height = 0,
                    } = iconRef?.current?.getBoundingClientRect() || {};

                    setPosition({
                        top: top + window.scrollY,
                        left: left + window.scrollX,
                        width,
                        height,
                    });
                },
                DEBOUNCE_TIME,
                {leading: true},
            ),
        [iconRef],
    );

    const handleResize = useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);

    useEffect(() => {
        if (!isModalOpen) {
            return undefined;
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize, isModalOpen]);

    openModalSubscriber?.((open: boolean) => {
        setIsModalOpen(open);
    });

    if (!iconNode || !isModalOpen) {
        return null;
    }

    return (
        <Portal>
            <div
                className={b()}
                style={position}
                onClick={onClick}
                onClickCapture={onClickCapture}
                data-toast
            >
                <div className={b('icon')}>{iconNode}</div>
            </div>
        </Portal>
    );
};

HighlightedItem.displayName = 'HighlightedItem';
