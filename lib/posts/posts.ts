import { renderMarkdown } from "@/lib/posts/render.ts";
import { extractYaml } from "@std/front-matter";
import { join } from "@std/path";
import { db } from "@/lib/db.ts";

const RECENT = 10;
const EXCERPT_MARK = "<!--more-->";

export const POSTS_DIR = "./posts";

export interface PostType {
  slug: string;
  title: string;
  image: string;
  date: Date;
  excerpt: string;
  showMore: boolean;
  content: string;
}

export interface Posts {
  posts: PostType[];
  limit: number;
  start?: string;
  last?: boolean;
}

type PostIndex = {
  name: string;
  slug: string;
};

export const parseFilename = (
  fileName: string,
): { date: Date; slug: string; ext: string; desc: string } => {
  const [slug, ext] = fileName.split(".");
  const parts = slug.split("-");
  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  const desc = parts.slice(3).join(" ");
  return { date, slug, ext, desc };
};

export const sort = (
  { name: a }: PostIndex | Deno.DirEntry,
  { name: b }: PostIndex | Deno.DirEntry,
) => {
  const { date: dateA } = parseFilename(a);
  const { date: dateB } = parseFilename(b);
  return dateB.getTime() - dateA.getTime();
};

//
// a bit tortured, start is inclusive so get 2
export const getPrev = async (slug: string) => {
  const iter = db.list<PostType>({
    prefix: ["posts"],
    start: [
      "posts",
      slug,
    ],
  }, { limit: 2, reverse: false });

  const posts = [];
  for await (const p of iter) {
    posts.push(p.value);
  }

  return posts.at(-1);
};

export const getNext = async (slug: string) => {
  const iter = db.list<PostType>({
    prefix: ["posts"],
    end: [
      "posts",
      slug,
    ],
  }, { limit: 1, reverse: true });

  for await (const p of iter) {
    return p.value;
  }
};

export const getPost = async (slug: string) => {
  const { value } = await db.get<PostType>(["posts", slug]);
  if (!value) {
    throw new Error("Post not found");
  }
  return value;
};

export const parsePosts = async (posts: Deno.DirEntry[]) =>
  await Promise.all(
    posts.map(async (post: Deno.DirEntry) => await parsePost(post.name)),
  );

export const parsePost = async (name: string): Promise<PostType> => {
  const { date, slug } = parseFilename(name);
  const contents = await Deno.readTextFile(join(POSTS_DIR, name));
  const { attrs, body } = extractYaml<{ title: string; image: string }>(
    contents,
  );
  const excerptIndex = body.indexOf(EXCERPT_MARK);
  const afterExcerpt =
    body.substring(excerptIndex + EXCERPT_MARK.length).trim().length;

  return {
    slug,
    title: attrs.title as string,
    image: attrs.image as string,
    date,
    content: renderMarkdown(body),
    showMore: afterExcerpt > 0,
    excerpt: excerptIndex >= 0
      ? renderMarkdown(body.slice(0, excerptIndex))
      : "",
  };
};

//
// posts are stored in chronological order from oldest to newest
// but displayed newest to oldest so "forward" from the UI's perspective
// is actually moving from a non-inclusive "end" towards the beginning
// from a deno kv perspective
export const recentPostsParsed = async (
  { start, limit = RECENT, last = false, direction = "forward" }: {
    start?: string;
    limit: number;
    last?: boolean;
    direction?: "forward" | "backward";
  },
): Promise<Posts> => {
  const forward = direction === "forward";

  const iter = db.list<PostType>({
    prefix: ["posts"],
    ...start &&
      {
        [forward ? "end" : "start"]: [
          "posts",
          start,
        ],
      },
  }, {
    //
    // start is inclusive in deno kv so don't show that one when
    // moving backwards in the UI
    limit: forward ? 10 : 11,
    reverse: !last && forward ? true : false,
  });

  const posts = [];

  for await (const p of iter) {
    posts.push(p.value);
  }

  return {
    limit,
    start,
    last,
    posts: last
      ? posts.toReversed()
      : forward
      ? posts
      : posts.slice(1).toReversed(),
  };
};

export const random = async () => {
  const slugs = (await db.get<string[]>(["slugs"])).value;
  const slug = slugs?.length && slugs[Math.floor(Math.random() * slugs.length)];
  if (!slug) {
    throw new Error("post not found");
  }
  return slug;
};
