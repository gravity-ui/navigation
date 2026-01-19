import {readFileSync} from 'fs';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';

import {extractComponentCSS} from './plugins/extractComponentCss.mjs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Files that should receive CSS from a different component
// Key: path pattern to match, Value: component name to get CSS from
const cssAliases = {
    'AsideHeader/components/PageLayout/PageLayout.js': 'AsideHeader',
    'AsideHeader/components/PageLayout/PageLayoutAside.js': 'AsideHeader',
    'AsideHeader/components/PageLayout/AsideFallback.js': 'AsideHeader',
};

// External dependency checker - shared between ESM and CJS builds
const peerDeps = [
    'react',
    'react-dom',
    '@bem-react/classname',
    '@gravity-ui/components',
    '@gravity-ui/icons',
    '@gravity-ui/uikit',
];

const isExternal = (id) => {
    // Mark peer dependencies as external
    return peerDeps.some((dep) => id.startsWith(dep));
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
            extract: 'index.css',
            inject: false,
            include: /\.module\.(css|scss|sass)$/,
            extensions: ['.css', '.scss', '.sass'],
            use: [
                [
                    'sass',
                    {
                        // Allow package-style imports like "@gravity-ui/uikit/..."
                        includePaths: ['node_modules', 'src', 'styles'],
                        silenceDeprecations: ['legacy-js-api'],
                    },
                ],
            ],
        }),
        postcss({
            minimize: true,
            extract: 'index.css',
            inject: false,
            include: /\.(css|scss|sass)$/,
            exclude: /\.module\.(css|scss|sass)$/,
            extensions: ['.css', '.scss', '.sass'],
            use: [
                [
                    'sass',
                    {
                        includePaths: ['node_modules', 'src', 'styles'],
                        silenceDeprecations: ['legacy-js-api'],
                    },
                ],
            ],
        }),
        svgr(),
        extractComponentCSS({cssAliases}),
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
            exports: 'named',
        },
        plugins: getPlugins(packageJson.module),
        strictDeprecations: true,
        external: isExternal,
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
            exports: 'named',
        },
        plugins: getPlugins(packageJson.main),
        strictDeprecations: true,
        external: isExternal,
    },
];
