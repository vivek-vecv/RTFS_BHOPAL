import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/rest/api": {
          target: env.VITE_API_URL || "http://10.119.1.101:9898", // Backend API URL
          changeOrigin: true, // Needed for virtual hosted sites
          secure: false, // If using self-signed certificates
          rewrite: (path) => path.replace(/^\/rest\/api/, ""), // Optional path rewrite
        },
      },
    },
    esbuild: {
      // Correctly define the loader for .js files that contain JSX
      loader: "jsx",
      include: /\.(js|jsx)$/, // Apply this rule to both .js and .jsx files
    },
  };
});
