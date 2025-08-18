<!--GITHUB_BLOCK-->

# AllPagesPanel

<!--/GITHUB_BLOCK-->

A navigation panel for managing and organizing application pages in the middle (menuItems) section of `AsideHeader` component. Panel provides drag-and-drop reordering, visibility toggles, pin/unpin and category grouping of menu items.

<!--GITHUB_BLOCK-->

## Usage

```tsx
import React from 'react';
import {AsideHeader, type AsideHeaderProps} from '@gravity-ui/navigation';

const DEFAULT_MENU_ITEMS: AsideHeaderProps['menuItems'] = [
  {item: {id: 'home', title: 'Home', icon: 'home'}},
  {item: {id: 'analytics', title: 'Analytics', icon: 'chart'}},
  {item: {id: 'settings', title: 'Settings', icon: 'gear'}},
];

const Navigation: React.FC<React.PropsWithChildren> = ({children}) => {
  const {defaultMenuItems, menuItems, setMenuItems} = useMenuItems();

  return (
    <AsideHeader
      className={b()}
      logo={{
        icon: GravityLogo,
        iconSize: 30,
        text: 'Gravity App',
        href: '#',
      }}
      menuItems={menuItems}
      compact={compact}
      onChangeCompact={setCompact}
      renderContent={() => children}
      // All pages
      defaultMenuItems={defaultMenuItems}
      editMenuProps={{enableSorting: true}}
      onMenuItemsChanged={setMenuItems}
    />
  );
};

const useMenuItems = () => {
  const location = useLocation();

  const [menuItems, setMenuItems] = React.useState(DEFAULT_MENU_ITEMS);

  const currentMenuItems = menuItems.map<AsideHeaderItem>((item, index) => {
    if ('type' in item || index > 5) {
      return item;
    }

    return {
      ...item,
      current: (item.link || '') === location.pathname,
    };
  });

  return {defaultMenuItems: DEFAULT_MENU_ITEMS, menuItems: currentMenuItems, setMenuItems};
};
```

<!--/GITHUB_BLOCK-->

## Properties of `AsideHeader`

| Name               | Description                                                                    |                                                             Type                                                             | Default |
| :----------------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------: | :-----: |
| defaultMenuItems   | Default items in the navigation middle section                                 | [`Array<AsideHeaderItem>`](https://github.com/gravity-ui/navigation/blob/main/src/components/AsideHeader/README.md#menuitem) |  `[]`   |
| menuItems          | Modifying items in the navigation middle section                               | [`Array<AsideHeaderItem>`](https://github.com/gravity-ui/navigation/blob/main/src/components/AsideHeader/README.md#menuitem) |  `[]`   |
| editMenuProps      | desc                                                                           |                                                            `type`                                                            |         |
| onMenuItemsChanged | Callback will be called when updating list of the menuItems in `AllPagesPanel` |                                          `(items: Array<AsideHeaderItem>) => void`                                           |         |

### `EditMenuProps`

Provides settings and callbacks for managing panel and menu items in the `AsideHeader`. Callbacks are optional, you can managing with `AsideHeader.onMenuItemsChanged` prop.

| Name                     | Description                                              |                                     Type                                      | Default |
| :----------------------- | :------------------------------------------------------- | :---------------------------------------------------------------------------: | :-----: |
| enableSorting            | Enable sorting functionality in the panel                |                                   `boolean`                                   |         |
| onOpenEditMode           | Callback triggered when the edit mode is enabled         |                                 `() => void`                                  |         |
| onToggleMenuItem         | Callback triggered when the menu item visible is toggled |                   `(changedItem: AsideHeaderItem) => void`                    |         |
| onResetSettingsToDefault | Callback triggered when settings are reset to default    |                                 `() => void`                                  |         |
| onChangeItemsOrder       | Callback triggered when the order of items is changed    | `(changedItem: AsideHeaderItem, oldIndex: number, newIndex: number) => void;` |         |
