export const PORT = Number(Deno.env.get("PORT") ?? "8001");

export const HOME_LIMIT = 10;
export const SEARCH_LIMIT = 50;

export const HUMAN_DATE = {
  year: "numeric" as const,
  month: "long" as const,
  day: "numeric" as const,
};
