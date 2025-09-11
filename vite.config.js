import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/wp-home": {
        target: "https://savagetale.xyz", // your WordPress domain
        changeOrigin: true,               // changes host header to target
        secure: false,                    // allow self-signed SSL if needed
        rewrite: (path) => path.replace(/^\/wp-home/, ""), // remove prefix
      },
    },
  },
})
