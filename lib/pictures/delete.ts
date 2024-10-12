import { db } from "@/lib/db.ts";
import type { PictureType } from "@/lib/pictures/picture.ts";

const deletePictures = async () => {
  const iter = db.list<PictureType>({ prefix: ["pictures"] }, {
    limit: 2000,
    consistency: "eventual",
  });

  for await (const p of iter) {
    db.delete(p.key);
  }
};

console.log("clearing pictures from kv...");
await deletePictures();
console.log("shit done");
