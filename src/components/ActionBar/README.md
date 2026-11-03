<!--GITHUB_BLOCK-->

# ActionBar

<!--/GITHUB_BLOCK-->

The component is a flexible horizontal bar that provides a standardized layout for arranging navigation elements, actions, and informational content within an application. It serves as a container for organizing UI elements like breadcrumbs, buttons, and dropdown menus into defined sections and groups.

<!--GITHUB_BLOCK-->

## Usage

```typescript jsx
import {Breadcrumbs, Button} from '@gravity-ui/uikit';
import {ActionBar} from '@gravity-ui/navigation';

function Page() {
  return (
    <ActionBar aria-label="Actions bar">
      <ActionBar.Section>
        <ActionBar.Group>
          <ActionBar.Item>
            <Breadcrumbs showRoot onAction={() => {}}>
              <Breadcrumbs.Item key="0">Root Item</Breadcrumbs.Item>
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

<!--/GITHUB_BLOCK-->

The `ActionBar` provides several nested components that work together to create a structured layout: `ActionBar.Section`, `ActionBar.Group`, `ActionBar.Item`, `ActionBar.Separator`.

## Properties

| Name       | Description                                |         Type          | Default |
| :--------- | :----------------------------------------- | :-------------------: | :-----: |
| aria-label | HTML `aria-label` attribute                |       `string`        |         |
| className  | HTML `class` attribute                     |       `string`        |         |
| style      | HTML `style` attribute                     | `React.CSSProperties` |         |
| qa         | `data-qa` HTML attribute, used for testing |       `string`        |         |

## ActionBar.Section

Decorative component to visually separate different kinds of navigation.
There is two kinds of sections presented — `primary` and `secondary`. We recommend an app to have at least `primary`
section. `secondary` could be used for app specific controls, that should be accented with smaller paddings and
horizontal separator from `primary` section.

### Properties

| Name      | Description                                      |            Type            |   Default   |
| :-------- | :----------------------------------------------- | :------------------------: | :---------: |
| type      | Type specifies the visual styling of the section | `"primary"`, `"secondary"` | `"primary"` |
| className | HTML `class` attribute                           |          `string`          |             |
| style     | HTML `style` attribute                           |   `React.CSSProperties`    |             |
| qa        | `data-qa` HTML attribute, used for testing       |          `string`          |             |

<!--GITHUB_BLOCK-->

```tsx
import {Breadcrumbs, Button} from '@gravity-ui/uikit';
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
        <Breadcrumbs showRoot onAction={() => {}}>
          <Breadcrumbs.Item key="0">Wiki Main Page</Breadcrumbs.Item>
          <Breadcrumbs.Item key="1">Wiki Article</Breadcrumbs.Item>
        </Breadcrumbs>
      </ActionBar.Item>
    </ActionBar.Group>
  </ActionBar.Section>
</ActionBar>;
```

<!--/GITHUB_BLOCK-->

## ActionBar.Group

Groups organize `ActionBar.Item` within a section and control their alignment.

### Properties

| Name             | Description                                                                                                                            |                                      Type                                       | Default |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------------------------------------: | :-----: |
| pull             | Controls the alignment of the group                                                                                                    | `"left"`, `"left-grow"`, `"right"`, `"right-grow"`, `"center"`, `"center-grow"` |         |
| stretchContainer | Set `flex-grow: 1` for Group, so that content collapsing to the available width (for example, uikit `Breadcrumbs`) gets the free space |                                    `boolean`                                    |         |
| className        | HTML `class` attribute                                                                                                                 |                                    `string`                                     |         |
| style            | HTML `style` attribute                                                                                                                 |                              `React.CSSProperties`                              |         |
| qa               | `data-qa` HTML attribute, used for testing                                                                                             |                                    `string`                                     |         |

## ActionBar.Item

Container for UI elements like buttons, breadcrumbs or other components must be in `ActionBar.Group`. The component adds margins between items.

### Properties

| Name      | Description                                |         Type          | Default |
| :-------- | :----------------------------------------- | :-------------------: | :-----: |
| spacing   | Enable spacing with previous item          |       `boolean`       | `true`  |
| className | HTML `class` attribute                     |       `string`        |         |
| style     | HTML `style` attribute                     | `React.CSSProperties` |         |
| qa        | `data-qa` HTML attribute, used for testing |       `string`        |         |

## ActionBar.Separator

Visual divider that can be placed between items in a group to separate them visually.

<!--GITHUB_BLOCK-->

### Example

```typescript jsx
import {Breadcrumbs, Button} from '@gravity-ui/uikit';
import {ActionBar} from '@gravity-ui/navigation';

function Page() {
  return (
    <ActionBar aria-label="Actions bar">
      <ActionBar.Section>
        <ActionBar.Group pull="right">
          <ActionBar.Item>
            <Button>Do something</Button>
          </ActionBar.Item>

          <ActionBar.Separator />

          <ActionBar.Item>
            <Button>Do something</Button>
          </ActionBar.Item>
        </ActionBar.Group>
      </ActionBar.Section>
    </ActionBar>
  );
}
```

<!--/GITHUB_BLOCK-->
