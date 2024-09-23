import React__default, { useState, useRef, useCallback } from 'react';
import { Ellipsis } from '@gravity-ui/icons';
import { Button, Icon, Sheet, Menu } from '@gravity-ui/uikit';
import { useOverflowingHorizontalListItems } from '../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.js';
import { Logo } from '../../Logo/Logo.js';
import { block } from '../../utils/cn.js';
import { MenuItem } from '../MenuItem/MenuItem.js';

const b = block('footer');
const modalId = 'footer-more-items';
const MobileFooter = ({ className, menuItems: providedMenuItems, withDivider, moreButtonTitle, onMoreButtonClick, view = 'normal', logo, logoWrapperClassName, copyright, }) => {
    const [moreItemsMenuVisible, setMoreItemsMenuVisible] = useState(false);
    const menuContainerRef = useRef(null);
    const handleOpenMoreItemsMenu = useCallback((event) => {
        setMoreItemsMenuVisible(true);
        onMoreButtonClick === null || onMoreButtonClick === void 0 ? void 0 : onMoreButtonClick(event);
    }, [onMoreButtonClick]);
    const handleCloseMoreItemsMenu = useCallback(() => {
        setMoreItemsMenuVisible(false);
    }, []);
    const menuItems = view === 'clear' ? undefined : providedMenuItems;
    const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });
    const renderMenu = (items) => (React__default.createElement(Menu, { className: b('list') }, items.map((item, index) => (React__default.createElement(MenuItem, Object.assign({ key: index }, item, { className: b('menu-item', item.className) }))))));
    const shouldRenderLogo = view !== 'clear' && Boolean(logo);
    return (React__default.createElement("footer", { className: b({ mobile: true, 'with-divider': withDivider, view }, className) },
        React__default.createElement("div", { className: b('menu', { measured }), ref: menuContainerRef },
            visibleItems.length > 0 && renderMenu(visibleItems),
            hiddenItems.length > 0 && (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(Button, { view: "flat-secondary", size: "l", onClick: handleOpenMoreItemsMenu, title: moreButtonTitle },
                    React__default.createElement(Icon, { data: Ellipsis, size: 16 })),
                React__default.createElement(Sheet, { id: modalId, visible: moreItemsMenuVisible, className: b('modal'), contentClassName: b('modal-content'), onClose: handleCloseMoreItemsMenu }, renderMenu(hiddenItems))))),
        React__default.createElement("div", { className: b('bottom-row') },
            React__default.createElement("small", { className: b('copyright') }, copyright),
            shouldRenderLogo && (React__default.createElement("div", { className: logoWrapperClassName },
                React__default.createElement(Logo, Object.assign({}, logo)))))));
};

export { MobileFooter };
//# sourceMappingURL=Footer.js.map
