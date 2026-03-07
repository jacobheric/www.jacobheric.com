import { syncContent } from "@/lib/content/sync.ts";

console.log("syncing content...");
const summary = await syncContent();
console.log(
  `done: posts(created=${summary.createdPosts}, appended=${summary.appendedPosts}, skipped=${summary.skippedPostImages}), pictures(processed=${summary.processedPictures}, resized=${summary.resizedPictures}, copied=${summary.copiedPictures}, skipped=${summary.skippedPictures})`,
);
