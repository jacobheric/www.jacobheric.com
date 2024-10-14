export const PROD = Deno.env.get("PRODUCTION") === "true";

export const titleCase = (str: string) =>
  str
    ? str.replace(/\w\S*/g, (t: string) => {
      return t.charAt(0).toUpperCase() + t.substring(1).toLowerCase();
    })
    : str;
