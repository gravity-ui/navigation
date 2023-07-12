import React, {
    FC,
    useCallback,
    // useContext,
    useRef,
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {List} from '@gravity-ui/uikit';

import {block} from '../utils/cn';
import {AsideHeaderDict, MenuItem} from './../types';
import {
    getItemsHeight,
    getItemHeight,
    getSelectedItemIndex,
    getItemsMinHeight,
    getMoreButtonItem,
    getAutosizeListItems,
    invokeCallbacks,
} from './utils';
import {Item} from './Item/Item';

import './CompositeBar.scss';
import {useMultipleTooltipWrapper} from './MultipleTooltip/useMultipleTooltipWrapper';
// import {MultipleTooltipContext} from './MultipleTooltip';
// import {COLLAPSE_ITEM_ID} from './constants';

const b = block('composite-bar');

interface CompositeBarBaseProps {
    items: MenuItem[];
    compact: boolean;
    onItemClick?: (item: MenuItem, collapsed: boolean) => void;
    multipleTooltip?: boolean;
}

interface CompositeBarViewProps extends CompositeBarBaseProps {
    collapseItems?: MenuItem[];
}

export interface CompositeBarProps extends CompositeBarBaseProps {
    enableCollapsing: boolean;
    dict?: AsideHeaderDict;
}

const CompositeBarView: FC<CompositeBarViewProps> = ({
    items,
    compact,
    onItemClick,
    collapseItems,
    multipleTooltip,
}) => {
    const ref = useRef<List<MenuItem>>(null);
    // const {
    //     setValue: setMultipleTooltipContextValue,
    //     active: multipleTooltipActive,
    //     activeIndex,
    //     lastClickedItemIndex,
    // } = useContext(MultipleTooltipContext);
    const deactivateItem = useCallback(
        () => ref.current?.activateItem(undefined as unknown as number),
        [ref],
    );
    const {MultipleTooltipWrapper, onListMouseEnterByIndex, onListMouseLeave, onListItemClick} =
        useMultipleTooltipWrapper(multipleTooltip && compact);

    const onItemClickByIndex = useCallback(
        (itemIndex: number) => invokeCallbacks(onItemClick, onListItemClick?.(itemIndex)),
        [onItemClick, onListItemClick],
    );

    const onMouseLeave = useCallback(invokeCallbacks(deactivateItem, onListMouseLeave), [
        deactivateItem,
        onListMouseLeave,
    ]);

    return (
        <MultipleTooltipWrapper items={items}>
            <List<MenuItem>
                ref={ref}
                items={items}
                selectedItemIndex={getSelectedItemIndex(items)}
                itemHeight={getItemHeight}
                itemClassName={b('root-menu-item')}
                itemsHeight={getItemsHeight}
                virtualized={false}
                filterable={false}
                sortable={false}
                renderItem={(item, _isItemActive, itemIndex) => (
                    <Item
                        item={item}
                        // onMouseLeave={() => {
                        //     if (compact) {
                        //         ref.current?.activateItem(undefined as unknown as number);
                        //     }
                        // }}
                        // onMouseEnter={() => {
                        //     if (multipleTooltip) {
                        //         let multipleTooltipActiveValue = multipleTooltipActive;
                        //         if (!multipleTooltipActive && itemIndex !== lastClickedItemIndex) {
                        //             multipleTooltipActiveValue = true;
                        //         }
                        //         if (
                        //             activeIndex === itemIndex &&
                        //             multipleTooltipActive === multipleTooltipActiveValue
                        //         ) {
                        //             return;
                        //         }
                        //         setMultipleTooltipContextValue({
                        //             activeIndex: itemIndex,
                        //             active: multipleTooltipActiveValue,
                        //         });
                        //     }
                        // }}
                        // onMouseLeave={() => {
                        //     if (compact) {
                        //         ref.current?.activateItem(undefined as unknown as number);
                        //         if (
                        //             multipleTooltip &&
                        //             (activeIndex !== undefined ||
                        //                 lastClickedItemIndex !== undefined)
                        //         ) {
                        //             setMultipleTooltipContextValue({
                        //                 activeIndex: undefined,
                        //                 lastClickedItemIndex: undefined,
                        //             });
                        //         }
                        //     }
                        // }}
                        // onItemClick={(item, collapsed) => {
                        //     if (
                        //         compact &&
                        //         multipleTooltip &&
                        //         itemIndex !== lastClickedItemIndex &&
                        //         item.id !== COLLAPSE_ITEM_ID
                        //     ) {
                        //         setMultipleTooltipContextValue({
                        //             lastClickedItemIndex: itemIndex,
                        //             active: false,
                        //         });
                        //     }
                        //     onItemClick?.(item, collapsed);
                        // }}
                        onItemClick={onItemClickByIndex(itemIndex)}
                        onMouseEnter={onListMouseEnterByIndex(itemIndex)}
                        onMouseLeave={onMouseLeave}
                        compact={compact}
                        collapseItems={collapseItems}
                        enableTooltip={!multipleTooltip}
                    />
                )}
            />
        </MultipleTooltipWrapper>
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    items,
    compact,
    enableCollapsing,
    dict,
    onItemClick,
    multipleTooltip = false,
}) => {
    if (items.length === 0) {
        return null;
    }

    if (!enableCollapsing) {
        return (
            <div className={b()}>
                <CompositeBarView
                    items={items}
                    compact={compact}
                    onItemClick={onItemClick}
                    multipleTooltip={multipleTooltip}
                />
            </div>
        );
    }

    const minHeight = getItemsMinHeight(items);
    const collapseItem = getMoreButtonItem(dict);

    return (
        <div className={b({autosizer: true})} style={{minHeight}}>
            {items.length !== 0 && (
                <AutoSizer>
                    {({width, height}) => {
                        const {listItems, collapseItems} = getAutosizeListItems(
                            items,
                            height,
                            collapseItem,
                        );
                        return (
                            <div style={{width, height}}>
                                <CompositeBarView
                                    items={listItems}
                                    compact={compact}
                                    onItemClick={onItemClick}
                                    collapseItems={collapseItems}
                                    multipleTooltip={multipleTooltip}
                                />
                            </div>
                        );
                    }}
                </AutoSizer>
            )}
        </div>
    );
};
