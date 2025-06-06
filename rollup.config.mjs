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

const input = [
    'src/index.ts',
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
            modules: {
                generateScopedName: '[local]',
                localsConvention: 'camelCase',
            },
            extract: false,
            inject: true,
            include: /\.module\.(css|scss|sass)$/,
        }),
        postcss({
            minimize: true,
            extract: false,
            inject: true,
            include: /\.(css|scss|sass)$/,
            exclude: /\.module\.(css|scss|sass)$/,
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
            },
        ],
        plugins: getPlugins(packageJson.main),
        strictDeprecations: true,
    },
];
