import React__default, { useRef, useMemo } from 'react';
import { Menu, DropdownMenu } from '@gravity-ui/uikit';
import { useOverflowingHorizontalListItems } from '../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.js';
import { Logo } from '../../Logo/Logo.js';
import { block } from '../../utils/cn.js';
import { MenuItem } from '../MenuItem/MenuItem.js';
import { moreItemsPopupProps } from './constants/moreItemsPopupProps.js';

const b = block('footer');
const Footer = ({ className, menuItems: providedMenuItems, withDivider, moreButtonTitle, onMoreButtonClick, view = 'normal', logo, logoWrapperClassName, copyright, }) => {
    var _a;
    const menuContainerRef = useRef(null);
    const menuItems = view === 'clear' ? undefined : providedMenuItems;
    const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });
    const moreButtonProps = useMemo(() => ({
        title: moreButtonTitle,
    }), [moreButtonTitle]);
    const dropdownMenuItems = useMemo(() => hiddenItems.map((item) => (Object.assign(Object.assign({}, item), { action: item.onClick }))), [hiddenItems]);
    const shouldRenderLogo = view !== 'clear' && Boolean(logo);
    const shouldRenderMenu = ((_a = menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) !== null && _a !== void 0 ? _a : 0) > 0;
    return (React__default.createElement("footer", { className: b({ desktop: true, 'with-divider': withDivider, view }, className) },
        shouldRenderMenu && (React__default.createElement("div", { className: b('menu', { measured }), ref: menuContainerRef },
            visibleItems.length > 0 && (React__default.createElement(Menu, { className: b('list') }, visibleItems.map((item, index) => (React__default.createElement(MenuItem, Object.assign({ key: index }, item, { className: b('menu-item', item.className) })))))),
            dropdownMenuItems.length > 0 && (React__default.createElement(DropdownMenu, { items: dropdownMenuItems, switcherWrapperClassName: b('more-button'), popupProps: moreItemsPopupProps, defaultSwitcherProps: moreButtonProps, onSwitcherClick: onMoreButtonClick })))),
        React__default.createElement("div", { className: b('right') },
            React__default.createElement("small", { className: b('copyright', { small: !(menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) }) }, copyright),
            shouldRenderLogo && (React__default.createElement("div", { className: logoWrapperClassName },
                React__default.createElement(Logo, Object.assign({}, logo)))))));
};

export { Footer };
//# sourceMappingURL=Footer.js.map
