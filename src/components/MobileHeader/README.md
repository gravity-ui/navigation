### MobileHeader

Header for Mobile navigation. MobileHeader provides maintaining Panels except for Modals.

Includes auxiliary `MobileHeaderFooterItem` component.

### Usage

See storybook example `src/components/MobileHeader/__stories__/MobileHeaderShowcase`.

#### onEvent prop

[onEvent](https://github.com/gravity-ui/navigation/blob/32c6a6f58e0307745e92b041b3d96517e57589c1/src/components/MobileHeader/MobileHeader.tsx#L41) handles MobileHeader inner events.

**Custom events**

You can initiate the event via `CustomEvent`. Support values:

- `MOBILE_PANEL_TOGGLE`
- `MOBILE_PANEL_OPEN`
- `MOBILE_PANEL_CLOSE`
- `MOBILE_BURGER_OPEN`
- `MOBILE_BURGER_CLOSE`

Panel events in constant [MOBILE_HEADER_EVENT_NAMES](https://github.com/gravity-ui/navigation/blob/main/src/components/MobileHeader/constants.ts#L8-L12)

##### Examples

**Simple event, open burger**

```js
const customEvent = new CustomEvent('MOBILE_BURGER_OPEN');
const navRef = React.useRef < HTMLDivElement > null;
navRef?.current?.dispatchEvent(customEvent);
```

**Panel event, open custom panel**

```js
import {getMobileHeaderCustomEvent, MOBILE_HEADER_EVENT_NAMES} from '@gravity-ui/navigation';

const customEvent = getMobileHeaderCustomEvent(MOBILE_HEADER_EVENT_NAMES.closeEvent, {
  panelName: 'user',
});

const navRef = React.useRef < HTMLDivElement > null;
navRef?.current?.dispatchEvent(customEvent);

const customEvent2 = getMobileHeaderCustomEvent('MOBILE_PANEL_TOGGLE', {panelName: 'user'});
navRef?.current?.dispatchEvent(customEvent2);
```

Available panelName

1. 'burger'
2. `id` of element [panelItems prop](https://github.com/gravity-ui/navigation/blob/main/src/components/MobileHeader/MobileHeader.tsx#L38C5-L38C15)
