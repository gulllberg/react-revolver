/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            include: ['src/index.tsx', 'src/vite-env.d.ts'],
        }),
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL('src/index.tsx', import.meta.url)),
            name: 'ReactRevolver',
            formats: ['es', 'cjs'],
            fileName: (format) => `react-revolver.${format === 'es' ? 'js' : 'cjs'}`,
            cssFileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
    },
});
