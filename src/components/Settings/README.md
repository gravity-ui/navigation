### Settings

The components provides layouting functionality of settings panel with the following features:

- single-level and two-level grouping of items
- filtering of the panel's content by headers of items
- displaying of loading status and content

### PropTypes

#### Settings

| Property          | Type               | Required | Default            | Description                                |
| :---------------- | :----------------- | :------: | :----------------- | :----------------------------------------- |
| loading           | boolean            |          |                    | Flag of loading status                     |
| renderLoading     | Function           |          |                    | content for loading status                 |
| renderNotFound    | Function           |          |                    | Empty panel content                        |
| initialPage       | string             |          |                    | Inititial page in `/groupId/pageId` format |
| view              | 'normal', 'mobile' |          | 'normal'           | Change view for Mobile                     |
| onPageChange      | Function           |          |                    | Page change handler                        |
| onClose           | Function           |          |                    | Settings close handler                     |
| title             | string             |          | 'Settings'         | Page title                                 |
| filterPlaceholder | string             |          | 'Search settings'  | Filter placeholder text                    |
| emptyPlaceholder  | string             |          | 'No results found' | Filter empty text                          |

#### Settings.Group

| Property   | Type   | Required | Default | Description        |
| :--------- | :----- | :------: | :------ | :----------------- |
| id         | string |          |         | Unique id of group |
| groupTitle | string |   true   |         | Header of group    |

#### Settings.Page

| Property | Type      | Required | Default | Description                  |
| :------- | :-------- | :------: | :------ | :--------------------------- |
| id       | string    |          |         | Unique id of page in a group |
| title    | string    |   true   |         | Title of page                |
| icon     | IconProps |   true   |         | Properties of icon of page   |

#### Settings.Section

| Property  | Type      | Required | Default | Description                                                                   |
| :-------- | :-------- | :------: | :------ | :---------------------------------------------------------------------------- |
| title     | string    |   true   |         | Title of section                                                              |
| header    | ReactNode |          |         | Header of section                                                             |
| withBadge | boolean   |          |         | Show badge on a section and menu                                              |
| showTitle | boolean   |          |         | Show section title. Prop is needed to hide title in simple settings on Mobile |
| onlyChild | boolean   |          |         | Hide title if only one Settings.Section exists on page.                       |

#### Settings.Item

| Property             | Type            | Required | Default  | Description                                                |
| :------------------- | :-------------- | :------: | :------- | :--------------------------------------------------------- |
| title                | string          |   true   |          | Title of item                                              |
| renderTitleComponent | Function        |          |          | Cusomt header of                                           |
| align                | 'top', 'center' |          | 'center' | Item alignment                                             |
| mode                 | 'row'           |          |          | Layout for mobile. Title and control will be placed in row |
| description          | ReactNode       |          |          | Description of item                                        |

### Usage

See storybook example `src/components/Settings/__stories__/SettingsDemo` for desktop and `src/components/Settings/__stories__/SettingsMobileDemo` for mobile.

### Examples

One-level settings example:

```jsx
<Settings>
  <Settings.Page title="Appearance">...</Settings.Page>
  <Settings.Page title="Notifications">...</Settings.Page>
</Settings>
```

Two-level settings example:
_Note:_ `Settings` with `view=mobile` groups `Settings.Group` are ignored.

```jsx
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

```jsx
<Settings.Page title="Features" icon={'...'}>
  <Settings.Section title="Common">
    <Settings.Item title="Default VCS">...</Settings.Item>
    <Settings.Item title="Search root">...</Settings.Item>
  </Settings.Section>
  <Settings.Section title="Beta functionality">...</Settings.Section>
</Settings.Page>
```
