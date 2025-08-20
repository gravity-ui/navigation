Чек-лист проверки визуальных компонентов `@gravity-ui/navigation` в Next.js (SSR)

- [x] AsideHeader
- [x] PageLayout / PageLayoutAside / AsideFallback
- [x] CompositeBar (menu + subheader) / Item / MultipleTooltip
- [x] ActionBar (Section/Group/Item/Separator)
- [x] Drawer
- [x] Title
- [x] HotkeysPanel
- [x] Settings (включая SettingsMenu/SettingsMenuMobile)
- [x] Footer (desktop/mobile) / FooterItem / MenuItem
- [x] MobileHeader (Burger/BurgerMenu/BurgerCompositeBar)
- [x] Logo / MobileLogo
- [x] AllPagesPanel
- [x] TopAlert

Критерии:

- Корректная верстка и выравнивание.
- Стили подгружаются автоматически по компоненту (без глобального импорта), отсутствует FOUC в SSR.
- Нет «сырых» классов вида `gn-...` без модульного префикса в итоговом HTML.
