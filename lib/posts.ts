import { extractYaml } from "@std/front-matter";
import { render } from "jsr:@deno/gfm@0.6";
import { join } from "jsr:@std/path@0.213/join";

const POSTS_DIR = "./posts";
const RECENT = 10;

export interface Post {
  slug: string;
  title: string;
  image: string;
  date: Date;
  excerpt: string;
  content: string;
}

export interface Posts {
  posts: Post[];
  total: number;
  start: number;
  limit: number;
}

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
  { name: a }: Deno.DirEntry,
  { name: b }: Deno.DirEntry,
) => {
  const { date: dateA } = parseFilename(a);
  const { date: dateB } = parseFilename(b);
  return dateB.getTime() - dateA.getTime();
};

export const getPost = async (slug: string) => {
  try {
    return await parsePost(`${slug}.md`);
  } catch (e: unknown) {
    console.error("error loading markdown file", e);
  }

  return await parsePost(`${slug}.html`);
};

export const parsePosts = async (posts: Deno.DirEntry[]) =>
  await Promise.all(
    posts.map(async (post: Deno.DirEntry) => await parsePost(post.name)),
  );

export const parsePost = async (name: string): Promise<Post> => {
  const { date, slug, ext } = parseFilename(name);
  const contents = await Deno.readTextFile(join(POSTS_DIR, name));
  const { attrs, body } = extractYaml(contents);
  const content = ext === "md" ? render(body) : body;

  return {
    slug,
    title: attrs.title as string,
    image: attrs.image as string,
    date,
    content,
    excerpt: body.slice(0, body.indexOf("<!--more-->")),
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

const sortedPosts = () => posts().sort(sort);

export const posts = () => Array.from(Deno.readDirSync(POSTS_DIR));

export const random = () => {
  const p = posts();
  return parsePost(p[Math.floor(Math.random() * p.length)].name);
};
