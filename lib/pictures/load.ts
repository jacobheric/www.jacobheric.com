import { existsSync } from "@std/fs";
import { db } from "@/lib/db.ts";
import { INDEX_FILE } from "@/lib/pictures/picture.ts";

export const readIndex = () =>
  existsSync(INDEX_FILE) ? JSON.parse(Deno.readTextFileSync(INDEX_FILE)) : {};

const load = () => {
  const pictures = readIndex();

  Object.entries(pictures).map((
    [k, v],
  ) => db.set(["pictures", k.toLowerCase()], v));
};

console.log("loading picture info to kv...");
load();
console.log("done");
