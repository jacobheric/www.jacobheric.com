import { parsePost } from "@/lib/posts/posts.ts";
import { db } from "@/lib/db.ts";

const POSTS_DIR = "./posts";

export const rawPosts = () => Array.from(Deno.readDirSync(POSTS_DIR));

const load = async () => {
  const posts = rawPosts();
  const slugs: string[] = [];

  await Promise.all(posts.map(async (p: Deno.DirEntry) => {
    const post = await parsePost(p.name);
    const slug = p.name.split(".")[0];
    db.set(["posts", slug], post);
    slugs.push(slug);
  }));

  db.set(["slugs"], slugs);
};

console.log("loading posts to kv...");
load();
