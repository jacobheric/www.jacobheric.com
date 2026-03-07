import {
  isSupportedRawImage,
  RAW_POST_PICS_DIR,
} from "@/lib/pictures/picture.ts";
import { parseFilename, POSTS_DIR, sort } from "@/lib/posts/posts.ts";
import { titleCase } from "@/lib/utils.ts";
import { join } from "@std/path";

type MakePostsSummary = {
  created: number;
  appended: number;
  skipped: number;
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

const getDateKey = (name: string) => parseFilename(name).date.toDateString();

const isDatedImage = (name: string) =>
  !isNaN(parseFilename(name).date.getTime());

const postFiles = () =>
  Array.from(Deno.readDirSync(POSTS_DIR))
    .filter(({ name }) => name.endsWith(".md"))
    .sort(sort);

const buildPostFileByDate = (posts: Deno.DirEntry[]) =>
  posts
    .reduce((filesByDate, { name }) => {
      const key = getDateKey(name);
      return filesByDate[key] ? filesByDate : { ...filesByDate, [key]: name };
    }, {} as Record<string, string>);

const readPostText = (name: string) =>
  Deno.readTextFileSync(join(POSTS_DIR, name)).toLowerCase();

const extractFrontMatterImages = (text: string) =>
  Array.from(
    text.matchAll(/^image:\s*([^\n\r]+)/gm),
    ([, image]) => (image ?? "").trim().toLowerCase(),
  ).filter(Boolean);

const extractPictureTagImages = (text: string) =>
  Array.from(
    text.matchAll(/\{%\s*picture\s*"([^"]+)"/g),
    ([, image]) => (image ?? "").trim().toLowerCase(),
  ).filter(Boolean);

const collectPostedImages = (posts: Deno.DirEntry[]) =>
  posts
    .reduce((images, { name }) => {
      const text = readPostText(name);
      const found = [
        ...extractFrontMatterImages(text),
        ...extractPictureTagImages(text),
      ];
      found.forEach((image) => images.add(image));
      return images;
    }, new Set<string>());

const latestPostTime = (posts: Deno.DirEntry[]) => {
  const latest = posts[0];
  if (!latest) {
    return Number.NEGATIVE_INFINITY;
  }

  return parseFilename(latest.name).date.getTime();
};

const isCandidateImage = (name: string, latest: number) => {
  if (!isSupportedRawImage(name)) {
    return false;
  }

  if (!isDatedImage(name)) {
    return false;
  }

  return parseFilename(name).date.getTime() >= latest;
};

const generate = (name: string, filesByDate: Record<string, string>) => {
  const { date, desc, slug } = parseFilename(name);
  const key = date.toDateString();
  const file = filesByDate[key];

  if (file) {
    appendPost(file, name, desc);
    return "appended";
  } else {
    const next = `${slug}.md`;
    writePost(next, name, desc);
    filesByDate[key] = next;
    return "created";
  }
};

export const makePosts = (): MakePostsSummary => {
  const posts = postFiles();
  const postedImages = collectPostedImages(posts);
  const filesByDate = buildPostFileByDate(posts);
  const latest = latestPostTime(posts);

  return Array
    .from(Deno.readDirSync(RAW_POST_PICS_DIR))
    .map(({ name }) => name.toLowerCase())
    .filter((name) => !name.startsWith("."))
    .filter((name) => isCandidateImage(name, latest))
    .sort()
    .reduce((summary, name) => {
      if (postedImages.has(name)) {
        return { ...summary, skipped: summary.skipped + 1 };
      }

      const action = generate(name, filesByDate);
      postedImages.add(name);
      return action === "created"
        ? { ...summary, created: summary.created + 1 }
        : { ...summary, appended: summary.appended + 1 };
    }, { created: 0, appended: 0, skipped: 0 } as MakePostsSummary);
};

if (import.meta.main) {
  console.log("generating posts from new images...");
  const summary = makePosts();
  console.log(
    `done: created=${summary.created}, appended=${summary.appended}, skipped=${summary.skipped}`,
  );
}
