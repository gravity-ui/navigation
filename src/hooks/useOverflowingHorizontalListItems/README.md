# useOverflowingHorizontalListItems

A hook for determining which horizontal list items stay visible and which collapse into an overflow "more" dropdown.

```tsx
import {useOverflowingHorizontalListItems} from '@gravity-ui/navigation';
```

## Properties

| Property        | Type                     | Required | Default | Description              |
| :-------------- | :----------------------- | :------: | :------ | :----------------------- |
| containerRef    | `RefObject<HTMLElement>` |          |         | List container ref       |
| items           | `Array`                  |          |         | List items               |
| itemSelector    | `String`                 |          |         | List item selector       |
| moreButtonWidth | `Number`                 |          |         | The width of more button |
