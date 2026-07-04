import {
    AntennaSignal,
    Bell,
    BookOpen,
    Bucket,
    ChartColumn,
    ChartLine,
    ChartPie,
    Cloud,
    CloudArrowUpIn,
    CopyCheck,
    CreditCard,
    Database,
    FileText,
    Gear,
    HardDrive,
    House,
    Key,
    LayoutHeaderCellsLarge,
    ListTimeline,
    Person,
    Persons,
    PlugConnection,
    Route,
    ShieldCheck,
    ShieldKeyhole,
    Sliders,
    Terminal,
} from '@gravity-ui/icons';

import {MenuGroup} from '../../types';
import {AsideHeaderItem, AsideHeaderProps} from '../types';

export const menuGroupsData: MenuGroup[] = [
    {id: 'analytics', title: 'Analytics', icon: ChartColumn, popupTitle: 'Analytics'},
    {id: 'monitoring', title: 'Monitoring', icon: Cloud, popupTitle: 'Monitoring'},
    {id: 'storage', title: 'Storage', icon: Database, popupTitle: 'Storage'},
    {id: 'security', title: 'Security', icon: ShieldKeyhole, popupTitle: 'Security'},
    {id: 'settings', title: 'Settings', icon: Gear, popupTitle: 'Settings'},
];

/** First group expanded; remaining groups collapsed (menuOverflow="scroll" inline groups). */
export const defaultCollapsedMenuGroupIdsExceptFirst: AsideHeaderProps['defaultCollapsedMenuGroupIds'] =
    Object.fromEntries(menuGroupsData.slice(1).map((group) => [group.id, true]));

/** Demo menu with `groupId`/`category` for All pages grouping; default matches `defaultMenuItems`. */
export const menuItemsWithGroupsForAllPages: AsideHeaderProps['menuItems'] = [
    {id: 'home', title: 'Home', icon: Gear, category: 'General'},
    {
        id: 'analytics-overview',
        title: 'Overview',
        icon: ChartPie,
        groupId: 'analytics',
        category: 'Analytics',
        current: true,
    },
    {
        id: 'analytics-reports',
        title: 'Reports',
        icon: FileText,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'analytics-dashboards',
        title: 'Dashboards',
        icon: LayoutHeaderCellsLarge,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'analytics-metrics',
        title: 'Metrics',
        icon: ChartLine,
        groupId: 'analytics',
        category: 'Analytics',
    },
    {
        id: 'monitoring-alerts',
        title: 'Alerts',
        icon: Bell,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-logs',
        title: 'Logs',
        icon: Terminal,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-traces',
        title: 'Traces',
        icon: Route,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'monitoring-uptime',
        title: 'Uptime',
        icon: AntennaSignal,
        groupId: 'monitoring',
        category: 'Monitoring',
    },
    {
        id: 'storage-buckets',
        title: 'Buckets',
        icon: Bucket,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-databases',
        title: 'Databases',
        icon: Database,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-volumes',
        title: 'Volumes',
        icon: HardDrive,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-snapshots',
        title: 'Snapshots',
        icon: CopyCheck,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'storage-backups',
        title: 'Backups',
        icon: CloudArrowUpIn,
        groupId: 'storage',
        category: 'Storage',
    },
    {
        id: 'security-access',
        title: 'Access keys',
        icon: Key,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-roles',
        title: 'Roles',
        icon: Persons,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-audit',
        title: 'Audit log',
        icon: ListTimeline,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'security-policies',
        title: 'Policies',
        icon: ShieldCheck,
        groupId: 'security',
        category: 'Security',
    },
    {
        id: 'general-settings',
        title: 'General',
        icon: Sliders,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'user-settings',
        title: 'Users',
        icon: Person,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'billing-settings',
        title: 'Billing',
        icon: CreditCard,
        groupId: 'settings',
        category: 'Settings',
    },
    {
        id: 'integrations-settings',
        title: 'Integrations',
        icon: PlugConnection,
        groupId: 'settings',
        category: 'Settings',
    },
    {id: 'help', title: 'Help', icon: Gear, category: 'General'},
];

export const menuItemsForNavigationConcept: AsideHeaderItem[] = menuItemsWithGroupsForAllPages.map(
    (item) => {
        if (item.id === 'home') {
            return {...item, icon: House};
        }
        if (item.id === 'analytics-reports') {
            return {...item, quickAccess: true};
        }
        if (item.id === 'analytics-dashboards') {
            return {
                ...item,
                title: 'Weekly operational performance',
                titleLines: 2,
            };
        }
        if (item.id === 'help') {
            return {...item, icon: BookOpen};
        }
        return item;
    },
);

export const menuItemsForNavigationConceptFlat: AsideHeaderItem[] =
    menuItemsForNavigationConcept.map(({groupId: _groupId, ...item}) => item);

export const menuGroupsStoryArgTypes = {
    menuGroupNestedIcons: {
        control: 'boolean' as const,
        description: 'Show icons on nested menu group items',
    },
    showQuickAccessSection: {
        control: 'boolean' as const,
        description: 'Show the pinned quick access section and pin controls on menu items',
    },
    quickAccessHighlightInMainMenu: {
        control: 'boolean' as const,
        description:
            'Keep the active item highlighted in the main menu when it is also in quick access',
    },
};
