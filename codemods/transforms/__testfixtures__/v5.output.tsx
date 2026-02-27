/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {
    AsideHeader,
    FooterItem,
    MobileLogo,
    PageLayout,
    PageLayoutAside,
} from '@gravity-ui/navigation';

// Basic FooterItem with compact -> isExpanded prop
function BasicExample() {
    return <FooterItem isExpanded={false} id="item1" title="Item 1" />;
}

// MobileLogo with compact -> isExpanded prop
function MobileExample() {
    return <MobileLogo isExpanded={true} text="Logo" />;
}

// renderFooter callback with destructuring
function CallbackExample() {
    return (
        <AsideHeader
            renderFooter={({isExpanded}) => (
                <FooterItem isExpanded={isExpanded} id="footer" title="Footer" />
            )}
        />
    );
}

// AsideHeader: compact → pinned, onChangeCompact → onChangePinned
function AsideHeaderExample() {
    const [compact, setCompact] = React.useState(false);
    return (
        <AsideHeader
            pinned={!compact}
            onChangePinned={setCompact}
            menuItems={[]}
            renderContent={() => null}
        />
    );
}

// PageLayout: compact → pinned, onChangeCompact → onChangePinned
function PageLayoutExample() {
    const [isCompact, setCompact] = React.useState(true);
    return (
        <PageLayout pinned={!isCompact} onChangePinned={setCompact}>
            <PageLayoutAside menuItems={[]} />
            <PageLayout.Content>Content</PageLayout.Content>
        </PageLayout>
    );
}
