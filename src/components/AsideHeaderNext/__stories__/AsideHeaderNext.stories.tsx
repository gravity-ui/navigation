import * as React from 'react';

import {
    ChartColumn,
    CirclesIntersection,
    Cloud,
    CreditCard,
    Database,
    Gear,
    House,
    Magnifier,
    Person,
    Server,
    ShieldKeyhole,
} from '@gravity-ui/icons';
import {Button, Card, Flex, Icon, Label, Text} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {AsideHeaderNext} from '../AsideHeaderNext';
import {useAsideHeaderCompact} from '../LayoutContext';

import {DEFAULT_LOGO, Tag, manyMenuItems, menuItemsShowcase, text as poem} from './moc';

export default {
    title: 'AsideHeaderNext',
    component: AsideHeaderNext.Root,
    parameters: {layout: 'fullscreen'},
} as Meta;

const Frame = ({children}: {children: React.ReactNode}) => (
    <div style={{height: '100vh'}}>{children}</div>
);

function Note({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <Card view="filled" style={{padding: 20, margin: 20, maxWidth: 760}}>
            <Text variant="subheader-2" as="div" style={{marginBottom: 8}}>
                {title}
            </Text>
            <Text color="secondary" as="div">
                {children}
            </Text>
        </Card>
    );
}

/* ------------------------------------------------------------------ *
 * 1. Showcase — everything composed together
 * ------------------------------------------------------------------ */

export const Showcase: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo {...DEFAULT_LOGO} />

                <AsideHeaderNext.Subheader>
                    <AsideHeaderNext.Panel>
                        <AsideHeaderNext.Panel.Trigger id="search" icon={Magnifier}>
                            Search
                        </AsideHeaderNext.Panel.Trigger>
                        <AsideHeaderNext.Panel.Content>
                            <div style={{padding: 20, width: 300}}>
                                <Text variant="subheader-2">Search panel</Text>
                            </div>
                        </AsideHeaderNext.Panel.Content>
                    </AsideHeaderNext.Panel>
                </AsideHeaderNext.Subheader>

                <AsideHeaderNext.Menu
                    aria-label="Main navigation"
                    items={menuItemsShowcase}
                    overflow="scroll"
                />

                <AsideHeaderNext.Footer>
                    <AsideHeaderNext.Item id="docs" icon={CirclesIntersection}>
                        Documentation
                    </AsideHeaderNext.Item>

                    <AsideHeaderNext.Popup>
                        <AsideHeaderNext.Popup.Trigger id="user" icon={Person}>
                            Alex
                        </AsideHeaderNext.Popup.Trigger>
                        <AsideHeaderNext.Popup.Content title="Account">
                            <div style={{padding: '4px 8px', width: 200}}>
                                <Text color="secondary">Arbitrary popup content</Text>
                            </div>
                        </AsideHeaderNext.Popup.Content>
                    </AsideHeaderNext.Popup>
                </AsideHeaderNext.Footer>

                <AsideHeaderNext.CollapseButton />

                <AsideHeaderNext.Content>
                    <Note title="Showcase">
                        Logo, subheader, menu, footer, panel and popup — all composed explicitly. No{' '}
                        <code>renderFooter</code>, no <code>panelItems</code>, no{' '}
                        <code>itemWrapper</code>. Collapse the rail with the button at the bottom.
                    </Note>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/* ------------------------------------------------------------------ *
 * 2. Activity model — the highlight follows the nearest *visible* node
 * ------------------------------------------------------------------ */

const ROUTES = [
    {href: '/overview', title: 'Overview', icon: House},
    {href: '/infra/vm', title: 'Virtual machines', icon: Server},
    {href: '/infra/k8s', title: 'Kubernetes', icon: Cloud},
    {href: '/infra/db', title: 'Databases', icon: Database},
    {href: '/billing', title: 'Billing', icon: CreditCard},
];

