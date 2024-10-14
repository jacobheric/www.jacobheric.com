import { loadPosts } from "@/lib/posts/load.ts";

console.log(`loading posts to index file...`);
await loadPosts();
console.log("done loading posts");
