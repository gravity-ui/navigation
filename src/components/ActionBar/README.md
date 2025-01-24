# ActionBar

Horizontal bar with navigation items.

## Example

```typescript jsx
import {Breadcrumbs, Button} from '@gravity-ui/uikit';
import {ActionBar} from '@gravity-ui/navigation';

function Page() {
  return (
    <ActionBar aria-label="Actions bar">
      <ActionBar.Section>
        <ActionBar.Group pull="left">
          <ActionBar.Item>
            <Breadcrumbs showRoot={true} onAction={(id) => alert(id)}>
              <Breadcrumbs.Item href="/" key="1">
                Root Item
              </Breadcrumbs.Item>
            </Breadcrumbs>
          </ActionBar.Item>
        </ActionBar.Group>

        <ActionBar.Group pull="right">
          <ActionBar.Item>
            <Button>Do something</Button>
          </ActionBar.Item>
        </ActionBar.Group>
      </ActionBar.Section>
    </ActionBar>
  );
}
```

## Components

### ActionBar

Root container for `<ActionBar.Group/>`s.

#### `aria-label`

`string`. It is recommended to add `aria-label` to have screen readers recognize component as
[landmark](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/).

#### `className`

Custom class name for component.

### ActionBar.Section

Decorative component to visually separate different kinds of navigation.

#### `type`

There is two kinds of sections presented -- `primary` and `secondary`. We recommend an app to have at least `primary`
section. `secondary` could be used for app specific controls, that should be accented with smaller paddings and
horizontal separator from `primary` section.

```jsx
import {Button, Breadcrumbs} from '@gravity-ui/uikit';
import {ActionBar} from '@gravity-ui/navigation';

<ActionBar aria-label="Actions bar">
  <ActionBar.Section type="secondary">
    <ActionBar.Group>
      <ActionBar.Item>
        <Button>Toggle Article TOC</Button>
      </ActionBar.Item>
    </ActionBar.Group>
  </ActionBar.Section>

  <ActionBar.Section type="primary">
    <ActionBar.Group>
      <ActionBar.Item>
        <Breadcrumbs onAction={(id) => alert(id)}>
          <Breadcrumbs.Item href="/" key="1">
            Wiki Main Page
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="/" key="2">
            Wiki Article
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </ActionBar.Item>
    </ActionBar.Group>
  </ActionBar.Section>
</ActionBar>;
```

### ActionBar.Item

**Must** be children of `<ActionBar.Group/>`. Container for bar item. This component adds margins between items.

#### `spacing`

`true` by default. When `false` switch off spacing with previous item.

#### `className`

Custom class name for component.

### ActionBar.Group

Group few `ActionBar.Item`.

#### `pull`

Move group to `left`, `left-grow`, `right`, `right-grow` or `center`, `center-grow`.

#### `className`

Custom class name for component.

### ActionBar.Separator

Horizontal separator between `<ActionBar.Item/>`.