export const ActivityModel: StoryFn = () => {
    const [path, setPath] = React.useState('/infra/k8s');
    const [compact, setCompact] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);

    // Stand-in for a router `Link`: prevents navigation, updates local state.
    const link = (href: string) => (
        <a
            href={href}
            onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setPath(href);
            }}
        />
    );

    return (
        <Frame>
            <AsideHeaderNext.Root
                compact={compact}
                onCompactChange={setCompact}
                currentPath={path}
                matchStrategy="prefix"
            >
                <AsideHeaderNext.Logo icon={House} text="Activity" href="#" />

                <AsideHeaderNext.Menu aria-label="Main navigation">
                    <AsideHeaderNext.Item
                        id="overview"
                        icon={House}
                        href="/overview"
                        render={link('/overview')}
                    >
                        Overview
                    </AsideHeaderNext.Item>

                    <AsideHeaderNext.GroupItem
                        id="infra"
                        expanded={expanded}
                        onExpandedChange={setExpanded}
                    >
                        <AsideHeaderNext.GroupItem.Trigger icon={Server}>
                            Infrastructure
                        </AsideHeaderNext.GroupItem.Trigger>
                        <AsideHeaderNext.GroupItem.Content>
                            {ROUTES.slice(1, 4).map((route) => (
                                <AsideHeaderNext.Item
                                    key={route.href}
                                    id={route.href}
                                    icon={route.icon}
                                    href={route.href}
                                    render={link(route.href)}
                                >
                                    {route.title}
                                </AsideHeaderNext.Item>
                            ))}
                        </AsideHeaderNext.GroupItem.Content>
                    </AsideHeaderNext.GroupItem>

                    <AsideHeaderNext.Divider />

                    <AsideHeaderNext.Item
                        id="billing"
                        icon={CreditCard}
                        href="/billing"
                        render={link('/billing')}
                        rightAdornment={<Tag>new</Tag>}
                    >
                        Billing
                    </AsideHeaderNext.Item>
                </AsideHeaderNext.Menu>

                <AsideHeaderNext.CollapseButton />

                <AsideHeaderNext.Content>
                    <Note title="Activity: the highlight follows the nearest visible node">
                        <p>
                            No item computes <code>current</code> itself — the rail gets{' '}
                            <code>currentPath</code> once on <code>Root</code>, and rows with an{' '}
                            <code>href</code> derive it.
                        </p>
                        <p>
                            Current path: <code>{path}</code>
                        </p>
                        <Flex gap={2} wrap style={{marginBottom: 12}}>
                            {ROUTES.map((route) => (
                                <Button key={route.href} onClick={() => setPath(route.href)}>
                                    {route.href}
                                </Button>
                            ))}
                        </Flex>
                        <Flex gap={2} wrap>
                            <Button onClick={() => setExpanded((value) => !value)}>
                                {expanded ? 'Collapse the group' : 'Expand the group'}
                            </Button>
                            <Button onClick={() => setCompact((value) => !value)}>
                                {compact ? 'Expand the rail' : 'Collapse the rail'}
                            </Button>
                        </Flex>
                        <ul>
                            <li>
                                Navigate to <code>/infra/k8s</code> and collapse the group — the
                                highlight moves onto <b>Infrastructure</b>.
                            </li>
                            <li>
                                Expand it again — the highlight goes back to the child; the group
                                keeps only a hint (<code>data-has-active-descendant</code>).
                            </li>
                            <li>
                                Collapse the whole rail — children live in a flyout, so the group
                                stays highlighted; open the flyout and the child is highlighted too.
                            </li>
                        </ul>
                    </Note>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/* ------------------------------------------------------------------ *
 * 3. Overlays — Popup and Panel, triggers render as rows
 * ------------------------------------------------------------------ */

export const Overlays: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);
    const [reportsOpen, setReportsOpen] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo icon={House} text="Overlays" href="#" />

                <AsideHeaderNext.Menu aria-label="Main navigation">
                    {/* Controlled popup: the app owns `open`. */}
                    <AsideHeaderNext.Popup open={reportsOpen} onOpenChange={setReportsOpen}>
                        <AsideHeaderNext.Popup.Trigger id="reports" icon={ChartColumn}>
                            Reports
                        </AsideHeaderNext.Popup.Trigger>
                        <AsideHeaderNext.Popup.Content title="Reports">
                            <AsideHeaderNext.ItemList place="popup" keyboard="roving">
                                <AsideHeaderNext.Item id="daily">Daily</AsideHeaderNext.Item>
                                <AsideHeaderNext.Item id="weekly" current>
                                    Weekly
                                </AsideHeaderNext.Item>
                                <AsideHeaderNext.Item id="custom">Custom…</AsideHeaderNext.Item>
                            </AsideHeaderNext.ItemList>
                        </AsideHeaderNext.Popup.Content>
                    </AsideHeaderNext.Popup>

                    {/* Uncontrolled panel with a trigger that renders as a row. */}
                    <AsideHeaderNext.Panel>
                        <AsideHeaderNext.Panel.Trigger id="audit" icon={ShieldKeyhole}>
                            Audit log
                        </AsideHeaderNext.Panel.Trigger>
                        <AsideHeaderNext.Panel.Content>
                            <div style={{padding: 20, width: 320}}>
                                <Text variant="subheader-2" as="div">
                                    Audit log
                                </Text>
                                <Text color="secondary" as="div" style={{marginTop: 8}}>
                                    The trigger row stays highlighted while this panel is open —
                                    nothing was wired up by hand.
                                </Text>
                            </div>
                        </AsideHeaderNext.Panel.Content>
                    </AsideHeaderNext.Panel>

                    <AsideHeaderNext.Divider />

                    {/* Non-navigational popup with arbitrary content. */}
                    <AsideHeaderNext.Popup>
                        <AsideHeaderNext.Popup.Trigger id="profile" icon={Person}>
                            Alex Ivanov
                        </AsideHeaderNext.Popup.Trigger>
                        <AsideHeaderNext.Popup.Content align="end" sideOffset={20}>
                            <Flex direction="column" gap={2} style={{padding: 8, width: 220}}>
                                <Text variant="subheader-2">Alex Ivanov</Text>
                                <Text color="secondary">alex@example.com</Text>
                                <Button width="max">Sign out</Button>
                            </Flex>
                        </AsideHeaderNext.Popup.Content>
                    </AsideHeaderNext.Popup>
                </AsideHeaderNext.Menu>

                <AsideHeaderNext.CollapseButton />

                <AsideHeaderNext.Content>
                    <Note title="Overlays live outside Item">
                        <p>
                            <code>Item</code> has no <code>open</code>, no <code>panel</code>, no{' '}
                            <code>popup*</code> props. <code>Popup</code> and <code>Panel</code> are
                            declared next to their trigger; the content is portaled out.
                        </p>
                        <ul>
                            <li>
                                <code>Popup.Trigger</code> and <code>Panel.Trigger</code> render as
                                a regular row, plus <code>aria-expanded</code>,{' '}
                                <code>aria-controls</code> and the open-state highlight.
                            </li>
                            <li>
                                Offsets (<code>sideOffset: 14</code>) and side (<code>right</code>,{' '}
                                <code>align: start</code>) are documented defaults, not private
                                constants.
                            </li>
                            <li>
                                Collapse the rail: the popup switches from click to hover intent
                                automatically.
                            </li>
                        </ul>
                        <Button onClick={() => setReportsOpen((value) => !value)}>
                            Toggle the Reports popup from the outside
                        </Button>
                    </Note>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/* ------------------------------------------------------------------ *
 * 4. Row contract — custom content that still behaves in compact
 * ------------------------------------------------------------------ */

