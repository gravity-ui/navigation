/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {FooterItem, MobileLogo} from '@gravity-ui/navigation';

// Test 1: Literal boolean values
function LiteralBooleans() {
    return (
        <>
            <FooterItem compact={true} id="item1" title="Item 1" />
            <FooterItem compact={false} id="item2" title="Item 2" />
            <MobileLogo compact={true} text="Logo" />
        </>
    );
}

// Test 2: Shorthand boolean (compact without value means compact={true})
function ShorthandBoolean() {
    return <FooterItem compact id="item3" title="Item 3" />;
}

// Test 3: Variable reference
function VariableReference() {
    const isCompact = true;
    const someState = false;

    return (
        <>
            <FooterItem compact={isCompact} id="item4" title="Item 4" />
            <FooterItem compact={someState} id="item5" title="Item 5" />
        </>
    );
}

// Test 4: Already negated expression - should remove double negation
function NegatedExpression() {
    const isExpanded = true;
    const someVar = false;

    return (
        <>
            <FooterItem compact={!isExpanded} id="item6" title="Item 6" />
            <FooterItem compact={!someVar} id="item7" title="Item 7" />
        </>
    );
}

// Test 5: Complex expressions
function ComplexExpressions() {
    const a = true;
    const b = false;
    const getValue = () => true;

    return (
        <>
            <FooterItem compact={a && b} id="item8" title="Item 8" />
            <FooterItem compact={getValue()} id="item9" title="Item 9" />
        </>
    );
}

// Test 6: Destructuring in renderFooter callback (JSX)
function RenderFooterCallback() {
    return (
        <AsideHeader
            renderFooter={({compact}) => (
                <FooterItem compact={compact} id="footer" title="Footer" />
            )}
        />
    );
}

// Test 7: Destructuring in renderFooter callback (object)
const config = {
    renderFooter: ({compact}) => {
        return <FooterItem compact={compact} id="footer" title="Footer" />;
    },
};

// Test 8: Logo wrapper with second parameter
const logoConfig = {
    logo: {
        wrapper: (node, compact) => <a href="/">{node}</a>,
    },
};

// Test 9: collapseButtonWrapper
function CollapseButtonWrapper() {
    return (
        <AsideHeader
            collapseButtonWrapper={(node, {compact}) => (
                <div className={compact ? 'collapsed' : 'expanded'}>{node}</div>
            )}
        />
    );
}

// Test 10: Non-target component should NOT be transformed
function NonTargetComponent() {
    return <SomeOtherComponent compact={true} />;
}

