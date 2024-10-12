import { PostType } from "@/lib/posts/posts.ts";
import { db } from "@/lib/db.ts";

const deletePosts = async () => {
  const iter = db.list<PostType>({ prefix: ["posts"] }, {
    limit: 1000,
    consistency: "eventual",
  });

  for await (const p of iter) {
    db.delete(p.key);
  }
};

console.log("clearing posts from kv...");
await deletePosts();
console.log("done");
