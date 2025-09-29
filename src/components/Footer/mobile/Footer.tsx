import React, {useCallback, useRef, useState} from 'react';
import type {FC} from 'react';

import {Ellipsis} from '@gravity-ui/icons';
import {Button, Icon, Menu, Sheet} from '@gravity-ui/uikit';

import {useOverflowingHorizontalListItems} from '../../../hooks/useOverflowingHorizontalListItems';
import {Logo} from '../../Logo';
import {createBlock} from '../../utils/cn';
import {MenuItem} from '../MenuItem/MenuItem';
import {FooterMenuItem, FooterProps} from '../types';

import styles from './Footer.module.scss';

const b = createBlock('footer', styles);

const modalId = 'footer-more-items';

export const MobileFooter: FC<FooterProps> = ({
    className,
    menuItems: providedMenuItems,
    withDivider,
    moreButtonTitle,
    onMoreButtonClick,
    view = 'normal',
    logo,
    logoWrapperClassName,
    copyright,
}) => {
    const [moreItemsMenuVisible, setMoreItemsMenuVisible] = useState(false);
    const menuContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenMoreItemsMenu = useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            setMoreItemsMenuVisible(true);
            onMoreButtonClick?.(event);
        },
        [onMoreButtonClick],
    );

    const handleCloseMoreItemsMenu = useCallback(() => {
        setMoreItemsMenuVisible(false);
    }, []);

    const menuItems = view === 'clear' ? undefined : providedMenuItems;

    const {visibleItems, hiddenItems, measured} = useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });

    const renderMenu = (items: FooterMenuItem[]) => (
        <Menu className={b('list')}>
            {items.map((item, index) => (
                <MenuItem key={index} {...item} className={b('menu-item', item.className)} />
            ))}
        </Menu>
    );

    const shouldRenderLogo = view !== 'clear' && Boolean(logo);

    return (
        <footer className={b({mobile: true, 'with-divider': withDivider, view}, className)}>
            <div className={b('menu', {measured})} ref={menuContainerRef}>
                {visibleItems.length > 0 && renderMenu(visibleItems)}
                {hiddenItems.length > 0 && (
                    <>
                        <Button
                            view="flat-secondary"
                            size="l"
                            onClick={handleOpenMoreItemsMenu}
                            title={moreButtonTitle}
                        >
                            <Icon data={Ellipsis} size={16} />
                        </Button>
                        <Sheet
                            id={modalId}
                            visible={moreItemsMenuVisible}
                            className={b('modal')}
                            contentClassName={b('modal-content')}
                            onClose={handleCloseMoreItemsMenu}
                        >
                            {renderMenu(hiddenItems)}
                        </Sheet>
                    </>
                )}
            </div>
            <div className={b('bottom-row')}>
                <small className={b('copyright')}>{copyright}</small>
                {shouldRenderLogo && (
                    <div className={logoWrapperClassName}>
                        <Logo {...logo!} />
                    </div>
                )}
            </div>
        </footer>
    );
};