function EnvironmentSwitcher() {
    const compact = useAsideHeaderCompact();

    return (
        <AsideHeaderNext.Row interactive>
            <AsideHeaderNext.Row.Leading>
                <div
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 11,
                        color: 'var(--g-color-text-light-primary)',
                        backgroundColor: 'var(--g-color-base-brand)',
                    }}
                >
                    {compact ? 'PR' : 'P'}
                </div>
            </AsideHeaderNext.Row.Leading>
            <AsideHeaderNext.Row.Body>
                <Flex direction="column">
                    <Text variant="body-1">Production</Text>
                    <Text variant="caption-2" color="secondary">
                        eu-central-1
                    </Text>
                </Flex>
            </AsideHeaderNext.Row.Body>
            <AsideHeaderNext.Row.Trailing>
                <Label theme="success" size="xs">
                    live
                </Label>
            </AsideHeaderNext.Row.Trailing>
        </AsideHeaderNext.Row>
    );
}

export const RowContract: StoryFn = () => {
    const [compact, setCompact] = React.useState(false);

    return (
        <Frame>
            <AsideHeaderNext.Root compact={compact} onCompactChange={setCompact}>
                <AsideHeaderNext.Logo href="#">
                    <AsideHeaderNext.Logo.Icon>
                        <Icon data={CirclesIntersection} size={24} />
                    </AsideHeaderNext.Logo.Icon>
                    <AsideHeaderNext.Logo.Text>
                        <Flex direction="column">
                            <Text variant="subheader-2">Acme Cloud</Text>
                            <Text variant="caption-2" color="secondary">
                                enterprise
                            </Text>
                        </Flex>
                    </AsideHeaderNext.Logo.Text>
                </AsideHeaderNext.Logo>

                <AsideHeaderNext.Subheader>
                    <EnvironmentSwitcher />
                </AsideHeaderNext.Subheader>

                <AsideHeaderNext.Menu aria-label="Main navigation">
                    <AsideHeaderNext.Item id="overview" icon={House} current>
                        Overview
                    </AsideHeaderNext.Item>
                    <AsideHeaderNext.Item id="settings" icon={Gear}>
                        Settings
                    </AsideHeaderNext.Item>

                    <AsideHeaderNext.WhenExpanded>
                        <div style={{padding: '12px 8px'}}>
                            <Card view="filled" style={{padding: 12}}>
                                <Text variant="caption-2" color="secondary">
                                    Promo block — only makes sense in the expanded rail, so it is a
                                    render gate rather than CSS.
                                </Text>
                            </Card>
                        </div>
                    </AsideHeaderNext.WhenExpanded>
                </AsideHeaderNext.Menu>

                <AsideHeaderNext.CollapseButton />

                <AsideHeaderNext.Content>
                    <Note title="One layout contract for every row">
                        <p>
                            <code>Row</code> ={' '}
                            <code>[ Leading 56px ][ Body 1fr ][ Trailing auto ]</code>. Leading is
                            the only zone guaranteed to survive <code>compact</code>; Body and
                            Trailing are hidden with CSS, never unmounted.
                        </p>
                        <ul>
                            <li>
                                <b>Logo</b> here is composed from <code>Logo.Icon</code> +{' '}
                                <code>Logo.Text</code> with two-line custom content.
                            </li>
                            <li>
                                <b>Environment switcher</b> is not an <code>Item</code> at all — a
                                bare <code>Row</code> that gets correct compact behaviour for free,
                                and swaps its label via <code>useAsideHeaderCompact()</code>.
                            </li>
                            <li>
                                <b>Promo card</b> uses <code>WhenExpanded</code> — for content that
                                should not exist at all in the collapsed rail.
                            </li>
                        </ul>
                    </Note>
                </AsideHeaderNext.Content>
            </AsideHeaderNext.Root>
        </Frame>
    );
};

