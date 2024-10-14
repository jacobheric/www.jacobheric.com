#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { parseArgs } from "@std/cli";

import config from "./fresh.config.ts";

import "@std/dotenv/load";
import { resizePictures as resize } from "@/lib/pictures/resize.ts";
import { loadPosts as load } from "@/lib/posts/load.ts";

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

await dev(import.meta.url, "./main.ts", config);
