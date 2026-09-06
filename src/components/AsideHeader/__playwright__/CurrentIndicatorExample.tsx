import React from 'react';

import {Gear, Magnifier} from '@gravity-ui/icons';

import {
    fullNavigationCollapsedGroupIds,
    fullNavigationMenuGroups,
    fullNavigationMenuItems,
} from '../__stories__/fullNavigationMoc';
import {FooterItem} from '../components/FooterItem/FooterItem';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import type {AsideHeaderMenuDensity} from '../density';
import type {AsideHeaderItem} from '../types';

export interface CurrentIndicatorExampleProps {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderMenuDensity;
    initialCurrentId?: string;
    mode?: 'group' | 'short-group' | 'plain' | 'more' | 'ambiguous';
    collapsedAnalytics?: boolean;
    headerDecoration?: boolean;
    enableQuickAccess?: boolean;
    pinCurrent?: boolean;
    quickAccessHighlightInMainMenu?: boolean;
    selectionColor?: string;
    replaceableTarget?: boolean;
}

const moreItems: AsideHeaderItem[] = Array.from({length: 28}, (_, index) => ({
    id: `more-${index}`,
    title: `Navigation item ${index}`,
    icon: Gear,
}));

// Menu state deliberately lives below PageLayout/AsideLayoutTransition, so a
// current change does not rerender the transition boundary itself.
function LocalMenu({
    onChangeCompact,
    ...props
}: CurrentIndicatorExampleProps & {onChangeCompact: (compact: boolean) => void}) {
    const [currentId, setCurrentId] = React.useState(
        props.initialCurrentId ?? (props.mode === 'more' ? 'more-26' : 'analytics-dashboards'),
    );
    const [version, setVersion] = React.useState(0);
    const [visible, setVisible] = React.useState(true);
    const [targetVersion, setTargetVersion] = React.useState(0);
    let source = props.mode === 'more' ? moreItems : fullNavigationMenuItems;
    if (props.mode === 'short-group')
        source = source.filter(
            (item) => item.groupId === 'analytics' && item.id !== 'analytics-metrics',
        );
    const menuItems = source.map((item) => ({
        ...item,
        current:
            item.id === currentId ||
            (props.mode === 'ambiguous' && item.id === 'analytics-reports'),
        quickAccess: props.pinCurrent ? item.id === currentId : item.id === 'home',
        onItemClick: (clicked: AsideHeaderItem) => setCurrentId(clicked.id),
        itemWrapper:
            props.replaceableTarget && item.id === 'analytics-overview'
                ? (((params, makeItem) => (
                      <React.Fragment key={targetVersion}>{makeItem(params)}</React.Fragment>
                  )) as AsideHeaderItem['itemWrapper'])
                : item.itemWrapper,
    }));
    const menuGroups =
        props.mode === 'plain' || props.mode === 'more' ? undefined : fullNavigationMenuGroups;
    return (
        <>
            {visible && (
                <PageLayoutAside
                    key={version}
                    headerDecoration={props.headerDecoration}
                    logo={{icon: Gear, text: 'Indicator test'}}
                    subheaderItems={[
                        {id: 'search', title: 'Search', icon: Magnifier},
                        {id: 'services', title: 'Services', icon: Gear},
                    ]}
                    menuItems={menuItems}
                    menuGroups={menuGroups}
                    menuOverflow="scroll"
                    defaultCollapsedMenuGroupIds={{
                        ...fullNavigationCollapsedGroupIds,
                        analytics: Boolean(props.collapsedAnalytics),
                    }}
                    enableQuickAccess={props.enableQuickAccess}
                    quickAccessHighlightInMainMenu={props.quickAccessHighlightInMainMenu}
                    onChangeCompact={onChangeCompact}
                    onMenuItemsChanged={props.mode === 'short-group' ? undefined : () => {}}
                    renderFooter={({compact}) => (
                        <FooterItem id="help" title="Help" icon={Gear} compact={compact} />
                    )}
                />
            )}
            <PageLayout.Content>
                <button
                    data-qa="indicator-replace-target"
                    onClick={() => setTargetVersion((previous) => previous + 1)}
                >
                    Replace current row
                </button>
                <button
                    data-qa="indicator-change-current"
                    onClick={() =>
                        setCurrentId(props.mode === 'more' ? 'more-1' : 'analytics-reports')
                    }
                >
                    Change current
                </button>
                <button
                    data-qa="indicator-change-top-level-current"
                    onClick={() => setCurrentId('home')}
                >
                    Select Home
                </button>
                <button
                    data-qa="indicator-remount-target"
                    onClick={() => setVersion((previous) => previous + 1)}
                >
                    Remount aside
                </button>
                <button data-qa="indicator-unmount-aside" onClick={() => setVisible(false)}>
                    Unmount aside
                </button>
                <span data-qa="indicator-current-id">{currentId}</span>
            </PageLayout.Content>
        </>
    );
}

export function CurrentIndicatorExample(props: CurrentIndicatorExampleProps) {
    const [compact, setCompact] = React.useState(props.initialCompact ?? false);
    return (
        <div data-qa="current-indicator-fixture" style={{height: '100vh'}}>
            <style>{`
                [data-qa="current-indicator-fixture"] {
                    --gn-aside-header-item-current-background-color: ${props.selectionColor ?? 'rgb(17, 85, 221)'};
                    --gn-aside-header-item-current-background-color-hover: ${props.selectionColor ?? 'rgb(17, 85, 221)'};
                    --gn-aside-header-decoration-expanded-background-color: rgb(246, 211, 101);
                }
                [data-qa="current-indicator-fixture"] [class*="gn-aside-header__aside-content_"] {
                    --gradient-height: 2000px;
                }
            `}</style>
            <PageLayout compact={compact} menuDensity={props.menuDensity}>
                <LocalMenu {...props} onChangeCompact={setCompact} />
            </PageLayout>
        </div>
    );
}
