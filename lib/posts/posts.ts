import { postsIndex } from "@/lib/db/db.ts";
import { renderMarkdown } from "@/lib/posts/render.ts";
import { extractYaml } from "@std/front-matter";
import { join } from "@std/path";

const RECENT = 10;
const EXCERPT_MARK = "<!--more-->";

export const POSTS_DIR = "./posts";
export const POSTS: PostType[] = postsIndex().map((p: PostType) => ({
  ...p,
  date: new Date(p.date),
}));

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

export const getPost = (slug: string, offset: number = 0) => {
  const index = POSTS.findIndex((p) => p.slug === slug) + offset;
  const post: PostType = POSTS[index];
  if (!post) {
    throw new Error("Post not found");
  }
  return { post, hasPrev: index > 0, hasNext: index < POSTS.length };
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

export const page = (
  { start, limit = RECENT, last = false, direction = "forward" }: {
    start?: string;
    limit: number;
    last?: boolean;
    direction?: "forward" | "backward";
  },
): Posts => {
  if (last) {
    return { posts: POSTS.slice(-limit), limit, start, last };
  }

  const forward = direction === "forward";
  const index = start ? POSTS.findIndex(({ slug }) => slug === start) : 0;
  const directionalIndex = index ? forward ? index + 1 : index : index;

  return {
    limit,
    start,
    last,
    posts: forward
      ? POSTS.slice(directionalIndex, directionalIndex + limit)
      : POSTS.slice(directionalIndex - limit, directionalIndex),
  };
};

export const random = () =>
  POSTS[Math.floor(Math.random() * POSTS.length)].slug;
