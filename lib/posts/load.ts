import { POSTS_INDEX } from "@/lib/db/db.ts";
import { parsePosts, POSTS, sort } from "@/lib/posts/posts.ts";
import { PROD } from "@/lib/utils.ts";

const POSTS_DIR = "./posts";
const rawPosts = () => Array.from(Deno.readDirSync(POSTS_DIR));

export const loadPosts = async () => {
  const posts = rawPosts();
  const parsed = await parsePosts(posts.sort(sort));

  //
  // Update in memory structure as well for local dev
  if (!PROD) {
    POSTS.value = parsed;
  }

  Deno.writeTextFileSync(
    POSTS_INDEX,
    JSON.stringify(parsed),
  );
  return;
};
