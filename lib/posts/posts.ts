import { extractYaml } from "@std/front-matter";
import { join } from "jsr:@std/path@0.213/join";
import { renderMarkdown } from "@/lib/posts/render.ts";

const POSTS_DIR = "./posts";
const RECENT = 10;

const POSTS = JSON.parse(Deno.readTextFileSync("./lib/posts/postIndex.json"));

export interface PostType {
  slug: string;
  title: string;
  image: string;
  date: Date;
  excerpt: string;
  content: string;
}

export interface Posts {
  posts: PostType[];
  total: number;
  start: number;
  limit: number;
}

type PostIndex = {
  name: string;
  slug: string;
};

export const parseFilename = (
  fileName: string,
): { date: Date; slug: string; ext: string } => {
  const [slug, ext] = fileName.split(".");
  const parts = slug.split("-");
  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  return { date, slug, ext };
};

export const sort = (
  { name: a }: PostIndex | Deno.DirEntry,
  { name: b }: PostIndex | Deno.DirEntry,
) => {
  const { date: dateA } = parseFilename(a);
  const { date: dateB } = parseFilename(b);
  return dateB.getTime() - dateA.getTime();
};

export const getPrev = (slug: string) => {
  const index = POSTS.findIndex((p: PostIndex) => p.slug === slug);
  return getPost(POSTS[index - 1].slug);
};
export const getNext = (slug: string) => {
  const index = POSTS.findIndex((p: PostIndex) => p.slug === slug);

  return getPost(POSTS[index + 1].slug);
};

export const getPost = async (slug: string) => {
  try {
    return await parsePost(`${slug}.md`);
  } catch (e: unknown) {
    console.info("error loading markdown file", e);
  }

  return await parsePost(`${slug}.html`);
};

export const parsePosts = async (posts: Deno.DirEntry[]) =>
  await Promise.all(
    posts.map(async (post: Deno.DirEntry) => await parsePost(post.name)),
  );

export const parsePost = async (name: string): Promise<PostType> => {
  const { date, slug } = parseFilename(name);
  const contents = await Deno.readTextFile(join(POSTS_DIR, name));
  const { attrs, body } = extractYaml(contents);

  return {
    slug,
    title: attrs.title as string,
    image: attrs.image as string,
    date,
    content: renderMarkdown(body),
    excerpt: renderMarkdown(body.slice(0, body.indexOf("<!--more-->"))),
  };
};

export const recentPostsParsed = async (
  start: number = 0,
  limit: number = RECENT,
): Promise<Posts> => {
  const sorted = sortedPosts();

  return {
    total: sorted.length,
    start,
    limit,
    posts: await parsePosts(sortedPosts().slice(start, start + limit)),
  };
};

export const sortedPosts = () => POSTS.sort(sort);

export const sortedRawPosts = () => rawPosts().sort(sort);
export const rawPosts = () => Array.from(Deno.readDirSync(POSTS_DIR));

export const random = () =>
  parsePost(POSTS[Math.floor(Math.random() * POSTS.length)].name);
