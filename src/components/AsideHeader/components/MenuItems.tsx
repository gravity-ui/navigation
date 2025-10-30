import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';

import {CompositeBar} from '../../CompositeBar/CompositeBar';
import {MenuItem} from '../../types';
import {MenuGroupWithItems} from '../hooks/useGroupedMenuItems';
import i18n from '../i18n';
import {b} from '../utils';

interface Props {
    compositeIdBase: string;
    groupedMenuItems: MenuGroupWithItems[];
    visibleMenuItems: MenuItem[];
    menuMoreTitle?: string;
    multipleTooltip?: boolean;
    onItemClick: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onMoreClick?: () => void;
}

export const MenuItems: React.FC<Props> = ({
    compositeIdBase,
    groupedMenuItems,
    visibleMenuItems,
    menuMoreTitle,
    multipleTooltip,
    onItemClick,
    onMoreClick,
}) => {
    const [collapsedIds, setCollapsedIds] = React.useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};

        groupedMenuItems.forEach((g) => {
            if (g.collapsible && g.collapsedByDefault) {
                initial[g.id] = true;
            }
        });
        return initial;
    });

    const toggleGroup = (groupId: string) => {
        setCollapsedIds((prev) => ({...prev, [groupId]: !prev[groupId]}));
    };

    if (groupedMenuItems.length > 0) {
        return (
            <>
                {groupedMenuItems.map((group) => {
                    const isCollapsible = Boolean(group.collapsible);
                    const isCollapsed = Boolean(collapsedIds[group.id]);
                    const showItems = !isCollapsible || !isCollapsed;

                    return (
                        <div key={group.id} className={b('menu-group')}>
                            {(group.title || group.icon || isCollapsible) && (
                                <div className={b('menu-group-header')}>
                                    {group.icon ? (
                                        <Icon
                                            data={group.icon}
                                            size={16}
                                            className={b('menu-group-icon')}
                                        />
                                    ) : null}

                                    <Text variant="body-1">{group.title}</Text>

                                    {isCollapsible ? (
                                        <Button
                                            view="flat-secondary"
                                            size="s"
                                            className={b('menu-group-toggle')}
                                            onClick={() => toggleGroup(group.id)}
                                            aria-label={
                                                isCollapsed ? 'Expand group' : 'Collapse group'
                                            }
                                        >
                                            <Icon
                                                data={isCollapsed ? ChevronUp : ChevronDown}
                                                size={14}
                                            />
                                        </Button>
                                    ) : (
                                        <span className={b('menu-group-toggle-placeholder')} />
                                    )}
                                </div>
                            )}

                            {showItems ? (
                                <CompositeBar
                                    compositeId={`${compositeIdBase}-${group.id}`}
                                    className={b('menu-items')}
                                    type="menu"
                                    items={group.items}
                                    menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
                                    onItemClick={onItemClick}
                                    onMoreClick={onMoreClick}
                                    multipleTooltip={multipleTooltip}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </>
        );
    }

    if (visibleMenuItems.length > 0) {
        return (
            <CompositeBar
                compositeId={compositeIdBase}
                type="menu"
                items={visibleMenuItems}
                menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
                onItemClick={onItemClick}
                onMoreClick={onMoreClick}
                multipleTooltip={multipleTooltip}
            />
        );
    }

    return <div className={b('menu-items')} />;
};
