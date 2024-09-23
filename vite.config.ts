import path from 'path';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const packageJson = require('./package.json');

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src/'],
        }),
    ],
    build: {
        outDir: 'build',
        lib: {
            entry: 'src/index.ts',
            name: packageJson.name,
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format}.js`,
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
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return '[name][extname]';
                    }
                    return 'assets/[name][extname]';
                },
                preserveModules: true,
                preserveModulesRoot: 'src',
                exports: 'named',
            },
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
