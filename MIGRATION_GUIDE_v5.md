# Navigation v5.0 Migration Guide

## CSS Variables Changes

### New Zone-Based CSS Variables

Navigation v5.0 introduces zone-based CSS variables for more granular control over styling. The navigation is divided into zones: **Top** (header/subheader area), **Main** (navigation groups), and **Bottom** (footer area).

### Top Zone (Subheader) Variables

New CSS variables for styling items in the Top zone (subheader area):

| Variable                                             | Purpose                      | Fallback                                         |
| ---------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-top-decoration-background-color`         | Decoration/backdrop          | `--gn-aside-item-current-background-color`       |
| `--gn-aside-top-divider-color`                       | Divider below top zone       | `--gn-aside-divider-horizontal-color`            |
| `--gn-aside-top-item-icon-color`                     | Icon color                   | `--gn-aside-item-icon-color`                     |
| `--gn-aside-top-item-current-icon-color`             | Active item icon color       | `--gn-aside-item-current-icon-color`             |
| `--gn-aside-top-item-text-color`                     | Text color                   | `--gn-aside-item-text-color`                     |
| `--gn-aside-top-item-current-text-color`             | Active item text color       | `--gn-aside-item-current-text-color`             |
| `--gn-aside-top-item-background-color`               | Background color             | `transparent`                                    |
| `--gn-aside-top-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-top-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-top-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |

### Main Zone (Group Items) Variables

New CSS variables for styling items inside navigation groups:

| Variable                                                    | Purpose                      | Fallback                                         |
| ----------------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-main-background-color`                          | Main area background         | `transparent`                                    |
| `--gn-aside-main-group-item-background-color`               | Group item background        | Semantic value                                   |
| `--gn-aside-main-group-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-main-group-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-main-group-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |
| `--gn-aside-main-group-border-color-hover`                  | Group border on hover        | `--gn-aside-line-vertical-color-hover`           |
| `--gn-aside-main-group-border-color-current`                | Group border when active     | `--gn-aside-current-line-vertical-color`         |

### Bottom Zone (Footer) Variables

New CSS variables for styling the Bottom zone (footer area):

| Variable                                                | Purpose                      | Fallback                                         |
| ------------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `--gn-aside-bottom-background-color`                    | Footer container background  | `--gn-aside-surface-background-color`            |
| `--gn-aside-bottom-divider-color`                       | Divider above footer         | `--gn-aside-divider-horizontal-color`            |
| `--gn-aside-bottom-item-icon-color`                     | Icon color                   | `--gn-aside-item-icon-color`                     |
| `--gn-aside-bottom-item-current-icon-color`             | Active item icon color       | `--gn-aside-item-current-icon-color`             |
| `--gn-aside-bottom-item-text-color`                     | Text color                   | `--gn-aside-item-text-color`                     |
| `--gn-aside-bottom-item-current-text-color`             | Active item text color       | `--gn-aside-item-current-text-color`             |
| `--gn-aside-bottom-item-background-color-hover`         | Hover background             | `--gn-aside-item-background-color-hover`         |
| `--gn-aside-bottom-item-current-background-color`       | Active item background       | `--gn-aside-item-current-background-color`       |
| `--gn-aside-bottom-item-current-background-color-hover` | Active item hover background | `--gn-aside-item-current-background-color-hover` |

### Usage Example

```css
.my-app {
  /* Top zone customization */
  --gn-aside-top-item-icon-color: #333;
  --gn-aside-top-item-current-background-color: rgba(0, 100, 255, 0.15);

  /* Main zone (groups) customization */
  --gn-aside-main-group-item-current-background-color: rgba(0, 100, 255, 0.2);
  --gn-aside-main-group-item-background-color-hover: rgba(0, 0, 0, 0.05);

  /* Bottom zone (footer) customization */
  --gn-aside-bottom-item-icon-color: #666;
  --gn-aside-bottom-item-current-background-color: rgba(0, 100, 255, 0.1);
}
```

## Migration from v4.x

### Deprecated Variables

The following variables have been replaced with zone-specific alternatives:

| Old Variable                                | New Variable                                | Zone   |
| ------------------------------------------- | ------------------------------------------- | ------ |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-top-item-icon-color`            | Top    |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-top-item-current-icon-color`    | Top    |
| `--gn-aside-header-general-item-icon-color` | `--gn-aside-bottom-item-icon-color`         | Bottom |
| `--gn-aside-header-item-current-icon-color` | `--gn-aside-bottom-item-current-icon-color` | Bottom |

### Migration Steps

1. **Subheader icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-top-item-icon-color`
2. **Footer icons**: Replace `--gn-aside-header-general-item-icon-color` with `--gn-aside-bottom-item-icon-color`
3. **Subheader current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-top-item-current-icon-color`
4. **Footer current icons**: Replace `--gn-aside-header-item-current-icon-color` with `--gn-aside-bottom-item-current-icon-color`
