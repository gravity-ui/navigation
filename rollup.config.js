import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
            },
            {
                file: packageJson.main,
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
