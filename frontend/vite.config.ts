// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, './src'),
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "@frontend": path.resolve(__dirname, "../frontend/src"),
    },
  },
  plugins: [react()],
});

// import { defineConfig } from 'vite'
// import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineConfig({
//   plugins: [tsconfigPaths()],
// });



