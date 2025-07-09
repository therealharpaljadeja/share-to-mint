import { Address } from "viem";

export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 day
export const APP_URL =
    process.env.VERCEL_ENV === "production"
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
if (!APP_URL) {
    throw new Error("NEXT_PUBLIC_URL is not set");
}

export const PLATFORM_REFERRER = "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address;