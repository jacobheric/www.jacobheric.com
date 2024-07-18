import { sortedRawPosts } from "@/lib/posts/posts.ts";

export const indexPosts = () => {
  const posts = sortedRawPosts();
  const index = posts.map((p: Deno.DirEntry) => ({
    name: p.name,
    slug: p.name.split(".")[0],
  }));

  Deno.writeTextFileSync(
    "./lib/posts/postIndex.json",
    JSON.stringify(index),
  );
};

indexPosts();
