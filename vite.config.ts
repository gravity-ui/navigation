import {nodeResolve} from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const packageJson = require('./package.json');

const name = packageJson.name;
const outDir = 'build';

const commonOutputOptions = {
    assetFileNames: (assetInfo) => {
        if (assetInfo.name?.endsWith('.css')) {
            return '[name][extname]';
        }
        return 'assets/[name][extname]';
    },
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named' as const,
};

export default defineConfig({
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
        outDir,
        lib: {
            entry: 'src/index.ts',
            name,
            fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
        },
        cssCodeSplit: true, // Включаем разделение CSS
        rollupOptions: {
            external: [
                ...Object.keys(packageJson.peerDependencies || {}),
                ...Object.keys(packageJson.dependencies || {}),
                'react-transition-group',
                'lodash/debounce',
                'lodash/identity',
            ],
            plugins: [
                peerDepsExternal(),
                nodeResolve({
                    extensions: ['.js', '.ts', '.tsx', '.json', '.jsx'],
                }),
            ],
            output: [
                {
                    dir: `${outDir}/esm`,
                    format: 'es',
                    entryFileNames: '[name].mjs',
                    chunkFileNames: 'chunks/[name]-[hash].mjs',
                    ...commonOutputOptions,
                },
                {
                    dir: `${outDir}/cjs`,
                    format: 'cjs',
                    entryFileNames: '[name].cjs',
                    chunkFileNames: 'chunks/[name]-[hash].cjs',
                    ...commonOutputOptions,
                },
            ],
        },
        sourcemap: true,
        target: 'esnext',
        minify: false,
    },
});
