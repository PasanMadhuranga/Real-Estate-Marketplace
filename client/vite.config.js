import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    }
  },
  plugins: [react()],
})


// server: This object contains the configuration for the development server.
// proxy: This object defines proxy rules for API requests.
// '/api': This specifies that any request starting with /api should be proxied.
// target: 'http://localhost:3000': This sets the target server to which the requests should be proxied. 
// Here, it means that requests to /api will be forwarded to http://localhost:3000.
// secure: false: This specifies that the proxy should not verify the SSL certificate. 
// This is useful for development environments where you might be working with self-signed certificates or untrusted certificates.
