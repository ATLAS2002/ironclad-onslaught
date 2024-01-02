import type { Config } from "tailwindcss";
import { base } from "@repo/tailwind-config";

export default {
  ...base,
  content: ["./app/**/*.{ts,tsx}"],
} satisfies Config;
