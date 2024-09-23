import commonjs from '@rollup/plugin-commonjs';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import svgr from '@svgr/rollup';
import typescript from '@rollup/plugin-typescript';

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
        resolve(),
        commonjs({
            defaultIsModuleExports: true,
        }),
        typescript({
            tsconfig: './tsconfig.publish.json',
            outDir,
        }),
        styles({
            mode: ['extract', (filename) => {
                // Сохраняем структуру директорий и имена файлов
                const relativePath = path.relative(path.resolve(__dirname, 'src'), filename);
                return path.resolve(outDir, relativePath.replace(/\.(ts|tsx|js|jsx)$/, '.css'));
            }],
            extensions: ['.css', '.scss'],
            sass: {
                includePaths: ['./src'],
            },
            sourceMap: true,
            minimize: true,
        }),

        json(),
        svgr(),
    ];
};

const outputOptions = {
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named',
    sourcemap: true,
    assetFileNames: "[name].[extname]",
};

export default [
    {
        input,
        output: [
            {
                dir: packageJson.module,
                format: 'esm',
                ...outputOptions,
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
                ...outputOptions,
            },
        ],
        plugins: getPlugins(packageJson.main),
    },
];
