import "@std/dotenv/load";

const isDeployRuntime = Boolean(Deno.env.get("DENO_DEPLOYMENT_ID"));

export const PROD = Deno.env.get("PRODUCTION") === "true" || isDeployRuntime;
