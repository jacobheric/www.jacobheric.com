import { postsIndex } from "@/lib/db/db.ts";
import { renderMarkdown } from "@/lib/posts/render.ts";
import { extractYaml } from "@std/front-matter";
import { join } from "@std/path";
import { signal } from "@preact/signals";

const LIMIT = 10;
const EXCERPT_MARK = "<!--more-->";

export const POSTS_DIR = join(Deno.cwd(), "posts");

export const POSTS = signal<PostType[]>(
  postsIndex().map((p: PostType) => ({
    ...p,
    date: new Date(p.date),
  })),
);

export interface PostType {
  slug: string;
  title: string;
  description?: string;
  image: string;
  date: Date;
  excerpt: string;
  showMore: boolean;
  content: string;
}

export interface Posts {
  posts: PostType[];
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  random: string;
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

export const getPost = (slug: string, offset: number = 0) => {
  const index = POSTS.value.findIndex((p) => p.slug === slug) + offset;
  const post: PostType = POSTS.value[index];
  if (!post) {
    throw new Error("Post not found");
  }
  const random = getRandom();
  return {
    post,
    hasPrev: index > 0,
    hasNext: index < POSTS.value.length,
    random,
  };
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

  const rawExcerpt = excerptIndex >= 0 ? body.slice(0, excerptIndex) : "";

  return {
    slug,
    title: attrs.title as string,
    description: rawExcerpt,
    image: attrs.image as string,
    date,
    content: renderMarkdown(body),
    showMore: afterExcerpt > 0,
    excerpt: renderMarkdown(rawExcerpt),
  };
};

export const postPage = (
  { start, limit = LIMIT, last = false, direction = "forward" }: {
    start?: string;
    limit: number;
    last?: boolean;
    direction?: "forward" | "backward";
  },
): Posts => {
  const random = getRandom();
  if (last) {
    return {
      posts: POSTS.value.slice(-limit),
      limit,
      hasNext: false,
      hasPrev: true,
      random,
    };
  }

  const forward = direction === "forward";
  const index = start ? POSTS.value.findIndex(({ slug }) => slug === start) : 0;
  const directionalIndex = index ? forward ? index + 1 : index : index;

  return {
    limit,
    hasNext: forward
      ? directionalIndex + limit < POSTS.value.length
      : directionalIndex < POSTS.value.length,
    hasPrev: forward ? directionalIndex > 0 : directionalIndex - limit > 0,
    posts: forward
      ? POSTS.value.slice(directionalIndex, directionalIndex + limit)
      : POSTS.value.slice(directionalIndex - limit, directionalIndex),
    random,
  };
};

export const getRandom = () =>
  POSTS.value[Math.floor(Math.random() * POSTS.value.length)].slug;
