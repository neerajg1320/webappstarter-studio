import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default (({mode}) => {
  // https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '' )};
  console.log(`process.env.VITE_PORT: ${process.env.VITE_PORT}`);

  return defineConfig({
    plugins: [
      react(),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['path'],
        // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        exclude: [
          'fs', // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
      // splitVendorChunkPlugin(),
    ],
    server: {
      port: parseInt(process.env.VITE_PORT)
    }
  });
});
