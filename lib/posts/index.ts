const POSTS_DIR = "./posts";
const POSTS_INDEX_FILE = "./lib/posts/posts.json";

export const rawPosts = () => Array.from(Deno.readDirSync(POSTS_DIR));

const index = () => {
  const posts = rawPosts();
  const index = posts.map((p: Deno.DirEntry) => {
    const s = {
      name: p.name,
      slug: p.name.split(".")[0],
    };
    return s;
  });

  Deno.writeTextFileSync(
    POSTS_INDEX_FILE,
    JSON.stringify(index),
  );
};

console.log("creating post index...");
index();
console.log("done");
