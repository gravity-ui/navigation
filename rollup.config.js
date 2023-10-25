import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require('./package.json');

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
    'src/components/AsideHeader/PageLayout/PageLayout.tsx',
    'src/components/AsideHeader/PageLayout/PageLayoutAside.tsx',
];

export default [
    {
        input,
        output: [
            {
                dir: packageJson.module,
                format: 'esm',
                sourcemap: true,
            },
            {
                dir: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            json(),
            resolve(),
            commonjs(),
            typescript({
                typescript: require('typescript'),
                tsconfig: './tsconfig.publish.json',
            }),
            postcss(),
            svgr(),
        ],
    },
];
