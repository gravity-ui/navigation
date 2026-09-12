import React from 'react';

import {Gear, Person} from '@gravity-ui/icons';
import {Modal, Popup} from '@gravity-ui/uikit';

import {FooterItem} from '../components/FooterItem/FooterItem';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import type {AsideHeaderMenuDensity} from '../density';

export function CollapseButtonExample({
    initialCompact = true,
    menuDensity = 'default',
    direction = 'ltr',
    footer = 'regular',
    contentsWrapper = false,
    topAlert = false,
    below = false,
    raised = false,
    responsiveFooter = false,
    movingFooter = false,
}: {
    initialCompact?: boolean;
    menuDensity?: AsideHeaderMenuDensity;
    direction?: 'ltr' | 'rtl';
    footer?: 'regular' | 'action' | 'two-line' | 'empty' | 'custom';
    contentsWrapper?: boolean;
    topAlert?: boolean;
    below?: boolean;
    raised?: boolean;
    responsiveFooter?: boolean;
    movingFooter?: boolean;
}) {
    const [compact, setCompact] = React.useState(initialCompact);
    const [transition, setTransition] = React.useState(true);
    const [changes, setChanges] = React.useState(0);
    const [actions, setActions] = React.useState(0);
    const [drawer, setDrawer] = React.useState(false);
    const [popup, setPopup] = React.useState(false);
    const [modal, setModal] = React.useState(false);
    const [reverse, setReverse] = React.useState(false);
    const [hideLast, setHideLast] = React.useState(false);
    const [hideToggle, setHideToggle] = React.useState(false);
    const modalSubscribers = React.useRef(new Set<(open: boolean) => void>());
    React.useEffect(() => {
        modalSubscribers.current.forEach((subscriber) => subscriber(modal));
    }, [modal]);
    const getRowDisplay = (id: string) => {
        if (hideLast && id === 'account') return 'none';
        if (responsiveFooter && id === 'account') return undefined;
        return 'contents';
    };
    const movingFooterHeight = compact ? 20 : 70;
    const aside = (
        <PageLayoutAside
            logo={{text: 'Navigation', icon: Gear}}
            menuItems={[{id: 'home', title: 'Home', icon: Gear, pinned: true}]}
            onMenuItemsChanged={() => undefined}
            hideCollapseButton={hideToggle}
            openModalSubscriber={(subscriber) => {
                modalSubscribers.current.add(subscriber);
            }}
            expandTitle="Expand navigation"
            collapseTitle="Collapse navigation"
            onChangeCompact={(value) => {
                setCompact(value);
                setChanges((count) => count + 1);
            }}
            panelItems={[
                {
                    id: 'custom-panel',
                    open: drawer,
                    children: <div style={{width: 260, height: '100%'}}>Custom panel content</div>,
                },
            ]}
            renderFooter={({asideRef}) => (
                <React.Fragment>
                    {footer === 'custom' ? <div>Custom footer</div> : null}
                    {footer !== 'empty' && footer !== 'custom'
                        ? (reverse ? ['account', 'settings'] : ['settings', 'account']).map(
                              (id) => (
                                  <div
                                      key={id}
                                      className={
                                          responsiveFooter && id === 'account'
                                              ? 'responsive-account'
                                              : undefined
                                      }
                                      style={{display: getRowDisplay(id)}}
                                  >
                                      <FooterItem
                                          id={id}
                                          compact={compact}
                                          title={
                                              id === 'account'
                                                  ? 'Account with a longer display name'
                                                  : 'Settings'
                                          }
                                          icon={id === 'account' ? Person : Gear}
                                          type={footer === 'action' ? 'action' : 'regular'}
                                          titleLines={footer === 'two-line' ? 2 : 1}
                                          rightAdornment={
                                              compact ? undefined : (
                                                  <span data-qa="adornment">3</span>
                                              )
                                          }
                                          enableTooltip
                                          bringForward
                                          onItemClick={() => setActions((count) => count + 1)}
                                      />
                                  </div>
                              ),
                          )
                        : null}
                    {below || movingFooter ? (
                        <div
                            data-qa="below-footer"
                            style={{height: movingFooter ? movingFooterHeight : 37}}
                        >
                            Below
                        </div>
                    ) : null}
                    <Popup open={popup} anchorRef={asideRef} placement="right-end">
                        <div style={{width: 180, height: 90}}>Consumer popup</div>
                    </Popup>
                </React.Fragment>
            )}
        />
    );

    return (
        <div
            dir={direction}
            style={
                {
                    width: '100%',
                    ...(raised ? {'--gn-aside-header-z-index': 350} : {}),
                } as React.CSSProperties
            }
        >
            {responsiveFooter ? (
                <style>
                    {
                        '.responsive-account { display: contents; } @media (max-width: 900px) { .responsive-account { display: none; } }'
                    }
                </style>
            ) : null}
            <PageLayout
                compact={compact}
                compactTransition={transition}
                menuDensity={menuDensity}
                topAlert={
                    topAlert ? {title: 'Maintenance', message: 'Scheduled maintenance'} : undefined
                }
            >
                {contentsWrapper ? (
                    <div data-qa="contents-wrapper" style={{display: 'contents'}}>
                        {aside}
                    </div>
                ) : (
                    aside
                )}
                <PageLayout.Content>
                    <div style={{padding: 32, minHeight: 1100}}>
                        <button onClick={() => setDrawer((value) => !value)}>
                            Toggle custom panel
                        </button>
                        <button onClick={() => setTransition((value) => !value)}>
                            Toggle transition
                        </button>
                        <button onClick={() => setReverse((value) => !value)}>
                            Reverse footer
                        </button>
                        <button onClick={() => setHideLast((value) => !value)}>Hide account</button>
                        <button onClick={() => setHideToggle((value) => !value)}>
                            Hide toggle
                        </button>
                        <button onClick={() => setPopup((value) => !value)}>Toggle popup</button>
                        <button onClick={() => setModal((value) => !value)}>Toggle modal</button>
                        <output aria-label="Compact changes">{changes}</output>
                        <output aria-label="Footer actions">{actions}</output>
                        <Modal open={modal} onClose={() => setModal(false)}>
                            <div>Modal content</div>
                        </Modal>
                    </div>
                </PageLayout.Content>
            </PageLayout>
        </div>
    );
}
