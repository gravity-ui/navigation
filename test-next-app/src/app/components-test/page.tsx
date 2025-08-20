'use client';

import {Ghost} from '@gravity-ui/icons';
import {
    ActionBar,
    Drawer,
    DrawerItem,
    Footer as DesktopFooter,
    HotkeysPanel,
    Logo,
    MobileHeader,
    Settings,
    Title,
} from '@gravity-ui/navigation';
import {MobileFooter} from '@gravity-ui/navigation';
import {Button, DropdownMenu, Select} from '@gravity-ui/uikit';
import React from 'react';

export default function ComponentsTest() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [hotkeysOpen, setHotkeysOpen] = React.useState(false);
    const hotkeys = React.useMemo(
        () => [
            {
                title: 'General',
                items: [
                    {title: 'Copy', value: 'Ctrl+C'},
                    {title: 'Paste', value: 'Ctrl+V'},
                ],
            },
            {
                title: 'Navigation',
                items: [
                    {title: 'Open Search', value: 'Ctrl+K'},
                    {title: 'Go to Dashboard', value: 'G D'},
                ],
            },
        ],
        [],
    );

    return (
        <div style={{padding: '20px'}}>
            <h1>Тест отдельных компонентов навигации</h1>

            {/* ActionBar как в сторибуке, фиксируем в верхней части страницы */}
            <div style={{marginTop: '16px', marginBottom: '24px'}}>
                <ActionBar aria-label="Actions bar">
                    <ActionBar.Section type="secondary">
                        <ActionBar.Group>
                            <ActionBar.Item>
                                <Select
                                    value={['main']}
                                    options={[
                                        {content: 'main', value: 'main'},
                                        {content: 'dev', value: 'dev'},
                                    ]}
                                    title={'Select an environment'}
                                />
                            </ActionBar.Item>
                        </ActionBar.Group>
                    </ActionBar.Section>
                    <ActionBar.Section type="primary">
                        <ActionBar.Group pull="left">
                            <ActionBar.Item>
                                <div>Projects / @gravity-ui / navigation</div>
                            </ActionBar.Item>
                        </ActionBar.Group>
                        <ActionBar.Group pull="right">
                            <ActionBar.Item>
                                <Button href="#" view="flat">
                                    Quick Start Guide
                                </Button>
                            </ActionBar.Item>
                            <ActionBar.Item>
                                <DropdownMenu
                                    items={[
                                        {text: 'New File', action() {}},
                                        {text: 'New Folder', action() {}},
                                    ]}
                                    defaultSwitcherProps={{
                                        extraProps: {
                                            'aria-label': 'More',
                                        },
                                    }}
                                />
                            </ActionBar.Item>
                        </ActionBar.Group>
                    </ActionBar.Section>
                </ActionBar>
            </div>

            <div
                style={{
                    display: 'grid',
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    marginTop: '20px',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        border: '1px solid var(--g-color-line-generic)',
                        borderRadius: '8px',
                    }}
                >
                    <h3>Logo Component</h3>
                    <Logo icon={Ghost} text="Test Logo" href="/" iconSize={32} textSize={16} />
                </div>

                <div
                    style={{
                        padding: '20px',
                        border: '1px solid var(--g-color-line-generic)',
                        borderRadius: '8px',
                    }}
                >
                    <h3>Title Component</h3>
                    <Title>Page Title Example</Title>
                </div>
            </div>

            {/* Drawer demo */}
            <div style={{marginTop: '24px'}}>
                <h3>Drawer</h3>
                <Button view="outlined" onClick={() => setDrawerOpen(true)}>
                    Открыть Drawer
                </Button>
                <Drawer
                    keepMounted
                    onVeilClick={() => setDrawerOpen(false)}
                    onEscape={() => setDrawerOpen(false)}
                >
                    <DrawerItem
                        id="main"
                        keepMounted
                        visible={drawerOpen}
                        direction="right"
                        resizable
                    >
                        <div style={{padding: 16}}>
                            <h4 style={{marginTop: 0}}>Demo Drawer</h4>
                            <p>
                                Содержимое панели. Перетащите границу для ресайза, нажмите Esc или
                                на вуаль, чтобы закрыть.
                            </p>
                            <Button onClick={() => setDrawerOpen(false)}>Закрыть</Button>
                        </div>
                    </DrawerItem>
                </Drawer>
            </div>

            {/* HotkeysPanel demo */}
            <div style={{marginTop: '24px'}}>
                <h3>HotkeysPanel</h3>
                <Button view="outlined" onClick={() => setHotkeysOpen(true)}>
                    Показать хоткеи
                </Button>
                <HotkeysPanel
                    visible={hotkeysOpen}
                    onClose={() => setHotkeysOpen(false)}
                    title="Горячие клавиши"
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    hotkeys={hotkeys as any}
                />
            </div>

            {/* Settings demo */}
            <div style={{marginTop: '24px'}}>
                <h3>Settings</h3>
                <div style={{border: '1px solid var(--g-color-line-generic)', borderRadius: 8}}>
                    <Settings>
                        <Settings.Group groupTitle="General">
                            <Settings.Page id="general" title="General">
                                <Settings.Section id="appearance" title="Appearance">
                                    <Settings.Item id="theme" title="Theme">
                                        <div>Light / Dark (demo content)</div>
                                    </Settings.Item>
                                    <Settings.Item id="lang" title="Language">
                                        <div>English (demo content)</div>
                                    </Settings.Item>
                                </Settings.Section>
                            </Settings.Page>
                            <Settings.Page id="notifications" title="Notifications">
                                <Settings.Section id="email" title="Email">
                                    <Settings.Item id="digest" title="Daily digest">
                                        <div>Enabled (demo content)</div>
                                    </Settings.Item>
                                </Settings.Section>
                            </Settings.Page>
                        </Settings.Group>
                    </Settings>
                </div>
            </div>

            {/* Footer demos */}
            <div style={{marginTop: '24px'}}>
                <h3>Footer (desktop)</h3>
                <DesktopFooter
                    withDivider
                    menuItems={[
                        {text: 'Docs', onClick() {}},
                        {text: 'Components', onClick() {}},
                        {text: 'Guides', onClick() {}},
                        {text: 'Releases', onClick() {}},
                        {text: 'FAQ', onClick() {}},
                    ]}
                    logo={{text: 'Gravity', href: '#'}}
                    copyright="© 2025"
                />
            </div>

            <div style={{marginTop: '24px'}}>
                <h3>Footer (mobile)</h3>
                <MobileFooter
                    withDivider
                    menuItems={[
                        {text: 'Docs', onClick() {}},
                        {text: 'Components', onClick() {}},
                        {text: 'Guides', onClick() {}},
                        {text: 'Releases', onClick() {}},
                        {text: 'FAQ', onClick() {}},
                    ]}
                    logo={{text: 'Gravity', href: '#'}}
                    copyright="© 2025"
                />
            </div>

            {/* MobileHeader demo */}
            <div style={{marginTop: '24px'}}>
                <h3>MobileHeader</h3>
                <div style={{border: '1px solid var(--g-color-line-generic)', borderRadius: 8}}>
                    <MobileHeader
                        logo={{text: 'App'}}
                        burgerMenu={{
                            items: [
                                {id: 'home', title: 'Home'},
                                {id: 'settings', title: 'Settings'},
                            ],
                        }}
                        panelItems={[
                            {
                                id: 'panel1',
                                content: <div style={{padding: 16}}>Custom panel content</div>,
                            },
                        ]}
                        renderContent={() => (
                            <div style={{padding: 16}}>Page content below header</div>
                        )}
                    />
                </div>
            </div>

            {/* TopAlert активирован через проп AsideHeader.topAlert в лэйауте */}

            <div
                style={{
                    marginTop: '40px',
                    padding: '20px',
                    background: 'var(--g-color-base-misc)',
                    borderRadius: '8px',
                }}
            >
                <h3>Инструкции для проверки CSS-модулей:</h3>
                <ol>
                    <li>Откройте DevTools (F12)</li>
                    <li>Перейдите на вкладку Elements/Элементы</li>
                    <li>Найдите любой элемент навигации на странице</li>
                    <li>
                        Проверьте, что классы имеют суффиксы:{' '}
                        <code>ComponentName-module__className___hash</code>
                    </li>
                    <li>Убедитесь, что стили применяются корректно</li>
                    <li>Проверьте, что нет мигания при загрузке страницы</li>
                </ol>
            </div>
        </div>
    );
}
