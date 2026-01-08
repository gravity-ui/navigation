/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React from 'react';
import {FooterItem, MobileLogo} from '@gravity-ui/navigation';

// Test 1: Literal boolean values
function LiteralBooleans() {
    return (<>
        <FooterItem isExpanded={false} id="item1" title="Item 1" />
        <FooterItem isExpanded={true} id="item2" title="Item 2" />
        <MobileLogo isExpanded={false} text="Logo" />
    </>);
}

// Test 2: Shorthand boolean (compact without value means compact={true})
function ShorthandBoolean() {
    return <FooterItem isExpanded={false} id="item3" title="Item 3" />;
}

// Test 3: Variable reference
function VariableReference() {
    const isCompact = true;
    const someState = false;

    return (<>
        <FooterItem isExpanded={!isCompact} id="item4" title="Item 4" />
        <FooterItem isExpanded={!someState} id="item5" title="Item 5" />
    </>);
}

// Test 4: Already negated expression - should remove double negation
function NegatedExpression() {
    const isExpanded = true;
    const someVar = false;

    return (<>
        <FooterItem isExpanded={isExpanded} id="item6" title="Item 6" />
        <FooterItem isExpanded={someVar} id="item7" title="Item 7" />
    </>);
}

// Test 5: Complex expressions
function ComplexExpressions() {
    const a = true;
    const b = false;
    const getValue = () => true;

    return (<>
        <FooterItem isExpanded={!(a && b)} id="item8" title="Item 8" />
        <FooterItem isExpanded={!getValue()} id="item9" title="Item 9" />
    </>);
}

// Test 6: Destructuring in renderFooter callback (JSX)
function RenderFooterCallback() {
    return (
        (<AsideHeader
            renderFooter={({isExpanded}) => (
                <FooterItem isExpanded={isExpanded} id="footer" title="Footer" />
            )}
        />)
    );
}

// Test 7: Destructuring in renderFooter callback (object)
const config = {
    renderFooter: ({isExpanded}) => {
        return <FooterItem isExpanded={isExpanded} id="footer" title="Footer" />;
    },
};

// Test 8: Logo wrapper with second parameter
const logoConfig = {
    logo: {
        wrapper: (node, isExpanded) => <a href="/">{node}</a>,
    },
};

// Test 9: collapseButtonWrapper
// Note: The ternary expression still uses 'compact' - user needs to manually review conditional logic
function CollapseButtonWrapper() {
    return (
        (<AsideHeader
            collapseButtonWrapper={(node, {isExpanded}) => (
                <div className={compact ? 'collapsed' : 'expanded'}>{node}</div>
            )}
        />)
    );
}

// Test 10: Non-target component should NOT be transformed
function NonTargetComponent() {
    return <SomeOtherComponent compact={true} />;
}
