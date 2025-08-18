import {readFileSync} from 'fs';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';
import postcssLib from 'postcss';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Custom plugin to extract CSS per component and add imports
const extractComponentCSS = () => {
    const cssContentMap = new Map();

    // Robust parser that keeps @media/@supports blocks intact and splits by component
    const parseComponentCSS = (cssContent) => {
        const root = postcssLib.parse(String(cssContent));

        const componentToRoot = new Map();
        const ensureRoot = (name) => {
            if (!componentToRoot.has(name)) {
                componentToRoot.set(name, postcssLib.root());
            }
            return componentToRoot.get(name);
        };

        const getComponentNameFromSelector = (selector) => {
            const m = selector && selector.match(/\.([A-Z][a-zA-Z]+)-module__/);
            return m ? m[1] : null;
        };

        const bucketize = (node) => {
            const buckets = new Map();
            if (node.type === 'rule') {
                const selectors = String(node.selector || '').split(',');
                let name = null;
                for (const s of selectors) {
                    const n = getComponentNameFromSelector(s.trim());
                    if (n) { name = n; break; }
                }
                if (name) {
                    buckets.set(name, [node.clone()]);
                }
            } else if (node.type === 'atrule') {
                for (const child of node.nodes || []) {
                    const childBuckets = bucketize(child);
                    for (const [name, nodes] of childBuckets) {
                        const atClone = postcssLib.atRule({name: node.name, params: node.params});
                        nodes.forEach((n) => atClone.append(n));
                        if (!buckets.has(name)) buckets.set(name, []);
                        buckets.get(name).push(atClone);
                    }
                }
            }
            return buckets;
        };

        for (const n of root.nodes || []) {
            const buckets = bucketize(n);
            for (const [name, nodes] of buckets) {
                const r = ensureRoot(name);
                nodes.forEach((cn) => r.append(cn));
            }
        }

        const result = new Map();
        for (const [name, compRoot] of componentToRoot) {
            result.set(name, compRoot.toString());
        }
        return result;
    };

    return {
        name: 'extract-component-css',
        buildStart() {
            cssContentMap.clear();
        },
        generateBundle(options, bundle) {
            // First pass: collect CSS content from the main CSS file
            let mainCSSContent = '';
            Object.keys(bundle).forEach((fileName) => {
                if (fileName === 'index.css' && bundle[fileName].type === 'asset') {
                    mainCSSContent = bundle[fileName].source;
                    // Remove the main CSS file as we'll split it
                    delete bundle[fileName];
                }
            });

            if (!mainCSSContent) return;

            // Parse CSS and group by component
            const componentCSS = parseComponentCSS(mainCSSContent);

            // Second pass: add CSS imports to components and create individual CSS files
            Object.keys(bundle).forEach((fileName) => {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
                    // Match any component under components/..., infer component name from filename
                    // Examples:
                    // components/Logo/Logo.js      -> Logo
                    // components/CompositeBar/Item/Item.js -> Item
                    const componentMatch = fileName.match(/components\/(?:.*\/)?([^\/]+)\.js$/);
                    if (componentMatch) {
                        const componentName = componentMatch[1];
                        const cssFileName = fileName.replace('.js', '.css');

                        // Get CSS for this component
                        const componentCSSContent = componentCSS.get(componentName);
                        if (componentCSSContent) {
                            // Add CSS import to the beginning of the component
                            const cssImport = `import './${componentName}.css';\n`;
                            chunk.code = cssImport + chunk.code;

                            // Create individual CSS file
                            this.emitFile({
                                type: 'asset',
                                fileName: cssFileName,
                                source: componentCSSContent,
                            });
                        }
                    }
                }
            });
        },
    };
};

// Single input file - Rollup will automatically detect and split components
const input = 'src/index.ts';

const getPlugins = (outDir) => {
    return [
        peerDepsExternal(),
        json(),
        resolve(),
        commonjs(),
        typescript({
            typescript: ts,
            tsconfig: './tsconfig.publish.json',
            outDir,
        }),
        postcss({
            minimize: true,
            modules: {
                generateScopedName: '[name]__[local]___[hash:base64:5]',
                localsConvention: 'camelCase',
            },
            extract: 'index.css', // Extract all CSS to one file
            inject: false,
            include: /\.module\.(css|scss|sass)$/,
        }),
        postcss({
            minimize: true,
            extract: 'index.css', // Extract all CSS to one file
            inject: false,
            include: /\.(css|scss|sass)$/,
            exclude: /\.module\.(css|scss|sass)$/,
        }),
        svgr(),
        extractComponentCSS(),
    ];
};

export default [
    // ESM build with automatic component splitting using preserveModules
    {
        input,
        output: {
            dir: packageJson.module,
            format: 'esm',
            sourcemap: true,
            preserveModules: true, // This automatically creates separate files for each module
            preserveModulesRoot: 'src',
        },
        plugins: getPlugins(packageJson.module),
        strictDeprecations: true,
        external: (id) => {
            // Mark peer dependencies as external
            return [
                'react',
                'react-dom',
                '@bem-react/classname',
                '@gravity-ui/components',
                '@gravity-ui/icons',
                '@gravity-ui/uikit',
            ].some((dep) => id.startsWith(dep));
        },
    },
    // CJS build with automatic component splitting using preserveModules
    {
        input,
        output: {
            dir: packageJson.main,
            format: 'cjs',
            sourcemap: true,
            preserveModules: true, // This automatically creates separate files for each module
            preserveModulesRoot: 'src',
        },
        plugins: getPlugins(packageJson.main),
        strictDeprecations: true,
        external: (id) => {
            // Mark peer dependencies as external
            return [
                'react',
                'react-dom',
                '@bem-react/classname',
                '@gravity-ui/components',
                '@gravity-ui/icons',
                '@gravity-ui/uikit',
            ].some((dep) => id.startsWith(dep));
        },
    },
];
