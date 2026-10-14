import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

const mdxPlugin = mdx({ remarkPlugins: [remarkGfm] });
export default defineConfig({
  plugins: [
    {
      ...mdxPlugin,
      enforce: 'pre',
      // The MDX plugin strips query strings before filtering. Preserve Vite's
      // ?raw imports for full-text search and the on-page heading index.
      transform(value, id) {
        if (/[?&]raw\b/.test(id)) return;
        return mdxPlugin.transform(value, id);
      },
    },
    react(),
  ],
  server: { host: '0.0.0.0', allowedHosts: ['.e2b.app'] },
  preview: { host: '0.0.0.0', allowedHosts: ['.e2b.app'] },
});
