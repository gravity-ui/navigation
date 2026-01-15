import React, {useCallback, useMemo} from 'react';

import {Ellipsis} from '@gravity-ui/icons';
import {DropdownMenu, Tooltip} from '@gravity-ui/uikit';
import type {DropdownMenuItem} from '@gravity-ui/uikit';

import {ASIDE_HEADER_EXPAND_DELAY} from '../../../constants';
import {createBlock} from '../../../utils/cn';
import i18n from '../../i18n';
import {FooterItem} from '../FooterItem/FooterItem';

import {MAX_VISIBLE_ITEMS} from './constants';

import styles from './FooterBar.module.scss';

const b = createBlock('footer-bar', styles);

export interface FooterBarProps {
    /** Array of footer elements (ReactNode[]) */
    children: React.ReactNode[];
    /** Render function for additional content after items (e.g., user profile) */
    renderAfter?: () => React.ReactNode;
    /** When `true`, the navigation is pinned (expanded). Items render horizontally. */
    isPinned: boolean;
    /** When `true`, the navigation is expanded (hover or pinned). */
    isExpanded: boolean;
    /** Maximum number of visible items before showing "more" button. Default: 5 */
    maxVisibleItems?: number;
}

export const FooterBar: React.FC<FooterBarProps> = ({
    children,
    renderAfter,
    isPinned,
    isExpanded,
    maxVisibleItems = MAX_VISIBLE_ITEMS,
}) => {
    // Convert children to array and filter out nulls
    const childArray = React.Children.toArray(children).filter(Boolean);

    // If only 1 element, render in vertical mode regardless of isPinned
    const isHorizontal = isPinned && childArray.length > 1;

    // Clone child element and inject isExpanded/layout props
    // - In horizontal mode (isPinned=true): layout="horizontal" (don't render title at all)
    // - In dropdown: isExpanded=true, layout="vertical" (show text)
    // - In vertical mode: use passed isExpanded value, layout="vertical"
    const renderChild = useCallback(
        (child: React.ReactNode, forDropdown = false): React.ReactNode => {
            if (!React.isValidElement(child)) {
                return child;
            }

            // In horizontal mode, don't render title (layout="horizontal")
            if (isHorizontal && !forDropdown) {
                return React.cloneElement(child as React.ReactElement, {
                    isExpanded: false,
                    layout: 'horizontal',
                });
            }

            // In dropdown, always show text
            if (forDropdown) {
                return React.cloneElement(child as React.ReactElement, {
                    isExpanded: true,
                    layout: 'vertical',
                });
            }

            // In vertical mode, use the passed isExpanded value
            return React.cloneElement(child as React.ReactElement, {
                isExpanded,
                layout: 'vertical',
            });
        },
        [isHorizontal, isExpanded],
    );

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

    const dropdownItems: DropdownMenuItem[] = useMemo(
        () =>
            hiddenChildren.map((child) => ({
                text: renderChild(child, true), // forDropdown=true, show text
                action: () => {}, // clicks are handled by the child itself
            })),
        [hiddenChildren, renderChild],
    );

    // Get title from child props for tooltip
    const getChildTitle = (child: React.ReactNode): React.ReactNode => {
        if (React.isValidElement(child) && child.props) {
            return (child.props as {title?: React.ReactNode}).title;
        }
        return undefined;
    };

    return (
        <div className={b()}>
            <div className={b('items', {horizontal: isHorizontal})}>
                {visibleChildren.map((child, index) => {
                    const renderedChild = renderChild(child);
                    const title = getChildTitle(child);

                    // In horizontal mode, wrap in Tooltip to show title on hover
                    if (isHorizontal && title) {
                        return (
                            <Tooltip
                                key={index}
                                content={title}
                                placement="top"
                                openDelay={ASIDE_HEADER_EXPAND_DELAY}
                            >
                                <div className={b('item')}>{renderedChild}</div>
                            </Tooltip>
                        );
                    }

                    return (
                        <div key={index} className={b('item')}>
                            {renderedChild}
                        </div>
                    );
                })}

                {hiddenChildren.length > 0 && (
                    <div className={b('item', {more: true})}>
                        <DropdownMenu
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

            {renderAfter && <div className={b('after')}>{renderAfter()}</div>}
        </div>
    );
};

FooterBar.displayName = 'FooterBar';
