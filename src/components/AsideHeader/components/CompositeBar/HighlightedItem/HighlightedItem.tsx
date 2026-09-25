import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {Portal} from '@gravity-ui/uikit';
import debounceFn from 'lodash/debounce';

import {block, createBlock} from '../../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityCssProperties} from '../../../density';

import styles from './HighlightedItem.module.scss';

const b = createBlock('composite-bar-highlighted-item', styles);
const bGlobal = block('composite-bar-highlighted-item');

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
    const {menuDensity, openModalSubscriber} = useAsideHeaderInnerContext();
    const densityCssProperties = getAsideHeaderDensityCssProperties(menuDensity);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [iconBackgroundSize, setIconBackgroundSize] = useState<string | undefined>();

    const handleResizeDebounced = useMemo(
        () =>
            debounceFn(
                () => {
                    const element = iconRef?.current;
                    const {
                        top = 0,
                        left = 0,
                        width = 0,
                        height = 0,
                    } = element?.getBoundingClientRect() || {};

                    setPosition({
                        top: top + window.scrollY,
                        left: left + window.scrollX,
                        width,
                        height,
                    });

                    if (element) {
                        // The copy renders in a portal, where row-level overrides of the
                        // icon background size (footer rows, density, consumer tokens) do
                        // not inherit: transfer the resolved value from the original row.
                        const computedSize = window
                            .getComputedStyle(element)
                            .getPropertyValue('--gn-aside-header-item-icon-background-size')
                            .trim();
                        setIconBackgroundSize(computedSize || undefined);
                    }
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
                className={`${b()} ${bGlobal()}`}
                style={
                    {
                        ...densityCssProperties,
                        ...(iconBackgroundSize
                            ? {'--gn-aside-header-item-icon-background-size': iconBackgroundSize}
                            : null),
                        ...position,
                    } as React.CSSProperties
                }
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
