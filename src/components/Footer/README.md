## Footer and MobileFooter

The page footer components. Use `Footer` for the desktop version and `MobileFooter` for the mobile version.
Both components have the same properties.

### PropTypes

| Property                                                                                 | Type                             | Required | Default | Description                   |
| :--------------------------------------------------------------------------------------- | :------------------------------- | :------: | :------ | :---------------------------- |
| className                                                                                | `String`                         |          |         | Footer class name             |
| [menuItems](https://github.com/gravity-ui/uikit/tree/main/src/components/Menu)           | `FooterMenuItem[]`               |          |         | List of footer menu items     |
| withDivider                                                                              | `Boolean`                        |          |         | Show top border on the footer |
| moreButtonTitle                                                                          | `String`                         |          |         | The more items button title   |
| onMoreButtonClick                                                                        | `MouseEventHandler<HTMLElement>` |          |         | The more button click handler |
| [view](#view)                                                                            | `normal` or `clear`              |          |         | The footer view               |
| [logo](https://preview.gravity-ui.com/navigation/?path=/story/components-logo--showcase) | `LogoProps`                      |          |         | The service logo properties   |
| logoWrapperClassName                                                                     | `string`                         |          |         | The logo wrapper class name   |
| copyright                                                                                | `string`                         |          |         | The copyright                 |

### view

- normal - white background and all the configured elements
- clear - transparent background and only the copyright

### Usage

See demos

- Desktop: `src/components/Footer/desktop/__stories__/FooterShowcase.tsx`,
- Mobile: `src/components/Footer/mobile/__stories__/MobileFooterShowcase.tsx`.

### Examples

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
