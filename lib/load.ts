import { resizePictures } from "./pictures/resize.ts";
import { loadPosts } from "./posts/load.ts";

console.log("resizing pictures...");
await resizePictures();
console.log("done resizing pictures");

console.log("loading posts...");
await loadPosts();
console.log("done loading posts");
