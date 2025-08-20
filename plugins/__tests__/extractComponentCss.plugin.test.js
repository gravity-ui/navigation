const runPlugin = async (css, jsEntries) => {
    const {extractComponentCSS} = await import('../extractComponentCss.mjs');
    const plugin = extractComponentCSS();
    const bundle = {};
    bundle['index.css'] = {type: 'asset', source: css};
    for (const [fileName, code] of Object.entries(jsEntries)) {
        bundle[fileName] = {type: 'chunk', code};
    }
    const emitted = [];
    plugin.emitFile = (a) => emitted.push(a);
    plugin.buildStart();
    await plugin.generateBundle({}, bundle);
    return {bundle, emitted};
};

const runPluginWithBundle = async (bundle) => {
    const {extractComponentCSS} = await import('../extractComponentCss.mjs');
    const plugin = extractComponentCSS();
    const emitted = [];
    plugin.emitFile = (a) => emitted.push(a);
    plugin.buildStart();
    await plugin.generateBundle({}, bundle);
    return {bundle, emitted};
};

describe('extractComponentCSS plugin', () => {
    it('inserts import and emits a css file for a simple component', async () => {
        const css = '.Logo-module__gn-logo___AAA{color:red}';
        const {bundle, emitted} = await runPlugin(css, {
            'components/Logo/Logo.js': 'export const x = 1;',
        });
        expect(bundle['components/Logo/Logo.js'].code.startsWith("import './Logo.css';\n")).toBe(
            true,
        );
        expect(emitted.find((e) => e.fileName === 'components/Logo/Logo.css')).toBeTruthy();
    });

    it('disambiguates by localBlock (FooterItem)', async () => {
        const css = [
            '.FooterItem-module__gn-footer-item___AAA{height:40px}',
            '.FooterItem-module__gn-mobile-header-footer-item___BBB{height:30px}',
        ].join('');
        const {bundle, emitted} = await runPlugin(css, {
            'components/FooterItem/FooterItem.js': 'export const a=1;',
            'components/MobileHeader/FooterItem/FooterItem.js': 'export const b=2;',
        });
        expect(
            bundle['components/FooterItem/FooterItem.js'].code.includes(
                "import './FooterItem.css';",
            ),
        ).toBe(true);
        expect(
            bundle['components/MobileHeader/FooterItem/FooterItem.js'].code.includes(
                "import './FooterItem.css';",
            ),
        ).toBe(true);
        const files = emitted.map((e) => e.fileName).sort();
        expect(files).toEqual([
            'components/FooterItem/FooterItem.css',
            'components/MobileHeader/FooterItem/FooterItem.css',
        ]);
    });

    it('does nothing if there is no CSS for a component', async () => {
        const css = '.Other-module__gn-other___X{color:blue}';
        const {bundle, emitted} = await runPlugin(css, {
            'components/Logo/Logo.js': 'export const x = 1;',
        });
        expect(bundle['components/Logo/Logo.js'].code.startsWith("import './Logo.css';\n")).toBe(
            false,
        );
        expect(emitted.find((e) => e.fileName === 'components/Logo/Logo.css')).toBeFalsy();
    });

    it('falls back to any bucket starting with ComponentName:: when localBlock does not match', async () => {
        const css = '.FooterItem-module__gn-some-scope___A{height:10px}';
        const {bundle, emitted} = await runPlugin(css, {
            'components/FooterItem/FooterItem.js': 'export const a=1;',
        });
        expect(
            bundle['components/FooterItem/FooterItem.js'].code.includes(
                "import './FooterItem.css';",
            ),
        ).toBe(true);
        const asset = emitted.find((e) => e.fileName === 'components/FooterItem/FooterItem.css');
        expect(asset && asset.source).toMatch(/gn-some-scope/);
    });

    it('preserves @supports containers in emitted CSS', async () => {
        const css = '@supports (display: grid){.Logo-module__gn-logo___A{display:grid}}';
        const {emitted} = await runPlugin(css, {
            'components/Logo/Logo.js': 'export const x=1;',
        });
        const asset = emitted.find((e) => e.fileName === 'components/Logo/Logo.css');
        expect(asset && asset.source).toMatch(/@supports \(display: grid\)/);
    });

    it('ignores chunks outside components/ directory', async () => {
        const css = '.Logo-module__gn-logo___A{color:red}';
        const {bundle, emitted} = await runPlugin(css, {
            'utils/helpers.js': 'export const h=1;',
        });
        expect(bundle['utils/helpers.js'].code.startsWith("import './utils.css';\n")).toBeFalsy();
        expect(emitted.some((e) => e.fileName.startsWith('utils/'))).toBe(false);
    });

    it('does nothing when index.css is missing', async () => {
        const bundle = {
            'components/Logo/Logo.js': {type: 'chunk', code: 'export const x=1;'},
        };
        const {bundle: outBundle, emitted} = await runPluginWithBundle(bundle);
        expect(outBundle['components/Logo/Logo.js'].code).toBe('export const x=1;');
        expect(emitted.length).toBe(0);
    });

    it('ignores non-index CSS assets and keeps them in bundle', async () => {
        const bundle = {
            'index.css': {type: 'asset', source: '.Logo-module__gn-logo___A{color:red}'},
            'other.css': {type: 'asset', source: 'body{margin:0}'},
            'components/Logo/Logo.js': {type: 'chunk', code: 'export const x=1;'},
        };
        const {bundle: outBundle, emitted} = await runPluginWithBundle(bundle);
        expect(outBundle['other.css']).toBeTruthy();
        expect(outBundle['index.css']).toBeUndefined();
        expect(emitted.find((e) => e.fileName === 'components/Logo/Logo.css')).toBeTruthy();
    });
});
