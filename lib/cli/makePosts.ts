import { RAW_POST_PICS_DIR } from "@/lib/pictures/picture.ts";
import { parseFilename, POSTS, POSTS_DIR } from "@/lib/posts/posts.ts";
import { titleCase } from "@/lib/utils.ts";
import { join } from "@std/path";

const unposted = (name: string, latestDate: Date) => {
  const { date } = parseFilename(name);
  const imageDate = date.getTime();
  return !isNaN(imageDate) && imageDate > latestDate.getTime();
};

const writePost = (file: string, pic: string, desc: string) =>
  Deno.writeTextFileSync(
    join(POSTS_DIR, file),
    "---\n" +
      `title: ${titleCase(desc)}\n` +
      `image: ${pic}\n` +
      "---\n",
  );

const appendPost = (file: string, pic: string, desc: string) =>
  Deno.writeTextFileSync(
    join(POSTS_DIR, file),
    `\n\n{% picture "${pic}", "${titleCase(desc)}" %}`,
    {
      append: true,
    },
  );

export const generate = (name: string, newPosts: Record<string, string>) => {
  const { date, desc, slug } = parseFilename(name);
  const file = newPosts[date.toDateString()];

  if (file) {
    appendPost(file, name, desc);
  } else {
    const file = `${slug}.md`;
    writePost(file, name, desc);
    newPosts[date.toDateString()] = file;
  }
};

export const make = () => {
  const pics = Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));
  const date = (POSTS.value.at(0))?.date;

  if (!date) {
    throw new Error("Last post not found");
  }
  const newPosts: Record<string, string> = {};
  pics.filter(({ name }) => unposted(name, date)).map((
    { name },
  ) => generate(name, newPosts));
};

console.log("generating posts from new images...");
make();
console.log("done");
