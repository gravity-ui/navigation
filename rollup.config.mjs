import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';

import packageJson from './package.json' assert { type: 'json' };

const input = [
    'src/index.ts',
    'src/components/ActionBar/index.ts',
    'src/components/Title/index.ts',
    'src/components/HotkeysPanel/index.ts',
    'src/components/Settings/index.ts',
    'src/components/MobileHeader/index.ts',
    'src/components/AsideHeader/AsideHeader.tsx',
    'src/components/AsideHeader/AsideHeaderContext.ts',
    'src/components/Drawer/Drawer.tsx',
    'src/components/FooterItem/FooterItem.tsx',
    'src/components/AsideHeader/components/PageLayout/PageLayout.tsx',
    'src/components/AsideHeader/components/PageLayout/PageLayoutAside.tsx',
    'src/components/AsideHeader/components/PageLayout/AsideFallback.tsx',
];

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
        }),
        svgr(),
    ];
};

export default [
    {
        input,
        output: [
            {
                dir: packageJson.module,
                format: 'esm',
                sourcemap: true,
                preserveModules: true,
                preserveModulesRoot: 'src'
            },
        ],
        plugins: getPlugins(packageJson.module),
        strictDeprecations: true,
    },
    {
        input,
        output: [
            {
                dir: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                preserveModules: true,
                preserveModulesRoot: 'src'
            },
        ],
        plugins: getPlugins(packageJson.main),
        strictDeprecations: true,
    },
];
