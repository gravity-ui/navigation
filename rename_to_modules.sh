#!/bin/bash

# List of component SCSS files to rename
files=(
    "src/components/ActionBar/ActionBar.scss"
    "src/components/ActionBar/Group/ActionBarGroup.scss"
    "src/components/ActionBar/Item/ActionBarItem.scss"
    "src/components/ActionBar/Section/ActionBarSection.scss"
    "src/components/ActionBar/Separator/ActionBarSeparator.scss"
    "src/components/AllPagesPanel/AllPagesListItem/AllPagesListItem.scss"
    "src/components/AllPagesPanel/AllPagesPanel.scss"
    "src/components/AsideHeader/AsideHeader.scss"
    "src/components/AsideHeader/components/CollapseButton/CollapseButton.scss"
    "src/components/CompositeBar/CompositeBar.scss"
    "src/components/CompositeBar/HighlightedItem/HighlightedItem.scss"
    "src/components/CompositeBar/Item/Item.scss"
    "src/components/CompositeBar/MultipleTooltip/MultipleTooltip.scss"
    "src/components/Drawer/Drawer.scss"
    "src/components/Footer/MenuItem/MenuItem.scss"
    "src/components/Footer/desktop/Footer.scss"
    "src/components/Footer/mobile/Footer.scss"
    "src/components/FooterItem/FooterItem.scss"
    "src/components/HotkeysPanel/HotkeysPanel.scss"
    "src/components/Logo/Logo.scss"
    "src/components/MobileHeader/Burger/Burger.scss"
    "src/components/MobileHeader/BurgerMenu/BurgerCompositeBar/BurgerCompositeBar.scss"
    "src/components/MobileHeader/BurgerMenu/BurgerMenu.scss"
    "src/components/MobileHeader/FooterItem/FooterItem.scss"
    "src/components/MobileHeader/MobileHeader.scss"
    "src/components/MobileHeader/OverlapPanel/OverlapPanel.scss"
    "src/components/MobileLogo/MobileLogo.scss"
    "src/components/Settings/Settings.scss"
    "src/components/Settings/SettingsMenu/SettingsMenu.scss"
    "src/components/Settings/SettingsMenuMobile/SettingsMenuMobile.scss"
    "src/components/Title/Title.scss"
    "src/components/TopAlert/TopAlert.scss"
)

# Rename files
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        new_file="${file%.scss}.module.scss"
        echo "Renaming $file to $new_file"
        git mv "$file" "$new_file"
    fi
done

echo "All files renamed successfully!"