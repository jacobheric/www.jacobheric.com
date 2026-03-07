import { POSTS_INDEX, postsIndex } from "@/lib/db/db.ts";
import {
  parsePosts,
  POSTS_DIR,
  PostType,
  setPosts,
  sort,
} from "@/lib/posts/posts.ts";
import { existsSync } from "@std/fs";
import { join } from "@std/path";
import { PROD } from "../config.ts";

const rawPosts = () =>
  Array.from(Deno.readDirSync(POSTS_DIR))
    .filter(({ name }) => name.endsWith(".md"));

const timestamp = (date: Date | null) => date?.getTime() ?? 0;

const needsRebuild = (posts: Deno.DirEntry[]) => {
  if (!existsSync(POSTS_INDEX)) {
    return true;
  }

  const indexed = postsIndex();
  if (indexed.length !== posts.length) {
    return true;
  }

  const indexTime = timestamp(Deno.statSync(POSTS_INDEX).mtime);
  return posts.some(({ name }) =>
    timestamp(Deno.statSync(join(POSTS_DIR, name)).mtime) > indexTime
  );
};

export const loadPosts = async (
  { persistIndex = true }: { persistIndex?: boolean } = {},
) => {
  const posts = rawPosts().sort(sort);
  if (!needsRebuild(posts)) {
    if (!PROD) {
      setPosts(
        postsIndex().map((post: PostType) => ({
          ...post,
          date: new Date(post.date),
        })),
      );
    }
    return;
  }

  const parsed = await parsePosts(posts);

  //
  // Update in memory structure as well for local dev
  if (!PROD) {
    setPosts(parsed);
  }

  if (persistIndex) {
    Deno.writeTextFileSync(
      POSTS_INDEX,
      JSON.stringify(parsed),
    );
  }
  return;
};
