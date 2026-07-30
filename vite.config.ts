import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err: Error, _req: IncomingMessage, res: ServerResponse) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Backend unavailable', code: 'ECONNREFUSED' }));
            }
          });
        },
      },
      "/health": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2020",
    sourcemap: mode === "development",
    // Warn at 600 KB, error above 1 MB per chunk
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libs into separate cacheable chunks
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip", "lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"],
          "vendor-motion": ["framer-motion"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
        // Fingerprinted asset file names for long-lived cache
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },

  // Optimise cold-start deps scanning
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "framer-motion",
      "lucide-react",
    ],
  },
}));
