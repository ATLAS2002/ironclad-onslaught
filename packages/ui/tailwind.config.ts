import type { Config } from "tailwindcss";
import { base } from "@repo/tailwind-config";

export default {
  ...base,
  content: ["./components/**/*.{ts,tsx}"],
} satisfies Config;
