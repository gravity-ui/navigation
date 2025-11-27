# @gravity-ui/navigation - Agent Guide

This document provides comprehensive information for AI agents and developers working with the `@gravity-ui/navigation` library. It serves as a reference for understanding the library's architecture, components, patterns, and best practices.

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Core Concepts](#core-concepts)
4. [Main Components](#main-components)
5. [Component Patterns](#component-patterns)
6. [Styling & Theming](#styling--theming)
7. [TypeScript Types](#typescript-types)
8. [Common Usage Patterns](#common-usage-patterns)
9. [Best Practices](#best-practices)
10. [Testing](#testing)
11. [Project Structure](#project-structure)

## Overview

`@gravity-ui/navigation` is a React component library for building navigation interfaces, specifically designed for creating sidebar navigation systems (AsideHeader) and related navigation components. The library is part of the Gravity UI design system ecosystem.

### Key Features

- **AsideHeader**: Main sidebar navigation component with collapsible/expandable states
- **ActionBar**: Horizontal bar for organizing navigation elements, actions, and breadcrumbs
- **Drawer**: Sliding panel component for additional content
- **Footer/MobileFooter**: Page footer components for desktop and mobile
- **Settings**: Settings panel with grouping and filtering capabilities
- **MobileHeader**: Mobile-specific header component
- **HotkeysPanel**: Keyboard shortcuts display component

### Library Purpose

The library provides a complete navigation solution for web applications, with special focus on:

- Responsive design (desktop and mobile variants)
- Customizable theming via CSS variables
- Accessibility support
- TypeScript-first development
- Integration with Gravity UI UIKit components

## Installation & Setup

### Installation

```bash
npm install @gravity-ui/navigation
```

### Peer Dependencies

The library requires these peer dependencies to be installed:

```bash
npm install --save-dev \
  @gravity-ui/uikit@^6.15.0 \
  @gravity-ui/icons@2.2.0 \
  @gravity-ui/components@3.0.0 \
  @bem-react/classname@1.6.0 \
  react@^18.0.0 \
  react-dom@18.0.0
```

**Note**: For production, use `@gravity-ui/uikit@^7.2.0` or higher.

### Import Patterns

```typescript
// Main components
import {AsideHeader, ActionBar, Drawer, Footer} from '@gravity-ui/navigation';

// Advanced layout components
import {PageLayout, PageLayoutAside, AsideFallback} from '@gravity-ui/navigation';

// Sub-components
import {ActionBar} from '@gravity-ui/navigation';
// ActionBar.Section, ActionBar.Group, ActionBar.Item, ActionBar.Separator

import {Drawer, DrawerItem} from '@gravity-ui/navigation';
```

## Core Concepts

### Navigation States

The `AsideHeader` component has two main visual states:

- **Expanded**: Full navigation with icons and text labels
- **Collapsed/Compact**: Only icons visible, text hidden

State is managed via the `compact` prop and `onChangeCompact` callback.

### Component Structure

The library follows a hierarchical component structure:

```
AsideHeader
├── Logo
├── SubheaderItems (top section)
├── MenuItems (middle section - main navigation)
└── Footer (bottom section)
    └── FooterItems
```

### Content Rendering

There are two approaches to rendering content alongside `AsideHeader`:

1. **Simple**: Pass content via `renderContent` prop
2. **Advanced**: Use `PageLayout` and `PageLayoutAside` for better performance (supports code splitting)

## Main Components

### AsideHeader

The primary navigation component. Provides a collapsible sidebar with three main sections.

#### Basic Usage

```typescript
import {AsideHeader} from '@gravity-ui/navigation';
import {Icon} from '@gravity-ui/uikit';
import {Home} from '@gravity-ui/icons';

<AsideHeader
  logo={{
    icon: logoIcon,
    text: 'My App',
    href: '/',
  }}
  menuItems={[
    {
      id: 'home',
      title: 'Home',
      icon: Home,
      current: true,
      onItemClick: () => navigate('/'),
    },
  ]}
  compact={isCompact}
  onChangeCompact={setIsCompact}
  renderContent={({size}) => <MainContent />}
/>
```

#### Key Props

- `compact`: Boolean - Controls collapsed/expanded state
- `onChangeCompact`: Callback when state changes
- `menuItems`: Array of `MenuItem` objects
- `subheaderItems`: Items displayed under logo
- `renderFooter`: Function to render bottom section
- `renderContent`: Function to render main page content
- `headerDecoration`: Boolean - Highlights top section with background color
- `customBackground`: ReactNode - Custom background element
- `panelItems`: Array of `DrawerItem` props for drawer panels
- `onMenuItemsChanged`: Required for AllPages functionality
- `topAlert`: TopAlertProps - Alert banner above navigation

#### MenuItem Structure

```typescript
interface MenuItem {
  id: string;
  title: React.ReactNode;
  icon?: IconProps['data'];
  iconSize?: number | string;
  current?: boolean; // Selected/active state
  pinned?: boolean; // Cannot be hidden in AllPages
  hidden?: boolean; // Visibility in AllPages
  link?: string; // HTML href
  onItemClick?: (item, collapsed, event) => void;
  tooltipText?: React.ReactNode;
  type?: 'regular' | 'action' | 'divider';
  category?: string; // For grouping in AllPages
  order?: number; // Display order
  rightAdornment?: React.ReactNode;
  itemWrapper?: Function; // Custom wrapper component
}
```

### ActionBar

Horizontal bar for organizing navigation elements, actions, and informational content.

#### Structure

```
ActionBar
└── ActionBar.Section (primary | secondary)
    └── ActionBar.Group (pull: left | right | center, etc.)
        ├── ActionBar.Item
        ├── ActionBar.Separator
        └── ActionBar.Item
```

#### Usage

```typescript
import {ActionBar} from '@gravity-ui/navigation';
import {Button} from '@gravity-ui/uikit';
import {Breadcrumbs} from '@gravity-ui/uikit/legacy';

<ActionBar aria-label="Actions bar">
  <ActionBar.Section type="primary">
    <ActionBar.Group>
      <ActionBar.Item>
        <Breadcrumbs items={breadcrumbItems} />
      </ActionBar.Item>
    </ActionBar.Group>

    <ActionBar.Group pull="right">
      <ActionBar.Item>
        <Button>Action</Button>
      </ActionBar.Item>
      <ActionBar.Separator />
      <ActionBar.Item>
        <Button>Another Action</Button>
      </ActionBar.Item>
    </ActionBar.Group>
  </ActionBar.Section>
</ActionBar>
```

#### Key Props

- `ActionBar.Section`: `type` prop - `"primary"` (default) or `"secondary"`
- `ActionBar.Group`: `pull` prop - Controls alignment (`"left"`, `"right"`, `"center"`, `"left-grow"`, `"right-grow"`, `"center-grow"`)
- `ActionBar.Item`: `spacing` prop - Enable spacing with previous item (default: `true`)

### Drawer

Sliding panel component that emerges from screen edges.

#### Usage

```typescript
import {Drawer, DrawerItem} from '@gravity-ui/navigation';

const [isVisible, setVisible] = useState(false);

<Drawer
  onEscape={() => setVisible(false)}
  onVeilClick={() => setVisible(false)}
>
  <DrawerItem
    id="panel1"
    visible={isVisible}
    direction="left"
    resizable
    width={400}
    onResize={setWidth}
  >
    <p>Drawer content</p>
  </DrawerItem>
</Drawer>
```

#### DrawerItem Props

- `id`: string - Unique identifier (required)
- `visible`: boolean - Visibility state
- `direction`: `"left"` | `"right"` | `"top"` | `"bottom"` (default: `"left"`)
- `resizable`: boolean - Enable resizing
- `width`: number - Width for resizable drawer
- `onResize`: (width: number) => void - Resize callback
- `minResizeWidth` / `maxResizeWidth`: number - Resize constraints

### Footer / MobileFooter

Page footer components for desktop and mobile versions.

#### Usage

```typescript
import {Footer, MobileFooter} from '@gravity-ui/navigation';

<Footer
  withDivider
  copyright={`© ${new Date().getFullYear()} My Service`}
  logo={{
    icon: logoIcon,
    iconSize: 24,
    text: 'My Service',
  }}
  menuItems={[
    {text: 'About', href: '/about'},
    {text: 'Docs', href: '/docs'},
  ]}
/>

// Mobile version
<MobileFooter {...sameProps} />
```

#### Props

- `view`: `"normal"` | `"clear"` - Background style
- `withDivider`: boolean - Show top border
- `menuItems`: FooterMenuItem[] - Footer links
- `logo`: LogoProps - Service logo
- `copyright`: string - Copyright text

### Settings

Settings panel with grouping, filtering, and search capabilities.

#### Structure

```
Settings
├── Settings.Group (optional)
│   └── Settings.Page
│       └── Settings.Section
│           └── Settings.Item
```

#### Usage

```typescript
import {Settings} from '@gravity-ui/navigation';

<Settings
  title="Settings"
  initialPage="general/appearance"
  onPageChange={(page) => console.log(page)}
>
  <Settings.Group groupTitle="General" id="general">
    <Settings.Page id="appearance" title="Appearance" icon={Palette}>
      <Settings.Section title="Theme">
        <Settings.Item title="Color scheme">
          <Select options={themes} />
        </Settings.Item>
      </Settings.Section>
    </Settings.Page>
  </Settings.Group>
</Settings>
```

### PageLayout (Advanced Pattern)

For better performance and code splitting, use `PageLayout` instead of `renderContent`.

#### Usage

```typescript
import {PageLayout, PageLayoutAside, AsideFallback} from '@gravity-ui/navigation';
import {Suspense} from 'react';

const Aside = React.lazy(() => import('./Aside'));

<PageLayout compact={compact}>
  <Suspense fallback={<AsideFallback />}>
    <Aside />
  </Suspense>

  <PageLayout.Content>
    <MainContent />
  </PageLayout.Content>
</PageLayout>

// In Aside.tsx
import {PageLayoutAside} from '@gravity-ui/navigation';

export const Aside = () => (
  <PageLayoutAside
    logo={logoProps}
    menuItems={menuItems}
    onChangeCompact={setCompact}
  />
);
```

## Component Patterns

### Logo Component

```typescript
import {Logo} from '@gravity-ui/navigation';

const logoProps = {
  icon: logoIcon, // IconProps['data'] or string (iconSrc)
  text: 'My App',
  href: '/',
  onClick: (e) => handleLogoClick(e),
  'aria-label': 'Home',
};
```

### FooterItem

```typescript
import {FooterItem} from '@gravity-ui/navigation';
import {Icon} from '@gravity-ui/uikit';
import {Help} from '@gravity-ui/icons';

<FooterItem
  icon={Help}
  text="Help"
  onClick={() => openHelp()}
  bringForward // Renders above modals
/>
```

### TopAlert

Alert banner displayed above navigation.

```typescript
const topAlert = {
  title: 'Maintenance',
  message: 'Scheduled maintenance in progress',
  view: 'filled',
  theme: 'warning',
  closable: true,
  onCloseTopAlert: () => setAlertClosed(true),
  // Or custom render
  render: ({handleClose}) => <CustomAlert onClose={handleClose} />,
};
```

### AllPagesPanel

Allows users to customize visible menu items. Requires `onMenuItemsChanged` callback.

```typescript
const [menuItems, setMenuItems] = useState(initialItems);

<AsideHeader
  menuItems={menuItems}
  onMenuItemsChanged={(newItems) => {
    // Save to backend/localStorage
    saveMenuItems(newItems);
    setMenuItems(newItems);
  }}
  onAllPagesClick={() => setShowAllPages(true)}
/>
```

## Styling & Theming

### CSS Variables

The library uses CSS variables for theming. Set these on `.g-root` or a parent element.

#### AsideHeader Variables

```css
.g-root {
  /* Background colors */
  --gn-aside-header-background-color: #fff;
  --gn-aside-header-collapsed-background-color: #f5f5f5;
  --gn-aside-header-expanded-background-color: #fff;

  /* Decoration (top section) */
  --gn-aside-header-decoration-collapsed-background-color: #f0f0f0;
  --gn-aside-header-decoration-expanded-background-color: #e8e8e8;

  /* Dividers */
  --gn-aside-header-divider-horizontal-color: #e5e5e5;
  --gn-aside-header-divider-vertical-color: #e5e5e5;

  /* Item colors */
  --gn-aside-header-general-item-icon-color: #666;
  --gn-aside-header-item-icon-color: #333;
  --gn-aside-header-item-text-color: #333;
  --gn-aside-header-item-background-color-hover: rgba(0, 0, 0, 0.05);

  /* Current item */
  --gn-aside-header-item-current-background-color: #e3f2fd;
  --gn-aside-header-item-current-icon-color: #1976d2;
  --gn-aside-header-item-current-text-color: #1976d2;

  /* Z-indexes */
  --gn-aside-header-z-index: 100;
  --gn-aside-header-panel-z-index: 200;
  --gn-aside-header-content-z-index: 1;

  /* Read-only (for calculations) */
  --gn-aside-header-size: 240px; /* Actual navigation width */
  --gn-top-alert-height: 48px; /* Top alert height */
}
```

#### Drawer Variables

```css
.g-root {
  --gn-drawer-z-index: auto;
  --gn-drawer-item-z-index: auto;
  --gn-drawer-veil-z-index: auto;
  --gn-drawer-veil-background-color: var(--g-color-sfx-veil);
  --gn-drawer-item-resizer-width: 8px;
  --gn-drawer-item-resizer-color: var(--g-color-base-generic);
}
```

### Custom Background

```typescript
<AsideHeader
  customBackground={<img src="bg.png" alt="" />}
  customBackgroundClassName="custom-bg-class"
  headerDecoration={false}
/>
```

### CSS API Usage

Components expose CSS classes that can be targeted for custom styling:

- Use `className` prop for additional classes
- Use `qa` prop for `data-qa` attributes (testing)
- Style via CSS variables rather than overriding component styles

## TypeScript Types

### Main Exports

```typescript
// Component types
import type {AsideHeaderProps, FooterItemProps, PageLayoutProps} from '@gravity-ui/navigation';

// Data types
import type {MenuItem, LogoProps, TopAlertProps, MenuItemType} from '@gravity-ui/navigation';
```

### Type Definitions

Key types are defined in `src/components/types.ts`:

- `MenuItem`: Navigation item structure
- `LogoProps`: Logo configuration
- `TopAlertProps`: Alert banner configuration
- `MenuItemType`: `'regular' | 'action' | 'divider'`
- `SubheaderMenuItem`: Items under logo

## Common Usage Patterns

### Basic Navigation Setup

```typescript
import {useState} from 'react';
import {AsideHeader} from '@gravity-ui/navigation';
import {Home, Settings, User} from '@gravity-ui/icons';

function App() {
  const [compact, setCompact] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      icon: Home,
      current: currentPage === 'home',
      onItemClick: () => setCurrentPage('home'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      current: currentPage === 'settings',
      onItemClick: () => setCurrentPage('settings'),
    },
  ];

  return (
    <AsideHeader
      logo={{text: 'My App', icon: logoIcon}}
      menuItems={menuItems}
      compact={compact}
      onChangeCompact={setCompact}
      renderContent={() => <PageContent page={currentPage} />}
    />
  );
}
```

### With ActionBar

```typescript
import {AsideHeader, ActionBar} from '@gravity-ui/navigation';

function Layout() {
  return (
    <AsideHeader
      {...asideProps}
      renderContent={() => (
        <div>
          <ActionBar>
            <ActionBar.Section>
              <ActionBar.Group>
                <ActionBar.Item>
                  <Breadcrumbs items={items} />
                </ActionBar.Item>
              </ActionBar.Group>
            </ActionBar.Section>
          </ActionBar>
          <MainContent />
        </div>
      )}
    />
  );
}
```

### With Drawer Panels

```typescript
const [panelVisible, setPanelVisible] = useState(false);

<AsideHeader
  panelItems={[
    {
      id: 'help',
      visible: panelVisible,
      children: <HelpContent />,
    },
  ]}
  menuItems={[
    {
      id: 'help',
      title: 'Help',
      icon: Help,
      onItemClick: () => setPanelVisible(true),
    },
  ]}
/>
```

### Responsive Pattern

```typescript
import {useMediaQuery} from '@gravity-ui/uikit';
import {AsideHeader, MobileHeader} from '@gravity-ui/navigation';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileHeader {...mobileProps} />;
  }

  return <AsideHeader {...desktopProps} />;
}
```

## Best Practices

### 1. State Management

- **Manage menu state externally**: Keep `menuItems` in component state or global state
- **Persist compact state**: Save `compact` state to localStorage
- **Handle menu changes**: Implement `onMenuItemsChanged` to persist user preferences

### 2. Performance

- **Use PageLayout for large apps**: Enables code splitting and lazy loading
- **Memoize menu items**: Use `useMemo` for `menuItems` array if computed
- **Lazy load content**: Use React.lazy for content components

### 3. Accessibility

- **Provide aria-labels**: Use `aria-label` on ActionBar and other components
- **Keyboard navigation**: Components support keyboard navigation out of the box
- **Focus management**: Drawer handles focus trapping automatically

### 4. Theming

- **Use CSS variables**: Prefer CSS variables over inline styles
- **Test both states**: Ensure theming works in both collapsed and expanded states
- **Consider dark mode**: Test with dark theme if applicable

### 5. Component Composition

- **Use sub-components**: Prefer `ActionBar.Section` over custom divs
- **Follow structure**: Respect component hierarchy (Section → Group → Item)
- **Custom wrappers**: Use `itemWrapper` for advanced customization

### 6. Type Safety

- **Import types**: Use exported types for props
- **Type menu items**: Ensure `MenuItem` objects match the interface
- **Type callbacks**: Use proper types for event handlers

## Testing

### Component Testing

The library uses:

- **Jest** for unit tests
- **Playwright** for visual regression tests
- **Storybook** for component development and testing

### Test Patterns

```typescript
// Example test structure
import {render, screen} from '@testing-library/react';
import {AsideHeader} from '@gravity-ui/navigation';

test('renders navigation', () => {
  render(
    <AsideHeader
      logo={{text: 'Test'}}
      menuItems={[{id: '1', title: 'Item'}]}
    />
  );

  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Visual Testing

Visual tests are located in `__tests__/` directories with `.visual.test.tsx` files. Screenshots are stored in `__snapshots__/`.

## Project Structure

```
src/
├── components/
│   ├── AsideHeader/        # Main navigation component
│   ├── ActionBar/          # Horizontal action bar
│   ├── Drawer/             # Sliding panels
│   ├── Footer/             # Footer components
│   ├── Settings/           # Settings panel
│   ├── MobileHeader/       # Mobile header
│   ├── Logo/               # Logo component
│   ├── HotkeysPanel/       # Keyboard shortcuts
│   └── types.ts            # TypeScript types
├── hooks/                  # Custom hooks
└── index.ts                # Main exports
```

### Storybook

Storybook examples are in `__stories__/` directories:

- `*.stories.tsx` - Storybook stories
- `*Showcase.tsx` - Comprehensive examples

### Documentation

Component documentation is in `README.md` files within each component directory.

## Additional Resources

- **Storybook**: https://preview.gravity-ui.com/navigation/
- **GitHub**: https://github.com/gravity-ui/navigation
- **Sandboxes**:
  - Basic: https://codesandbox.io/p/devbox/navigation-demo-simple-x9k5sd
  - Advanced: https://codesandbox.io/p/devbox/recursing-dawn-6kc9vh

## Roadmap (2025)

1. Support SSR
2. Add more docs and examples
3. Support Navigation at UIKit themer
4. Unify subheaderItem, menuItem, footerItem API

## Notes for AI Agents

When working with this library:

1. **Always check component READMEs**: Each component has detailed documentation
2. **Review Storybook examples**: `__stories__/` directories contain real usage examples
3. **Respect TypeScript types**: The library is fully typed - use types for guidance
4. **Follow Gravity UI patterns**: Components integrate with `@gravity-ui/uikit`
5. **Consider mobile**: Many components have mobile variants (MobileHeader, MobileFooter)
6. **CSS variables**: Use CSS variables for theming, not direct style overrides
7. **State management**: Navigation state should be managed by the consuming application
8. **Performance**: Use PageLayout pattern for large applications

When suggesting changes or fixes:

- Maintain backward compatibility
- Follow existing code patterns
- Add TypeScript types
- Update relevant README files
- Consider both desktop and mobile views
- Test in both collapsed and expanded states
