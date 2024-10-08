import { db, PostType } from "@/lib/posts/posts.ts";

const deletePosts = async () => {
  const iter = db.list<PostType>({ prefix: ["posts"] }, { limit: 1000 });

  for await (const p of iter) {
    db.delete(p.key);
  }
};

console.log("clearing posts from kv...");
deletePosts();
console.log("done");
