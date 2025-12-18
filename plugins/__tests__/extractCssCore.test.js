const {parseComponentCSS} = require('../extractCssCore.cjs');

describe('parseComponentCSS', () => {
    it('groups simple rules by components', () => {
        const css = [
            '.Logo-module__gn-logo___AAA { color: red; }',
            '.FooterItem-module__gn-footer-item___BBB { height: 40px; }',
        ].join('\n');
        const map = parseComponentCSS(css);
        const obj = Object.fromEntries(map);
        expect(Object.keys(obj).sort()).toEqual(['FooterItem::gn-footer-item', 'Logo::gn-logo']);
        expect(obj['Logo::gn-logo']).toContain('color: red');
        expect(obj['FooterItem::gn-footer-item']).toContain('height: 40px');
    });

    it('preserves @media/@supports containers', () => {
        const css = [
            '@media (min-width: 600px) {',
            '  .Logo-module__gn-logo___AAA { display: none; }',
            '}',
        ].join('\n');
        const map = parseComponentCSS(css);
        const obj = Object.fromEntries(map);
        expect(obj['Logo::gn-logo']).toMatch(/@media \(min-width: 600px\)/);
        expect(obj['Logo::gn-logo']).toMatch(/display: none/);
    });

    it('recognizes selector lists if they contain a module class', () => {
        const css = '.Item-module__gn-item___XYZ, .other { margin: 0; }';
        const map = parseComponentCSS(css);
        const obj = Object.fromEntries(map);
        expect(obj['Item::gn-item']).toContain('margin: 0');
    });
});
