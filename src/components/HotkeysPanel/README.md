## HotkeysPanel

A panel for hotkeys documentation

### PropTypes

| Property          | Type            | Required | Default | Description                      |
| :---------------- | :-------------- | :------: | :------ | :------------------------------- |
| className         | `String`        |          |         | Drawer class                     |
| visible           | `Boolean`       |   yes    |         | Whether drawer visible or not    |
| onClose           | `Function`      |          |         | close drawer handler             |
| leftOffset        | `Number/String` |          | 0       | drawer left offset               |
| topOffset         | `Number/String` |          | 0       | drawer top offset                |
| preventScrollBody | `Boolean`       |          | true    | Disable body scroll when visible |
| hotkeys           | `Array`         |   yes    |         | List of hotkey groups            |

And all the `List` PropTypes, but not `items` (you can find them [here](https://github.com/gravity-ui/uikit/blob/main/src/components/List/README.md))

### Usage

See storybook example `src/components/HotkeysPanel/__stories__/HotkeysPanelShowcase`.
