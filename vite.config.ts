import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    // 👇 allow your dynamic Replit URL(s)
    allowedHosts: [".replit.dev"], // permits any subdomain of replit.dev
    // If HMR struggles on Replit proxies, you can also try:
    // hmr: { clientPort: 443, protocol: "wss" }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for deployment
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libs into separate chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
    // Increase chunk size limit to reduce warnings
    chunkSizeWarningLimit: 800,
    // Use esbuild for faster builds (default minifier)
    minify: mode === 'production' ? 'esbuild' : false,
  },
}));
