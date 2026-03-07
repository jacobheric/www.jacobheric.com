import { assertEquals } from "jsr:@std/assert@^1.0.14";
import { POSTS, type PostType, setPosts } from "@/lib/posts/posts.ts";
import { search } from "@/lib/search/search.ts";

const withPosts = (posts: PostType[], run: () => void) => {
  const original = POSTS;
  setPosts(posts);
  try {
    run();
  } finally {
    setPosts(original);
  }
};

const post = (
  {
    slug,
    title,
    content,
    date,
  }: { slug: string; title: string; content: string; date: string },
): PostType => ({
  slug,
  title,
  content,
  date: new Date(date),
  image: `${slug}.jpg`,
  excerpt: "",
  showMore: false,
  description: "",
});

Deno.test("search prioritizes title matches over content-only matches", () => {
  const posts = [
    post({
      slug: "title-hit",
      title: "Espresso Pressure Adjustment",
      content: "Regular maintenance notes.",
      date: "2024-05-09",
    }),
    post({
      slug: "content-hit",
      title: "Maintenance Journal",
      content: "Espresso pressure adjustment details.",
      date: "2024-05-10",
    }),
  ];

  withPosts(posts, () => {
    const results = search("espresso pressure");
    assertEquals(results[0]?.slug, "title-hit");
  });
});

Deno.test("search supports fuzzy subsequence matches", () => {
  const posts = [
    post({
      slug: "fuzzy",
      title: "Phosphorus Coffee",
      content: "Unexpected side quest.",
      date: "2025-04-11",
    }),
  ];

  withPosts(posts, () => {
    const results = search("phsphrs");
    assertEquals(results[0]?.slug, "fuzzy");
  });
});

Deno.test("search returns empty results for empty input", () => {
  withPosts([], () => {
    assertEquals(search(""), []);
    assertEquals(search("   "), []);
  });
});
