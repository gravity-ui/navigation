/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {AsideHeader, PageLayout, PageLayoutAside, FooterItem} from '@gravity-ui/navigation';

// AsideHeader: compact → pinned (inverted), onChangeCompact → onChangePinned
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

// Literals
function Literals() {
    return (
        <>
            <AsideHeader pinned={false} menuItems={[]} renderContent={() => null} />
            <AsideHeader pinned={true} menuItems={[]} renderContent={() => null} />
            <PageLayout pinned={true}>
                <PageLayout.Content />
            </PageLayout>
        </>
    );
}

// FooterItem compact is NOT transformed by this codemod (stays compact)
function Unchanged() {
    return <FooterItem compact={true} id="x" title="Y" />;
}