/* ------------------------------------------------------------------ *
 * 5. render prop — element, function, children precedence
 * ------------------------------------------------------------------ */

export const RenderProp: StoryFn = () => (
    <Frame>
        <AsideHeaderNext.Root>
            <AsideHeaderNext.Logo icon={House} text="render" href="#" />

            <AsideHeaderNext.Menu aria-label="Main navigation">
                {/* 1. element — default row content is passed through props.children */}
                <AsideHeaderNext.Item
                    id="element"
                    icon={House}
                    render={<a href="#element" title="rendered as <a>" />}
                >
                    render={'{<a />}'}
                </AsideHeaderNext.Item>

                {/* 2. element with its own children — those win */}
                <AsideHeaderNext.Item
                    id="own-children"
                    icon={Gear}
                    render={<a href="#own">children of render win</a>}
                >
                    ignored title
                </AsideHeaderNext.Item>

                {/* 3. function — gets merged props and the row state */}
                <AsideHeaderNext.Item
                    id="function"
                    icon={ChartColumn}
                    current
                    render={(props, state) => (
                        <a
                            {...props}
                            href="#function"
                            style={{outline: state.active ? '1px dashed currentColor' : undefined}}
                        />
                    )}
                >
                    render={'{(props, state) => …}'}
                </AsideHeaderNext.Item>

                {/* 4. handlers are chained, not replaced */}
                <AsideHeaderNext.Item
                    id="chained"
                    icon={CirclesIntersection}
                    onClick={() => alert('internal onClick ran first')}
                    render={<button type="button" onClick={() => alert('then yours')} />}
                >
                    chained handlers
                </AsideHeaderNext.Item>
            </AsideHeaderNext.Menu>

            <AsideHeaderNext.Content>
                <Note title="One render prop replaces seven mechanisms">
                    <ul>
                        <li>
                            An element composes: <code>cloneElement</code> with merged props and
                            refs. The default row content arrives via <code>props.children</code>.
                        </li>
                        <li>
                            If the render element brings its own children, they win — later-wins
                            merge, no special casing.
                        </li>
                        <li>
                            A function receives <code>(props, state)</code> and decides where to put
                            them.
                        </li>
                        <li>
                            <code>on*</code> handlers chain (internal first), <code>className</code>{' '}
                            joins, refs merge — you cannot accidentally kill internal behaviour.
                        </li>
                    </ul>
                </Note>
            </AsideHeaderNext.Content>
        </AsideHeaderNext.Root>
    </Frame>
);

