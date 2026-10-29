import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, Vite redirige /api al backend de Express.
// Si el backend usa otro puerto, define VITE_PROXY_TARGET.
const objetivoApi = process.env.VITE_PROXY_TARGET || 'http://localhost:3000'

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: objetivoApi,
				changeOrigin: true
			}
		}
	}
})
