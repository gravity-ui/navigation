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
    return <FooterItem compact={true} id="item1" title="Item 1" />;
}

// MobileLogo with compact -> isExpanded prop
function MobileExample() {
    return <MobileLogo compact={false} text="Logo" />;
}

// renderFooter callback with destructuring
function CallbackExample() {
    return (
        <AsideHeader
            renderFooter={({compact}) => (
                <FooterItem compact={compact} id="footer" title="Footer" />
            )}
        />
    );
}

// AsideHeader: compact → pinned, onChangeCompact → onChangePinned
function AsideHeaderExample() {
    const [compact, setCompact] = React.useState(false);
    return (
        <AsideHeader
            compact={compact}
            onChangeCompact={setCompact}
            menuItems={[]}
            renderContent={() => null}
        />
    );
}

// PageLayout: compact → pinned, onChangeCompact → onChangePinned
function PageLayoutExample() {
    const [isCompact, setCompact] = React.useState(true);
    return (
        <PageLayout compact={isCompact} onChangeCompact={setCompact}>
            <PageLayoutAside menuItems={[]} />
            <PageLayout.Content>Content</PageLayout.Content>
        </PageLayout>
    );
}
