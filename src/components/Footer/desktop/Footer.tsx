import React, {useMemo, useRef} from 'react';
import type {FC} from 'react';

import {DropdownMenu, Menu} from '@gravity-ui/uikit';
import type {DropdownMenuItem} from '@gravity-ui/uikit';

import {useOverflowingHorizontalListItems} from '../../../hooks/useOverflowingHorizontalListItems';
import {Logo} from '../../Logo';
import {block} from '../../utils/cn';
import {MenuItem} from '../MenuItem/MenuItem';
import {FooterProps} from '../types';

import {moreItemsPopupProps} from './constants/moreItemsPopupProps';

import './Footer.scss';

const b = block('footer');

export const Footer: FC<FooterProps> = ({
    className,
    menuItems: providedMenuItems,
    withDivider,
    moreButtonTitle,
    view = 'normal',
    logo,
    logoWrapperClassName,
    copyright,
}) => {
    const menuContainerRef = useRef<HTMLDivElement>(null);

    const menuItems = view === 'clear' ? undefined : providedMenuItems;

    const {visibleItems, hiddenItems, measured} = useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });

    const moreButtonProps = useMemo(
        () => ({
            title: moreButtonTitle,
        }),
        [moreButtonTitle],
    );

    const dropdownMenuItems = useMemo(
        () =>
            hiddenItems.map(
                (item) =>
                    ({
                        ...item,
                        action: item.onClick,
                    }) as DropdownMenuItem,
            ),
        [hiddenItems],
    );

    const shouldRenderLogo = view !== 'clear' && Boolean(logo);

    return (
        <footer className={b({desktop: true, 'with-divider': withDivider, view}, className)}>
            <div className={b('menu', {measured})} ref={menuContainerRef}>
                {visibleItems.length > 0 && (
                    <Menu className={b('list')}>
                        {visibleItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                {...item}
                                className={b('menu-item', item.className)}
                            />
                        ))}
                    </Menu>
                )}
                {dropdownMenuItems.length > 0 && (
                    <DropdownMenu
                        items={dropdownMenuItems}
                        switcherWrapperClassName={b('more-button')}
                        popupProps={moreItemsPopupProps}
                        defaultSwitcherProps={moreButtonProps}
                    />
                )}
            </div>
            <div className={b('right')}>
                <small className={b('copyright', {small: !menuItems?.length})}>{copyright}</small>
                {shouldRenderLogo && (
                    <div className={logoWrapperClassName}>
                        <Logo {...logo!} />
                    </div>
                )}
            </div>
        </footer>
    );
};
