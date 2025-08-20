'use client';

import {Bell, ChartColumn, FileText, Folder, Gear, Ghost, House, Person} from '@gravity-ui/icons';
import {AsideHeader, FooterItem} from '@gravity-ui/navigation';
import {Theme, ThemeProvider} from '@gravity-ui/uikit';
import React from 'react';

import {DARK, DEFAULT_THEME, Wrapper} from '../Wrapper';

interface AppProps {
    children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({children}) => {
    const [theme, setTheme] = React.useState<Theme>(DEFAULT_THEME);
    const [compact, setCompact] = React.useState(false);
    const isDark = theme === DARK;

    const menuItems = [
        {
            id: 'home',
            title: 'Главная',
            icon: House,
            current: typeof window !== 'undefined' && window.location.pathname === '/',
            href: '/',
        },
        {
            id: 'components-test',
            title: 'Тест компонентов',
            icon: Gear,
            current:
                typeof window !== 'undefined' && window.location.pathname === '/components-test',
            href: '/components-test',
            tooltipText: 'Тестирование отдельных компонентов навигации',
        },
        {
            id: 'analytics',
            title: 'Аналитика',
            icon: ChartColumn,
            tooltipText: 'Просмотр аналитики и отчетов',
        },
        {
            id: 'documents',
            title: 'Документы',
            icon: FileText,
            tooltipText: 'Управление документами',
        },
        {
            id: 'projects',
            title: 'Проекты',
            icon: Folder,
            tooltipText: 'Список проектов',
        },
        {
            id: 'notifications',
            title: 'Уведомления',
            icon: Bell,
            tooltipText: 'Центр уведомлений',
        },
    ];

    const footerItems = [
        {
            id: 'profile',
            title: 'Профиль',
            icon: Person,
            tooltipText: 'Настройки профиля',
        },
        {
            id: 'settings',
            title: 'Настройки',
            icon: Gear,
            tooltipText: 'Системные настройки',
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <AsideHeader
                logo={{
                    icon: Ghost,
                    text: 'CSS Modules Test',
                    href: '/',
                }}
                compact={compact}
                onChangeCompact={setCompact}
                menuItems={menuItems}
                defaultMenuItems={menuItems}
                onMenuItemsChanged={() => {
                    /* необходимо для отображения пункта "All pages" */
                }}
                topAlert={{
                    title: 'Maintenance',
                    view: 'filled',
                    message: 'Scheduled maintenance is being performed',
                    closable: true,
                    // Просим библиотеку зафиксировать отступ на SSR
                    preloadHeight: true,
                    //dense: true,
                }}
                editMenuProps={{
                    enableSorting: true,
                }}
                multipleTooltip
                renderContent={() => (
                    <Wrapper setTheme={setTheme} isDark={isDark}>
                        <div style={{padding: '20px'}}>
                            <h1>Тест CSS-модулей @gravity-ui/navigation</h1>
                            <p>
                                Это приложение использует локальную сборку библиотеки навигации для
                                тестирования CSS-модулей.
                            </p>
                            <div style={{marginTop: '20px'}}>
                                <h2>Проверяемые функции:</h2>
                                <ul>
                                    <li>✅ CSS-модули с суффиксами классов</li>
                                    <li>✅ Отдельные CSS файлы для каждого компонента</li>
                                    <li>✅ Автоматический импорт стилей</li>
                                    <li>✅ Отсутствие мигания в SSR</li>
                                    <li>✅ Tree-shaking стилей</li>
                                </ul>
                            </div>
                            {children}
                        </div>
                    </Wrapper>
                )}
                renderFooter={({compact}) => (
                    <React.Fragment>
                        {footerItems.map((item) => (
                            <FooterItem key={item.id} item={item} compact={compact} />
                        ))}
                    </React.Fragment>
                )}
            />
        </ThemeProvider>
    );
};
