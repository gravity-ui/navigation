## Footer и MobileFooter

Компоненты футера страницы. Для десктопной версии используется `Footer`, а для мобильной — `MobileFooter`.
Оба компонента имеют одинаковые свойства.

### PropTypes

| Свойство                                                                                 | Тип                              | Обязательное | Значение по умолчанию | Описание                                            |
| :--------------------------------------------------------------------------------------- | :------------------------------- | :----------: | :-------------------- | :-------------------------------------------------- |
| className                                                                                | `String`                         |              |                       | Имя класса футера.                                  |
| [menuItems](https://github.com/gravity-ui/uikit/tree/main/src/components/Menu)           | `FooterMenuItem[]`               |              |                       | Список элементов меню футера.                       |
| withDivider                                                                              | `Boolean`                        |              |                       | Отображает верхнюю границу футера.                  |
| moreButtonTitle                                                                          | `String`                         |              |                       | Заголовок кнопки развертывания элементов.           |
| onMoreButtonClick                                                                        | `MouseEventHandler<HTMLElement>` |              |                       | Обработчик клика по кнопке развертывания элементов. |
| view                                                                                     | `normal` или `clear`             |              |                       | Вид футера.                                         |
| [logo](https://preview.gravity-ui.com/navigation/?path=/story/components-logo--showcase) | `LogoProps`                      |              |                       | Свойства логотипа сервиса.                          |
| logoWrapperClassName                                                                     | `string`                         |              |                       | Имя класса обертки логотипа.                        |
| copyright                                                                                | `string`                         |              |                       | Авторские права.                                    |

### `View` (вид)

- `normal` — белый фон и все настроенные элементы.
- `clear` — прозрачный фон и только авторские права.

### Использование

Демонстрационные примеры:

- Десктопная версия: `src/components/Footer/desktop/__stories__/FooterShowcase.tsx`.
- Мобильная версия: `src/components/Footer/mobile/__stories__/MobileFooterShowcase.tsx`.

### Практические примеры

#### Footer

```tsx
import { Footer } from '@gravity-ui/navigation';

<Footer
    className="page-footer"
    withDivider={false}
    moreButtonTitle="Show more"
    copyright={`@ ${new Date().getFullYear()} "My Service"`}
    logo={{
        icon: logoIcon,
        iconSize: 24,
        text: 'My Service'
    }}
    menuItems={[
        {
            text: 'About Service',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
        {
            text: 'Documentation',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
        {
            text: 'Confidential',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
    ]}
/>

<Footer
    className="page-footer"
    copyright={`@ ${new Date().getFullYear()} "My Service"`}
    view="clear"
/>
```

#### MobileFooter

```tsx
import { MobileFooter } from '@gravity-ui/navigation';

<MobileFooter
    className="page-footer"
    withDivider={false}
    moreButtonTitle="Show more"
    copyright={`@ ${new Date().getFullYear()} "My Service"`}
    logo={{
        icon: logoIcon,
        iconSize: 24,
        text: 'My Service'
    }}
    menuItems={[
        {
            text: 'About Service',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
        {
            text: 'Documentation',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
        {
            text: 'Confidential',
            href: 'https://gravity-ui.com/',
            target: 'blank',
        },
    ]}
/>

<MobileFooter
    className="page-footer"
    copyright={`@ ${new Date().getFullYear()} "My Service"`}
    view="clear"
/>
```