/* ------------------------------------------------------------------ *
 * 6. One ItemList in three places + data-driven vs composition
 * ------------------------------------------------------------------ */

export const Lists: StoryFn = () => (
    <Frame>
        <AsideHeaderNext.Root>
            <AsideHeaderNext.Logo icon={House} text="Lists" href="#" />

            {/* data-driven — one-line migration from menuItems={[…]} */}
            <AsideHeaderNext.Subheader
                items={[
                    {id: 'search', icon: Magnifier, children: 'Search'},
                    {id: 'create', icon: Gear, children: 'Create'},
                ]}
            />

            <AsideHeaderNext.Menu
                aria-label="Main navigation"
                items={manyMenuItems}
                overflow="scroll"
            />

            {/* composition — same rows, same list implementation */}
            <AsideHeaderNext.Footer>
                <AsideHeaderNext.Item id="docs" icon={CirclesIntersection}>
                    Documentation
                </AsideHeaderNext.Item>
                <AsideHeaderNext.Item id="support" icon={Person}>
                    Support
                </AsideHeaderNext.Item>
            </AsideHeaderNext.Footer>

            <AsideHeaderNext.CollapseButton />

            <AsideHeaderNext.Content>
                <Note title="Subheader / Menu / Footer are presets over one ItemList">
                    <ul>
                        <li>
                            Subheader is data-driven, footer is composed — same rows, same list
                            implementation, no duplicated mapping.
                        </li>
                        <li>
                            <code>overflow=&quot;scroll&quot;</code> is a list prop, so it works in
                            any list rather than only in the menu.
                        </li>
                        <li>
                            Tab through the rail: every row is its own tab stop, in all three lists.
                            Arrow keys are reserved for overlays.
                        </li>
                    </ul>
                </Note>
            </AsideHeaderNext.Content>
        </AsideHeaderNext.Root>
    </Frame>
);

/* ------------------------------------------------------------------ *
 * 7. Manual layout
 * ------------------------------------------------------------------ */

export const ManualLayout: StoryFn = () => (
    <Frame>
        <AsideHeaderNext.Root layout="manual">
            <div style={{display: 'flex', height: '100%'}}>
                <AsideHeaderNext.Aside>
                    <div style={{padding: 8}}>
                        <AsideHeaderNext.Logo {...DEFAULT_LOGO} />
                    </div>
                    <AsideHeaderNext.Menu aria-label="Main navigation" items={menuItemsShowcase} />
                    <AsideHeaderNext.CollapseButton />
                </AsideHeaderNext.Aside>

                <div style={{flex: 1, overflow: 'auto'}}>
                    <Note title='layout="manual"'>
                        Same tree, same props — only the placement is yours. Replaces{' '}
                        <code>PageLayout</code> / <code>PageLayoutAside</code>.
                    </Note>
                    <pre style={{padding: 20, whiteSpace: 'pre-wrap'}}>{poem}</pre>
                </div>
            </div>
        </AsideHeaderNext.Root>
    </Frame>
);
