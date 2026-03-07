import { handler, PORT } from "@/lib/server/handler.ts";
import { clearHtmlCache } from "@/lib/server/http.ts";

export { clearHtmlCache, handler, PORT };

if (import.meta.main) {
  console.log(`Blog server running on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, handler);
}
