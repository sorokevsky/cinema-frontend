import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'http://localhost:3022/api-json/',
    output: {
        path: 'client',
    },
    plugins: [
        '@hey-api/client-nuxt',
        '@hey-api/typescript',
        '@hey-api/schemas',
        '@hey-api/sdk',
        // {
        //     dates: true,
        //     name: '@hey-api/transformers',
        // },
        // {
        //     name: '@hey-api/sdk',
        //     transformer: true,
        // },
    ],
});
