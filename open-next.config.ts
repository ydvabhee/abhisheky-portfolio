import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // `npm run build` runs OpenNext, so it must call next directly to avoid recursion
  buildCommand: "npx next build",
};
