/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render, screen} from '@testing-library/react';

import {useAsideHeaderContext} from '../AsideHeaderContext';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {getAsideHeaderDensityConfig, getAsideHeaderDensityCssProperties} from '../density';

function ContextProbe() {
    const {compact, menuDensity, size} = useAsideHeaderContext();

    return (
        <div
            data-testid="context"
            data-compact={String(compact)}
            data-density={menuDensity}
            data-size={size}
        />
    );
}

describe('AsideHeader menu density', () => {
    it('keeps the current metrics in default density', () => {
        expect(getAsideHeaderDensityConfig()).toEqual({
            itemHeight: 40,
            twoLineItemHeight: 56,
            actionSize: 36,
            actionItemHeight: 50,
            iconSize: 18,
            itemMarginInline: 8,
            iconBackgroundSize: 38,
            compactWidth: 56,
            expandedWidth: 236,
            footerItemHeight: 32,
            itemExpandedRadius: 8,
            itemCollapsedRadius: 7,
            itemTitleGap: 8,
            itemTitleGapEnd: 16,
        });
    });

    it('provides compact density metrics and CSS properties from the same config', () => {
        expect(getAsideHeaderDensityConfig('compact')).toEqual({
            itemHeight: 32,
            twoLineItemHeight: 45,
            actionSize: 32,
            actionItemHeight: 46,
            iconSize: 16,
            itemMarginInline: 6,
            iconBackgroundSize: 32,
            compactWidth: 44,
            expandedWidth: 220,
            footerItemHeight: 32,
            itemExpandedRadius: 6,
            itemCollapsedRadius: 6,
            itemTitleGap: 4,
            itemTitleGapEnd: 8,
        });
        expect(getAsideHeaderDensityCssProperties('compact')).toEqual({
            '--_--gn-aside-header-density-item-height': '32px',
            '--_--gn-aside-header-density-action-size': '32px',
            '--_--gn-aside-header-density-icon-size': '16px',
            '--_--gn-aside-header-density-footer-item-height': '32px',
            '--_--gn-aside-header-density-item-margin-inline': '6px',
            '--_--gn-aside-header-density-icon-background-size': '32px',
            '--_--gn-aside-header-density-compact-width': '44px',
            '--_--gn-aside-header-density-item-expanded-radius': '6px',
            '--_--gn-aside-header-density-item-collapsed-radius': '6px',
            '--_--gn-aside-header-density-item-title-gap': '4px',
            '--_--gn-aside-header-density-item-title-gap-end': '8px',
        });
    });

    it('provides compact density and size through PageLayout context', () => {
        render(
            <PageLayout compact menuDensity="compact">
                <ContextProbe />
            </PageLayout>,
        );

        expect(screen.getByTestId('context').getAttribute('data-compact')).toBe('true');
        expect(screen.getByTestId('context').getAttribute('data-density')).toBe('compact');
        expect(screen.getByTestId('context').getAttribute('data-size')).toBe('44');
    });

    it('updates context and private layout properties when density changes at runtime', () => {
        const {container, rerender} = render(
            <PageLayout compact={false} menuDensity="default">
                <ContextProbe />
            </PageLayout>,
        );
        // eslint-disable-next-line testing-library/no-node-access
        const layout = container.firstElementChild as HTMLElement;

        expect(layout.style.getPropertyValue('--_--gn-aside-header-density-item-height')).toBe(
            '40px',
        );
        expect(screen.getByTestId('context').getAttribute('data-density')).toBe('default');
        expect(screen.getByTestId('context').getAttribute('data-size')).toBe('236');

        rerender(
            <PageLayout compact={false} menuDensity="compact">
                <ContextProbe />
            </PageLayout>,
        );

        expect(layout.style.getPropertyValue('--_--gn-aside-header-density-item-height')).toBe(
            '32px',
        );
        expect(screen.getByTestId('context').getAttribute('data-density')).toBe('compact');
        expect(screen.getByTestId('context').getAttribute('data-size')).toBe('220');
    });
});
