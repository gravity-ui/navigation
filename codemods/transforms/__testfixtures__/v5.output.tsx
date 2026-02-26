/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {AsideHeader, FooterItem, MobileLogo} from '@gravity-ui/navigation';

// Basic FooterItem with isExpanded prop
function BasicExample() {
    return <FooterItem isExpanded={false} id="item1" title="Item 1" />;
}

// MobileLogo with isExpanded prop
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
