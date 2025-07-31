<!--GITHUB_BLOCK-->

## HotkeysPanel

<!--/GITHUB_BLOCK-->

A navigation panel for hotkeys documentation.
The panel displays a set of hotkeys for your application with a description of their purpose.

```ts
import {HotkeysPanel} from '@gravity-ui/navigation';
```

### PropTypes

| Property             | Type                                 | Required | Default                                                                                                             | Description                                                                                                                                 |
| :------------------- | :----------------------------------- | :------: | :------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| hotkeys              | `Array`                              |   yes    |                                                                                                                     | List of hotkey groups                                                                                                                       |
| title                | `ReactNode`                          |          |                                                                                                                     | The panel title                                                                                                                             |
| togglePanelHotkey    | `String`                             |          |                                                                                                                     | The panel open hotkey                                                                                                                       |
| visible              | `Boolean`                            |   yes    |                                                                                                                     | Whether drawer visible or not                                                                                                               |
| onClose              | `Function`                           |          |                                                                                                                     | Close drawer handler                                                                                                                        |
| filterable           | `Boolean`                            |          | true                                                                                                                | Whether show search input or not                                                                                                            |
| filterPlaceholder    | `String`                             |          |                                                                                                                     | Search input placeholder                                                                                                                    |
| filterClassName      | `String`                             |          |                                                                                                                     | Search input class name                                                                                                                     |
| leftOffset           | `Number/String`                      |          | 0                                                                                                                   | Drawer left offset                                                                                                                          |
| topOffset            | `Number/String`                      |          | 0                                                                                                                   | Drawer top offset                                                                                                                           |
| emptyState           | `ReactNode`                          |          |                                                                                                                     | No search results placeholder (deprecated, use emptyScreenProps instead)                                                                    |
| emptyScreenProps     | `Partial<PlaceholderContainerProps>` |          | { title: "Nothing found", description: "Change the search terms", size: "m", align: "center", direction: "column" } | No search results empty screen props (https://preview.yandexcloud.dev/uikit/?path=/docs/components-data-display-placeholdercontainer--docs) |
| className            | `String`                             |          |                                                                                                                     | Drawer class name                                                                                                                           |
| drawerItemClassName  | `String`                             |          |                                                                                                                     | Drawer item class name                                                                                                                      |
| titleClassName       | `String`                             |          |                                                                                                                     | Title class name                                                                                                                            |
| itemContentClassName | `String`                             |          |                                                                                                                     | List item content class name                                                                                                                |
| listClassName        | `String`                             |          |                                                                                                                     | List class name                                                                                                                             |

And all the `List` PropTypes, but not `items` and filter props (you can find them [here](https://github.com/gravity-ui/uikit/blob/main/src/components/List/README.md))

## CSS API

| Name                                 | Description                       | Default |
| :----------------------------------- | :-------------------------------- | :-----: |
| `--hotkeys-panel-width`              | The width of the panel            | `400px` |
| `--hotkeys-panel-vertical-padding`   | The panel top and bottom paddings | `18px`  |
| `--hotkeys-panel-horizontal-padding` | The panel left and right paddings | `24px`  |

### Usage

See storybook example `src/components/HotkeysPanel/__stories__/HotkeysPanelShowcase`.
