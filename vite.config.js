// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig({
//   plugins: [react()],
// })
// ----------
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills()],
})
//The line import react from '@vitejs/plugin-react' \imports the Vite plugin for React, which allows you to use React's features, including JSX and Fast Refresh.
