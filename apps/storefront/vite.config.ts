import { reactRouter } from '@react-router/dev/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { remixDevTools } from 'remix-development-tools';

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Allow external connections
    allowedHosts: [
      'localhost',
      '.localhost',
      '.trycloudflare.com', // Allow all Cloudflare tunnel domains
      'crash-bryan-examinations-sic.trycloudflare.com', // Your specific tunnel
    ],
    warmup: {
      clientFiles: ['./app/entry.client.tsx', './app/root.tsx', './app/routes/**/*'],
    },
  },
  ssr: {
    noExternal: ['@medusajs/js-sdk', '@lambdacurry/medusa-plugins-sdk'],
  },
  plugins: [reactRouter(), tsconfigPaths({ root: './' }), vanillaExtractPlugin()],
  build: {},
});
