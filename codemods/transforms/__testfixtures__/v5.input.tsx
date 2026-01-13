/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {AsideHeader, FooterItem, MobileLogo} from '@gravity-ui/navigation';

// Basic FooterItem with compact prop
function BasicExample() {
    return <FooterItem compact={true} id="item1" title="Item 1" />;
}

// MobileLogo with compact prop
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
