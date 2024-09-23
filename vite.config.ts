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
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named' as const,
};

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src/'],
            tsconfigPath: './tsconfig.publish.json',
        }),
    ],
    build: {
        outDir,
        lib: {
            entry: 'src/index.ts',
            name,
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') {
                    return `index.[name].mjs`;
                }
                if (format === 'cjs') {
                    return `index.[name].cjs`;
                }
                return `index.[name].js`;
            },
        },
        cssCodeSplit: true, // Включаем разделение CSS
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@gravity-ui/uikit',
                '@gravity-ui/icons',
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
                        // Проверяем, начинается ли путь с '~'
                        if (url.startsWith('~')) {
                            // Убираем '~' и преобразуем путь к абсолютному относительно node_modules
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
