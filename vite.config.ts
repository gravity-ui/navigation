import {nodeResolve} from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const packageJson = require('./package.json');

const name = packageJson.name;
const outDir = 'build';

export default defineConfig(({mode}) => {
    const format = mode === 'cjs' ? 'cjs' : 'es';
    const ext = format === 'es' ? 'mjs' : 'cjs';
    return {
        plugins: [
            react(),
            dts({
                include: ['src/'],
                outDir: `${outDir}/types`,
                tsconfigPath: './tsconfig.publish.json',
                entryRoot: 'src',
            }),
        ],
        build: {
            outDir: `${outDir}/${format}`,
            sourcemap: true,
            target: 'esnext',
            minify: false,
            cssCodeSplit: true,
            lib: {
                entry: 'src/index.ts',
                name,
                formats: [format],
            },
            rollupOptions: {
                external: [
                    ...Object.keys(packageJson.peerDependencies || {}),
                    ...Object.keys(packageJson.dependencies || {}),
                    'lodash/debounce',
                    'lodash/identity',
                ],
                plugins: [
                    peerDepsExternal(),
                    nodeResolve({
                        extensions: ['.js', '.ts', '.tsx', '.json', '.jsx'],
                    }),
                ],
                output: {
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    dir: `${outDir}/${format === 'cjs' ? 'cjs' : 'esm'}`,
                    entryFileNames: `[name].${ext}`,
                    format,
                    exports: 'named',
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css')) {
                            return '[name][extname]';
                        }
                        return 'assets/[name][extname]';
                    },
                },
            },
        },
    };
});
