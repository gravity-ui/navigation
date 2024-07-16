# Drawer

```tsx
import {Drawer} from '@gravity-ui/navigation';
```

The Drawer component is a versatile interface element used in web applications to provide a sliding panel that emerges from the edge of the screen. This panel can house navigations, tools, or additional content. The component is implemented using React and CSS transitions for smooth animations.

## Usage

Here is a simple example of how to use the Drawer component:

```tsx
import React from 'react';
import {Drawer, DrawerItem} from '@gravity-ui/navigation';

const App = () => {
  const [isVisible, setVisible] = React.useState(false);

  return (
    <div>
      <button onClick={() => setVisible(true)}>Open Drawer</button>
      <Drawer onEscape={() => setVisible(false)} onVeilClick={() => setVisible(false)}>
        <DrawerItem id="item1" visible={isVisible}>
          <p>Content of the drawer</p>
        </DrawerItem>
      </Drawer>
    </div>
  );
};

export default App;
```

## Components

The Drawer module consists of two primary components: `Drawer` and `DrawerItem`.

### `DrawerItem` Props

| Name      | Description                                                                             |       Type        | Default |
| :-------- | :-------------------------------------------------------------------------------------- | :---------------: | :-----: |
| id        | Unique identifier for the drawer item.                                                  |     `string`      |         |
| children  | Content to be displayed within the drawer item, preferable over the deprecated content. | `React.ReactNode` |         |
| content   | (deprecated) use children. Content to be displayed within the drawer item.              | `React.ReactNode` |         |
| visible   | Determines whether the drawer item is visible or hidden.                                |     `boolean`     |         |
| direction | Specifies the direction from which the drawer should slide in (left or right).          | `DrawerDirection` | `left`  |
| className | HTML `class` attribute                                                                  |     `string`      |         |

### `Drawer` Props

| Name              | Description                                                                                      |                Type                 | Default |
| :---------------- | :----------------------------------------------------------------------------------------------- | :---------------------------------: | :-----: |
| children          | Child components to be rendered within the drawer.                                               |   `'DrawerChild' 'DrawerChild[]'`   |         |
| preventScrollBody | Optional flag to prevent the body from scrolling when the drawer is open.                        |              `boolean`              | `true`  |
| className         | Optional additional class names to style the drawer component.                                   |              `string`               |         |
| style             | Optional inline styles to be applied to the drawer component.                                    |        `React.CSSProperties`        |         |
| onVeilClick       | Optional callback function that is called when the veil (overlay) is clicked.                    | `(event: React.MouseEvent) => void` |         |
| onEscape          | Optional callback function that is called when the escape key is pressed, if the drawer is open. |            `() => void`             |         |
