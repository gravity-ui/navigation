import * as React from 'react';

import {ChevronRight} from '@gravity-ui/icons';
import {Icon, IconProps} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {ActiveScopeProvider, useActiveScope, useReportActive} from './ActiveScope';
import {Item, ItemProps} from './Item';
import {ItemList, ItemListEntry} from './ItemList';
import {useLayoutContext} from './LayoutContext';
import {useParentOverlay} from './OverlayContext';
import {Popup, PopupContent} from './Popup';
import {collectParts, withPart} from './internal/parts';
import {RenderProp} from './internal/useRenderElement';

import styles from './GroupItem.module.scss';

const b = createBlock('aside-header-next-group', styles);

export interface GroupItemState extends Record<string, unknown> {
    expanded: boolean;
    active: boolean;
    hasActiveDescendant: boolean;
    open: boolean;
    compact: boolean;
}

export interface GroupItemProps {
    id: string;
    /** Shorthands instead of composing `GroupItem.Trigger` / `.Content`. */
    icon?: IconProps['data'];
    title?: React.ReactNode;
    items?: ItemListEntry[];
    children?: React.ReactNode;
    expanded?: boolean;
    defaultExpanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** Expand when a descendant becomes active. Uncontrolled mode only. */
    expandOnActive?: boolean;
    /** What a collapsed rail does with the children. */
    compactBehavior?: 'flyout' | 'flat';
    popupTitle?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    className?: string;
    render?: RenderProp<GroupItemState>;
}

interface GroupContextValue {
    id: string;
    expanded: boolean;
    toggle: () => void;
    hasActiveDescendant: boolean;
    active: boolean;
    disabled?: boolean;
    /** Children live in a flyout, so the trigger keeps the highlight. */
    flyoutMode: boolean;
}

const GroupContext = React.createContext<GroupContextValue | null>(null);

function useGroupContext(part: string): GroupContextValue {
    const ctx = React.useContext(GroupContext);
    if (!ctx) {
        throw new Error(`<${part}> must be used inside <AsideHeaderNext.GroupItem>.`);
    }
    return ctx;
}

export type GroupItemTriggerProps = Omit<ItemProps, 'id' | 'href'>;

function GroupItemTriggerComponent(props: GroupItemTriggerProps) {
    const group = useGroupContext('AsideHeaderNext.GroupItem.Trigger');
    const {compact} = useLayoutContext();
    // Present only in flyout mode, where the group renders a `Popup` around us.
    const overlay = useParentOverlay();
    const flyout = group.flyoutMode && overlay;

    const chevron = (
        <span className={b('chevron', {expanded: group.expanded && !compact})}>
            <Icon data={ChevronRight} size={compact ? 10 : 16} />
        </span>
    );

    const open = flyout ? overlay.open : group.expanded;
    // Inline expansion must NOT highlight the trigger: with the children
    // visible, the highlight belongs to the active child.
    const highlighted = group.active || (flyout && overlay.open);

    return (
        <Item
            {...props}
            id={group.id}
            ref={flyout ? overlay.setAnchor : props.ref}
            disabled={props.disabled ?? group.disabled}
            active={props.active ?? (highlighted || undefined)}
            rightAdornment={props.rightAdornment ?? chevron}
            data-has-active-descendant={group.hasActiveDescendant || undefined}
            data-expanded={group.expanded && !group.flyoutMode ? true : undefined}
            data-open={flyout && overlay.open ? true : undefined}
            aria-haspopup={flyout ? 'menu' : undefined}
            aria-expanded={open}
            aria-controls={flyout && overlay.open ? overlay.contentId : undefined}
            onMouseEnter={flyout ? overlay.onPointerEnter : undefined}
            onMouseLeave={flyout ? overlay.onPointerLeave : undefined}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
                props.onClick?.(event);
                if (flyout) {
                    overlay.setOpen(!overlay.open);
                } else {
                    group.toggle();
                }
            }}
        />
    );
}

