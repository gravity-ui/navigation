import React, {useCallback, useEffect, useState} from 'react';
import {block} from '../../utils/cn';
import debounceFn from 'lodash/debounce';

import {Portal} from '@gravity-ui/uikit';

import './HighlightedItem.scss';

const b = block('composite-bar-highlighted-item');

export type OpenModalSubscriber = (open: boolean) => void;

interface ItemInnerProps {
    iconRef: React.RefObject<HTMLDivElement>;
    iconNode: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onClickCapture?: (event: React.SyntheticEvent) => void;
    openModalSubscriber?: (subscriber: OpenModalSubscriber) => void;
}

const DEBOUNCE_TIME = 200;

export const HighlightedItem: React.FC<ItemInnerProps> = ({
    iconRef,
    iconNode,
    onClick,
    onClickCapture,
    openModalSubscriber,
}: ItemInnerProps) => {
    const [{top, left, width, height}, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleResize = useCallback(
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
        [],
    );

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                style={{left, top, width, height}}
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
