import { POSTS_INDEX } from "@/lib/db/db.ts";
import { parsePosts, sort } from "@/lib/posts/posts.ts";

const POSTS_DIR = "./posts";
const rawPosts = () => Array.from(Deno.readDirSync(POSTS_DIR));

const loadPosts = async () => {
  const posts = rawPosts();
  const parsed = await parsePosts(posts.sort(sort));

  Deno.writeTextFileSync(
    POSTS_INDEX,
    JSON.stringify(parsed),
  );
};

console.log(`loading posts to index file...`);
loadPosts();
