#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { parseArgs } from "@std/cli";

import "@std/dotenv/load";
import { resizePictures as resize } from "@/lib/pictures/resize.ts";
import { loadPosts as load } from "@/lib/posts/load.ts";

import { Builder } from "fresh/dev";
import { tailwind } from "@fresh/plugin-tailwind";
import { app } from "./main.ts";

const { loadPosts, resizePictures } = parseArgs(Deno.args, {
  boolean: ["loadPosts", "resizePictures"],
  default: { loadPosts: false, resizePictures: false },
});

if (resizePictures) {
  console.log("resizing pictures...");
  await resize();
  console.log("done resizing pictures");
}

if (loadPosts) {
  console.log("loading posts...");
  await load();
  console.log("done loading posts");
}

const builder = new Builder({ target: "safari12" });
tailwind(builder, app, {});

// Create optimized assets for the browser when
// running `deno run -A dev.ts build`
if (Deno.args.includes("build")) {
  await builder.build(app);
} else {
  // ...otherwise start the development server
  await builder.listen(app);
}
