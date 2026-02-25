import React, {memo, useCallback, useMemo} from 'react';

import {Ellipsis} from '@gravity-ui/icons';
import type {DropdownMenuItem} from '@gravity-ui/uikit';
import {DropdownMenu, Tooltip} from '@gravity-ui/uikit';

import {ASIDE_HEADER_EXPAND_DELAY} from '../../../constants';
import {createBlock} from '../../../utils/cn';
import {FooterLayoutContext, FooterLayoutContextValue} from '../../FooterLayoutContext';
import i18n from '../../i18n';
import {SetCollapseBlocker} from '../../types';
import {FooterItem, FooterItemProps} from '../FooterItem/FooterItem';

import {MAX_VISIBLE_ITEMS} from './constants';

import styles from './FooterBar.module.scss';

const isValidFooterElement = (
    child: React.ReactNode,
): child is React.ReactElement<FooterItemProps> => {
    return React.isValidElement(child);
};

const getChildKey = (child: React.ReactNode, fallbackIndex: number): string | number => {
    if (React.isValidElement(child) && child.key) {
        return child.key;
    }
    return fallbackIndex;
};

// Get title from child props for tooltip
const getChildTitle = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child) && child.props) {
        return (child.props as {title?: React.ReactNode}).title;
    }
    return undefined;
};

const b = createBlock('footer-bar', styles);

export interface FooterBarProps {
    /** Array of footer elements (ReactNode[]) */
    children: React.ReactNode[];
    /** Render function for additional content after items (e.g., user profile). Receives options with setCollapseBlocker. */
    renderAfter?: (options?: {setCollapseBlocker?: SetCollapseBlocker}) => React.ReactNode;
    /** Registers a temporary block on collapse (e.g. while dropdown is open). Returns release function. */
    setCollapseBlocker?: SetCollapseBlocker;
    /** When `true`, the navigation is pinned (expanded). Items render horizontally. */
    isPinned: boolean;
    /** When `true`, the navigation is expanded (hover or pinned). */
    isExpanded: boolean;
    /** Maximum number of visible items before showing "more" button. Default: 5 */
    maxVisibleItems?: number;
}

export const FooterBar = memo<FooterBarProps>(
    ({
        children,
        renderAfter,
        setCollapseBlocker,
        isPinned,
        isExpanded,
        maxVisibleItems = MAX_VISIBLE_ITEMS,
    }) => {
        const childArray = React.Children.toArray(children).filter(Boolean);

        // If only 1 element, render in vertical mode regardless of isPinned
        const isHorizontal = isPinned && childArray.length > 1;

        const handleDropdownOpenToggle = useCallback(
            (isOpened: boolean) => {
                setCollapseBlocker?.(isOpened);
            },
            [setCollapseBlocker],
        );

        const renderDropdownChild = useCallback((child: React.ReactNode): React.ReactNode => {
            if (!isValidFooterElement(child)) {
                return child;
            }

            // In dropdown, always show text
            return React.cloneElement(child, {
                isExpanded: true,
                layout: 'vertical',
            });
        }, []);

        const {visibleChildren, hiddenChildren} = useMemo(() => {
            if (childArray.length <= maxVisibleItems) {
                return {
                    visibleChildren: childArray,
                    hiddenChildren: [],
                };
            }

            // Reserve one slot for "more" button
            const visibleCount = maxVisibleItems - 1;
            return {
                visibleChildren: childArray.slice(0, visibleCount),
                hiddenChildren: childArray.slice(visibleCount),
            };
        }, [childArray, maxVisibleItems]);

        const value: FooterLayoutContextValue = useMemo(
            () => ({
                layout: isHorizontal ? 'horizontal' : 'vertical',
                isExpanded,
            }),
            [isHorizontal, isExpanded],
        );

        const dropdownItems: DropdownMenuItem[] = useMemo(
            () =>
                hiddenChildren.map((child) => ({
                    text: renderDropdownChild(child),
                    action: () => {}, // clicks are handled by the child itself
                })),
            [hiddenChildren, renderDropdownChild],
        );

        const afterContent = React.useMemo(
            () => (renderAfter ? renderAfter({setCollapseBlocker}) : null),
            [renderAfter, setCollapseBlocker],
        );

        return (
            <div className={b()}>
                <div className={b('items', {horizontal: isHorizontal})}>
                    <FooterLayoutContext.Provider value={value}>
                        {visibleChildren.map((child, index) => {
                            const title = getChildTitle(child);

                            // In horizontal mode, wrap in Tooltip to show title on hover
                            if (isHorizontal && title) {
                                return (
                                    <Tooltip
                                        key={getChildKey(child, index)}
                                        content={title}
                                        placement="top"
                                        openDelay={ASIDE_HEADER_EXPAND_DELAY}
                                    >
                                        <div className={b('item')}>{child}</div>
                                    </Tooltip>
                                );
                            }

                            return (
                                <div key={getChildKey(child, index)} className={b('item')}>
                                    {child}
                                </div>
                            );
                        })}
                    </FooterLayoutContext.Provider>

                    {hiddenChildren.length > 0 && (
                        <div className={b('item', {more: true})}>
                            <DropdownMenu
                                onOpenToggle={handleDropdownOpenToggle}
                                items={dropdownItems}
                                popupProps={{
                                    placement: isHorizontal ? 'top' : 'right',
                                    className: b('dropdown-popup'),
                                }}
                                switcherWrapperClassName={b('dropdown-switcher')}
                                renderSwitcher={({onClick}) => (
                                    <FooterItem
                                        id="more"
                                        title={i18n('label_others')}
                                        icon={Ellipsis}
                                        isExpanded={!isHorizontal && isExpanded}
                                        layout={isHorizontal ? 'horizontal' : 'vertical'}
                                        onItemClick={(_, __, event) => {
                                            onClick(event as React.MouseEvent<HTMLElement>);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    )}
                </div>

                {afterContent && (
                    <div className={b('after', {horizontal: isHorizontal})}>{afterContent}</div>
                )}
            </div>
        );
    },
);

FooterBar.displayName = 'FooterBar';
