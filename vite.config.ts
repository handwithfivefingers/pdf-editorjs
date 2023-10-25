import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginRequire from 'vite-plugin-require';
import path from 'path';
// https://vitejs.dev/config/

export default defineConfig({
	plugins: [react(), (vitePluginRequire as any).default({})],
	assetsInclude: ['**/*.odt', '**/*.docx'],
	resolve: {
		alias: [
			{
				find: '@app',
				replacement: path.resolve(__dirname, 'src'),
			},
		],
	},
});
