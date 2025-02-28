import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: "/TMSim/",
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true
    }
  }
})

// export default defineConfig(() => {
//   return {
//     base: "",
//     plugins: [react()],
//     server: {
//       polling: true
//     },
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "./src"),
//       },
//     },
//     define: {
//       global: {
//         basename: "",
//       },
//     },
//   };
// });