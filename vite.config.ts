import path from 'path';

import react from '@vitejs/plugin-react';
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
        // Генерация типов для esm
        dts({
            include: ['src/'],
            outDir: `${outDir}/esm`, // Типы будут сохранены в папку esm
            tsconfigPath: './tsconfig.publish.json',
            entryRoot: 'src',
        }),
        // Генерация типов для cjs
        dts({
            include: ['src/'],
            outDir: `${outDir}/cjs`, // Типы будут сохранены в папку cjs
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
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@gravity-ui/uikit',
                '@gravity-ui/icons',
                /^node_modules\//,
            ],
            output: [
                {
                    dir: `${outDir}/esm`,
                    format: 'es',
                    entryFileNames: '[name].mjs',
                    chunkFileNames: '[name]-[hash].mjs',
                    ...commonOutputOptions,
                },
                {
                    dir: `${outDir}/cjs`,
                    format: 'cjs',
                    entryFileNames: '[name].cjs',
                    chunkFileNames: '[name]-[hash].cjs',
                    ...commonOutputOptions,
                },
            ],
        },
        sourcemap: true,
        target: 'esnext',
        minify: false,
    },
    css: {
        preprocessorOptions: {
            scss: {
                importer: [
                    (url: string) => {
                        if (url.startsWith('~')) {
                            const modulePath = path.resolve(
                                __dirname,
                                'node_modules',
                                url.slice(1),
                            );
                            return {file: modulePath};
                        }
                        return null;
                    },
                ],
                includePaths: [path.resolve(__dirname, 'node_modules')],
            },
        },
    },
});
