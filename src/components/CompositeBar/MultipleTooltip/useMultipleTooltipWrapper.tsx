import React, {FC, PropsWithChildren, useCallback, useContext, useRef} from 'react';
import {MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltipContext';
import {ASIDE_HEADER_COMPACT_WIDTH} from '../../constants';
import {MultipleTooltip} from './MultipleTooltip';
import {CompositeBarProps} from '../CompositeBar';
import {MenuItem} from 'src/components/types';
import {COLLAPSE_ITEM_ID} from '../constants';
import {ItemProps} from '../Item/Item';

const WrapperInner: FC<PropsWithChildren<{items: MenuItem[]}>> = ({children, items}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const {setValue, active, activeIndex, lastClickedItemIndex} =
        useContext(MultipleTooltipContext);
    return (
        <>
            <div
                ref={tooltipRef}
                onMouseEnter={(e) => {
                    if (
                        !active &&
                        activeIndex !== lastClickedItemIndex &&
                        e.clientX <= ASIDE_HEADER_COMPACT_WIDTH
                    ) {
                        setValue?.({
                            active: true,
                        });
                    }
                }}
                onMouseLeave={() => {
                    if (active) {
                        setValue?.({
                            active: false,
                            lastClickedItemIndex: undefined,
                        });
                    }
                }}
            >
                {children}
            </div>
            <MultipleTooltip
                open={active}
                anchorRef={tooltipRef}
                placement={['right-start']}
                items={items}
            />
        </>
    );
};

const noopByIndex = () => () => {};

type ByIndex<T> = (index: number) => T;

interface MultipleTooltipHookType {
    MultipleTooltipWrapper: FC<PropsWithChildren<{items: MenuItem[]}>>;
    onListMouseEnterByIndex: ByIndex<() => void>;
    onListMouseLeave: () => void;
    onListItemClick: ByIndex<CompositeBarProps['onItemClick']>;
}

export const useMultipleTooltipWrapper = (available?: boolean): MultipleTooltipHookType => {
    const {setValue, active, activeIndex, lastClickedItemIndex} =
        useContext(MultipleTooltipContext);
    const onListMouseEnterByIndex = useCallback(
        (itemIndex) => () => {
            if (available) {
                let multipleTooltipActiveValue = active;
                if (!active && itemIndex !== lastClickedItemIndex) {
                    multipleTooltipActiveValue = true;
                }
                if (activeIndex === itemIndex && active === multipleTooltipActiveValue) {
                    return;
                }
                setValue({
                    activeIndex: itemIndex,
                    active: multipleTooltipActiveValue,
                });
            }
        },
        [setValue, active, activeIndex, lastClickedItemIndex],
    );
    const onListMouseLeave = useCallback(() => {
        if (available && (activeIndex !== undefined || lastClickedItemIndex !== undefined)) {
            setValue({
                activeIndex: undefined,
                lastClickedItemIndex: undefined,
            });
        }
    }, [setValue]);
    const onListItemClick = useCallback(
        (itemIndex): ItemProps['onItemClick'] =>
            (item) => {
                if (
                    available &&
                    itemIndex !== lastClickedItemIndex &&
                    item.id !== COLLAPSE_ITEM_ID
                ) {
                    setValue({
                        lastClickedItemIndex: itemIndex,
                        active: false,
                    });
                }
            },
        [setValue],
    );
    return available
        ? {
              MultipleTooltipWrapper: ({children, items}) => (
                  <MultipleTooltipProvider>
                      <WrapperInner items={items}>{children}</WrapperInner>
                  </MultipleTooltipProvider>
              ),
              onListMouseEnterByIndex,
              onListMouseLeave,
              onListItemClick,
          }
        : {
              MultipleTooltipWrapper: ({children}) => <>{children}</>,
              onListMouseEnterByIndex: noopByIndex,
              onListMouseLeave: noopByIndex,
              onListItemClick: noopByIndex,
          };
};
