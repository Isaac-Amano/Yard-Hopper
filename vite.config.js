import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                "/api": 'http://localhost:5001',
            }
        },
        plugins: [
            react(),
            envCompatible()
        ],
    };
});