export const GroupItemTrigger = withPart(GroupItemTriggerComponent, 'trigger');

export interface GroupItemContentProps {
    children?: React.ReactNode;
    className?: string;
}

function GroupItemContentComponent(props: GroupItemContentProps) {
    return <React.Fragment>{props.children}</React.Fragment>;
}

export const GroupItemContent = withPart(GroupItemContentComponent, 'content');

/**
 * A list row that has children. Named `GroupItem`, not `Group`, because it is a
 * row like any other: it occupies a line, takes part in navigation and is
 * highlighted by the same rules.
 *
 * Which presentation the children get — inline disclosure or a flyout — is the
 * group's decision, not the consumer's. The children JSX is identical for both.
 */
export function GroupItem(props: GroupItemProps) {
    const {
        id,
        icon,
        title,
        items,
        children,
        expanded: expandedProp,
        defaultExpanded = false,
        onExpandedChange,
        expandOnActive = true,
        compactBehavior = 'flyout',
        popupTitle,
        active: activeProp,
        disabled,
        className,
    } = props;

    const {compact} = useLayoutContext();
    const {store, hasActiveDescendant} = useActiveScope();

    const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
    const expanded = expandedProp ?? uncontrolledExpanded;
    const controlled = expandedProp !== undefined;

    const setExpanded = React.useCallback(
        (next: boolean) => {
            if (!controlled) {
                setUncontrolledExpanded(next);
            }
            onExpandedChange?.(next);
        },
        [controlled, onExpandedChange],
    );

    // In a collapsed rail the children live in a flyout, which does not count
    // as "expanded in place" — the trigger stays the anchor and keeps its
    // highlight instead of blinking while the popup is open.
    const flyoutMode = compact && compactBehavior === 'flyout';
    const childrenVisible = expanded && !flyoutMode;

    // Uncontrolled only: never fire onExpandedChange without a user action.
    React.useEffect(() => {
        if (expandOnActive && !controlled && hasActiveDescendant && !uncontrolledExpanded) {
            setUncontrolledExpanded(true);
        }
    }, [expandOnActive, controlled, hasActiveDescendant, uncontrolledExpanded]);

    const active = activeProp ?? (hasActiveDescendant && !childrenVisible);

    // Bubble up, so an enclosing group knows the active node is inside.
    useReportActive(id, active || hasActiveDescendant);

    const {parts} = collectParts(children);
    const trigger = parts.trigger ?? <GroupItemTrigger icon={icon}>{title}</GroupItemTrigger>;
    const content = parts.content ?? (items ? <GroupItemContent /> : null);
    const contentChildren = React.isValidElement<GroupItemContentProps>(content)
        ? content.props.children
        : null;

    const listProps = items ? {items} : {children: contentChildren};

    const groupValue = React.useMemo<GroupContextValue>(
        () => ({
            id,
            expanded,
            toggle: () => setExpanded(!expanded),
            hasActiveDescendant,
            active,
            disabled,
            flyoutMode,
        }),
        [id, expanded, setExpanded, hasActiveDescendant, active, disabled, flyoutMode],
    );

    const body = flyoutMode ? (
        <Popup disabled={disabled}>
            {trigger}
            <PopupContent title={popupTitle ?? title}>
                <ItemList place="popup" keyboard="roving" {...listProps} />
            </PopupContent>
        </Popup>
    ) : (
        <React.Fragment>
            {trigger}
            {expanded ? (
                <div
                    className={b('content')}
                    role="group"
                    aria-label={typeof title === 'string' ? title : undefined}
                >
                    <ItemList place="menu" {...listProps} />
                </div>
            ) : null}
        </React.Fragment>
    );

    return (
        <GroupContext.Provider value={groupValue}>
            <ActiveScopeProvider value={store}>
                <div className={b(null, className)}>{body}</div>
            </ActiveScopeProvider>
        </GroupContext.Provider>
    );
}

GroupItem.Trigger = GroupItemTrigger;
GroupItem.Content = GroupItemContent;
