import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';

import {readFileSync} from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

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
            extract: true,
            inject: false,
            include: /\.module\.(css|scss|sass)$/,
        }),
        postcss({
            minimize: true,
            extract: true,
            inject: false,
            include: /\.(css|scss|sass)$/,
            exclude: /\.module\.(css|scss|sass)$/,
        }),
        svgr(),
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
            return ['react', 'react-dom', '@bem-react/classname', '@gravity-ui/components', '@gravity-ui/icons', '@gravity-ui/uikit'].some(dep => id.startsWith(dep));
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
            return ['react', 'react-dom', '@bem-react/classname', '@gravity-ui/components', '@gravity-ui/icons', '@gravity-ui/uikit'].some(dep => id.startsWith(dep));
        },
    },
];
