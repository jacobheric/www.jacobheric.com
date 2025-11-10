import "@std/dotenv/load";

export const PROD = Deno.env.get("PRODUCTION") === "true";
