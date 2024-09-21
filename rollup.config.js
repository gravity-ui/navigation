import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import autoprefixer from 'autoprefixer';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

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
    'src/components/AsideHeader/components/PageLayout/PageLayout.tsx',
    'src/components/AsideHeader/components/PageLayout/PageLayoutAside.tsx',
    'src/components/AsideHeader/components/PageLayout/AsideFallback.tsx',
];

const getPlugins = (outDir) => {
    return [
        peerDepsExternal(),
        typescript({
            tsconfig: './tsconfig.publish.json',
            outDir,
        }),
        postcss({
            extract: true,
            modules: false,
            minimize: true,
            sourceMap: true,
            extensions: ['.css', '.scss'],
            use: [
                [
                    'sass',
                    {
                        includePaths: ['./src'],
                    },
                ],
            ],
            plugins: [autoprefixer()],
        }),
        commonjs({
            defaultIsModuleExports: true,
        }),
        resolve(),
        json(),
        svgr(),
    ];
};

const cssExtractOptions = {
    preserveModules: true,
    assetFileNames: '[name][extname]',
    exports: 'named',
};

export default [
    {
        input,
        output: [
            {
                dir: packageJson.module,
                format: 'esm',
                sourcemap: true,
                ...cssExtractOptions,
            },
        ],
        plugins: getPlugins(packageJson.module),
    },
    {
        input,
        output: [
            {
                dir: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                ...cssExtractOptions,
            },
        ],
        plugins: getPlugins(packageJson.main),
    },
];
