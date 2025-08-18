Чек-лист проверки визуальных компонентов `@gravity-ui/navigation` в Next.js (SSR)

- [x] AsideHeader
- [ ] PageLayout / PageLayoutAside / AsideFallback
- [ ] CompositeBar (menu + subheader) / Item / MultipleTooltip
- [x] ActionBar (Section/Group/Item/Separator)
- [x] Drawer
- [ ] Title
- [ ] HotkeysPanel
- [ ] Settings (включая SettingsMenu/SettingsMenuMobile)
- [ ] Footer (desktop/mobile) / FooterItem / MenuItem
- [ ] MobileHeader (Burger/BurgerMenu/BurgerCompositeBar)
- [ ] Logo / MobileLogo

Критерии:
- Корректная верстка и выравнивание.
- Стили подгружаются автоматически по компоненту (без глобального импорта), отсутствует FOUC в SSR.
- Нет «сырых» классов вида `gn-...` без модульного префикса в итоговом HTML.

