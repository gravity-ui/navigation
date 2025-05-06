<!--GITHUB_BLOCK-->

## Settings

<!--/GITHUB_BLOCK-->

The components provides layouting functionality of settings panel with the following features:

- single-level and two-level grouping of items
- filtering of the panel's content by headers of items
- displaying of loading status and content

<!--GITHUB_BLOCK-->

## Usage

One-level settings example:

```tsx
<Settings>
  <Settings.Page title="Appearance">...</Settings.Page>
  <Settings.Page title="Notifications">...</Settings.Page>
</Settings>
```

Two-level settings example:
_Note:_ `Settings` with `view=mobile` groups `Settings.Group` are ignored.

```tsx
<Settings>
  <Settings.Group groupTitle="My service">
    <Settings.Page title="Appearance">...</Settings.Page>
    <Settings.Page title="Notifications">...</Settings.Page>
  </Settings.Group>
  <Settings.Group groupTitle="General">
    <Settings.Page title="Appearance">...</Settings.Page>
    <Settings.Page title="Notifications">...</Settings.Page>
  </Settings.Group>
</Settings>
```

Pages with sections example:

```tsx
<Settings.Page title="Features" icon={'...'}>
  <Settings.Section title="Common">
    <Settings.Item title="Default VCS">...</Settings.Item>
    <Settings.Item title="Search root">...</Settings.Item>
  </Settings.Section>
  <Settings.Section title="Beta functionality">...</Settings.Section>
</Settings.Page>
```

<!--/GITHUB_BLOCK-->

## Properties

| Name              | Description                                | Type                         | Default            |
| :---------------- | :----------------------------------------- | :--------------------------- | :----------------- |
| loading           | Flag of loading status                     | `boolean`                    |                    |
| renderLoading     | content for loading status                 | `() => React.ReactNode`      |                    |
| renderNotFound    | Empty panel content                        | `() => React.ReactNode`      |                    |
| initialPage       | Inititial page in `/groupId/pageId` format | `string`                     |                    |
| view              | Change view for Mobile                     | `"normal"`, `"mobile"`       | `"normal"`         |
| onPageChange      | Page change handler                        | `(newPage?: string) => void` |                    |
| onClose           | Settings close handler                     | `() => void`                 |                    |
| title             | Page title                                 | `string`                     | 'Settings'         |
| filterPlaceholder | Filter placeholder text                    | `string`                     | 'Search settings'  |
| emptyPlaceholder  | Filter empty text                          | `string`                     | 'No results found' |

## Settings.Group

Optional level for organizing related pages, e.g. "General" vs "Application specific".

### Properties

| Name       | Description        | Type     | Default |
| :--------- | :----------------- | :------- | :------ |
| id         | Unique id of group | `string` |         |
| groupTitle | Header of group    | `string` |         |

## Settings.Page

Collection of related settings sections, e.g. "Appearance" in General group.

### Properties

| Name  | Description                  | Type                                                                                        | Default |
| :---- | :--------------------------- | :------------------------------------------------------------------------------------------ | :------ |
| id    | Unique id of page in a group | `string`                                                                                    |         |
| title | Title of page                | `string`                                                                                    |         |
| icon  | Properties of icon of page   | [`IconProps`](https://github.com/gravity-ui/uikit/tree/main/src/components/Icon#properties) |         |

## Settings.Section

Category of related settings, e.g. "Theme settings" in Appearance page.

### Properties

| Name      | Description                                                                   | Type              | Default |
| :-------- | :---------------------------------------------------------------------------- | :---------------- | :------ |
| title     | Title of section                                                              | `string`          |         |
| header    | Header of section                                                             | `React.ReactNode` |         |
| withBadge | Show badge on a section and menu                                              | `boolean`         |         |
| hideTitle | Hide section title. Prop is needed to hide title in simple settings on Mobile | `boolean`         |         |

## Settings.Item

Individual setting with a title and control component.
⚠️ In case with only one `Settings.Item` in `Settings.Section` the title is not shown.

### Properties

| Name                 | Description                                                | Type                                                      | Default    |
| :------------------- | :--------------------------------------------------------- | :-------------------------------------------------------- | :--------- |
| title                | Title of item                                              | `string`                                                  |            |
| renderTitleComponent | Cusomt header of                                           | `(highlightedTitle?: React.ReactNode) => React.ReactNode` |
| align                | Item alignment                                             | `"top"`, `"center"`                                       | `"center"` |
| mode                 | Layout for mobile. Title and control will be placed in row | `"row"`                                                   |            |
| description          | Description of item                                        | `React.ReactNode`                                         |            |
