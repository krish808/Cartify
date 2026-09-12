import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    hookTimeout: 20000,
    testTimeout: 10000,
    setupFiles:["./src/test/loadTestEnv.js"]
    }, 
})