import { parseArgs } from "@std/cli";
import { resizePictures } from "@/lib/pictures/resize.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["overwrite"],
  default: { overwrite: false },
});

console.log("resizing pictures...");
await resizePictures(flags.overwrite);
console.log("done resizing pictures");
