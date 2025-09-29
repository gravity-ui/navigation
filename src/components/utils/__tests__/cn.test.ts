import {describe, expect, test} from '@jest/globals';

import {NAMESPACE, createBlock} from '../cn';

describe('createBlock', () => {
    test('returns original class when styles map is empty', () => {
        const b = createBlock('logo', {} as any);
        const className = b();
        expect(className).toBe(`${NAMESPACE}logo`);
    });

    test('maps single class token using CSS modules', () => {
        const styles = {
            [`${NAMESPACE}logo`]: 'Logo-module__gn-logo___HASH',
        } as Record<string, string>;
        const b = createBlock('logo', styles);
        expect(b()).toBe('Logo-module__gn-logo___HASH');
    });

    test('maps multiple class tokens returned by block function', () => {
        const styles = {
            [`${NAMESPACE}item`]: 'Item-module__gn-item___A',
            [`${NAMESPACE}item_current`]: 'Item-module__gn-item_current___B',
        } as Record<string, string>;
        const b = createBlock('item', styles);
        // Generate base class + modifier
        const className = b({current: true});
        expect(className.split(' ').sort()).toEqual(
            ['Item-module__gn-item___A', 'Item-module__gn-item_current___B'].sort(),
        );
    });

    test('supports element and element modifiers', () => {
        const styles = {
            [`${NAMESPACE}menu__item`]: 'Menu-module__gn-menu__item___A',
            [`${NAMESPACE}menu__item_active`]: 'Menu-module__gn-menu__item_active___B',
        } as Record<string, string>;
        const b = createBlock('menu', styles);
        const className = b('item', {active: true});
        expect(className.split(' ').sort()).toEqual(
            ['Menu-module__gn-menu__item___A', 'Menu-module__gn-menu__item_active___B'].sort(),
        );
    });

    test('passes through unknown tokens (mix) unchanged', () => {
        const styles = {
            [`${NAMESPACE}button`]: 'Button-module__gn-button___A',
        } as Record<string, string>;
        const b = createBlock('button', styles);
        const className = b(null, 'external-class');
        expect(className.split(' ').sort()).toEqual(
            ['Button-module__gn-button___A', 'external-class'].sort(),
        );
    });
});
