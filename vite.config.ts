// Vercel/TanStack Start build config
// Lovable already adds TanStack Start, React, Tailwind, tsconfig paths, and aliases.
// For Vercel we add Nitro and disable the Cloudflare build plugin.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  cloudflare: false,
  plugins: [nitro()],
});
