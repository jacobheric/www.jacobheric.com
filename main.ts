import { App, staticFiles } from "fresh";
import { State } from "./lib/state.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(async (ctx) => {
  return await ctx.next();
});

app.fsRoutes();
