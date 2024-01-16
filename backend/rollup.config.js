/// Rollup config
import { defineConfig } from 'rollup';
import url from 'url';
import path from 'path';

// Plugins
import pluginAlias from '@rollup/plugin-alias';
import pluginTerser from '@rollup/plugin-terser';

// Environment
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Export config
export default defineConfig({
  input: 'src/app.js',
  output: {
    file: 'app.min.mjs',
    format: 'esm'
  },
  plugins: [
    pluginAlias({
      entries: [{ find: '@', replacement: path.join(dirname, './src') }]
    }),
    pluginTerser()
  ]
});
