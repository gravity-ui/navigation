import React__default from 'react';
import { Tabs } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';

const b = block('settings-menu-mobile');
const SettingsMenuMobile = ({ items, onChange, activeItemId, className, }) => {
    const ref = React__default.useRef(null);
    const tabItems = React__default.useMemo(() => {
        const tabItems = [];
        items.forEach((firstLevelItem) => {
            if ('groupTitle' in firstLevelItem) {
                tabItems.push(...firstLevelItem.items.map(({ id, title, disabled, withBadge }) => ({
                    id,
                    title,
                    disabled,
                    className: b('item', { badge: withBadge }),
                })));
            }
            else {
                const { id, title, disabled, withBadge } = firstLevelItem;
                tabItems.push({ id, title, disabled, className: b('item', { badge: withBadge }) });
            }
        });
        return tabItems;
    }, [items]);
    const handleTouchMove = (e) => {
        e.stopPropagation();
    };
    return (React__default.createElement("div", { ref: ref, onTouchMove: handleTouchMove },
        React__default.createElement(Tabs, { items: tabItems, className: b(null, className), size: "l", activeTab: activeItemId, onSelectTab: onChange })));
};

export { SettingsMenuMobile };
//# sourceMappingURL=SettingsMenuMobile.js.map
