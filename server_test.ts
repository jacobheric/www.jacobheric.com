import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.14";
import { POSTS } from "@/lib/posts/posts.ts";
import { handler } from "@/server.ts";

Deno.test("home responds with html and etag", async () => {
  const response = await handler(new Request("http://localhost:8001/"));
  assertEquals(response.status, 200);
  assertMatch(
    response.headers.get("content-type") ?? "",
    /^text\/html/,
  );
  assertMatch(response.headers.get("etag") ?? "", /^W\/".+"$/);
});

Deno.test("home responds 304 when if-none-match matches", async () => {
  const first = await handler(new Request("http://localhost:8001/"));
  const etag = first.headers.get("etag") ?? "";

  const second = await handler(
    new Request("http://localhost:8001/", {
      headers: { "if-none-match": etag },
    }),
  );
  assertEquals(second.status, 304);
});

Deno.test("trailing slash redirects to canonical path", async () => {
  const response = await handler(new Request("http://localhost:8001/about/"));
  assertEquals(response.status, 308);
  assertEquals(response.headers.get("location"), "/about");
});

Deno.test("random route redirects to a post", async () => {
  const response = await handler(
    new Request("http://localhost:8001/posts/random"),
  );
  assertEquals(response.status, 307);
  assertMatch(response.headers.get("location") ?? "", /^\/posts\/.+/);
});

Deno.test("static images include immutable cache headers", async () => {
  const response = await handler(
    new Request("http://localhost:8001/image/me-bw.png"),
  );
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("cache-control"),
    "public, max-age=31536000, immutable",
  );
  await response.arrayBuffer();
});

Deno.test("static styles are served with cache headers", async () => {
  const response = await handler(
    new Request("http://localhost:8001/assets/styles.css"),
  );
  assertEquals(response.status, 200);
  assertMatch(
    response.headers.get("content-type") ?? "",
    /^text\/css/,
  );
  assertEquals(
    response.headers.get("cache-control"),
    "public, max-age=3600",
  );
  await response.arrayBuffer();
});

Deno.test("first post route responds with content", async () => {
  const slug = POSTS[0]?.slug;
  if (!slug) {
    throw new Error("expected at least one post in index");
  }

  const response = await handler(
    new Request(`http://localhost:8001/posts/${slug}`),
  );
  assertEquals(response.status, 200);
  const body = await response.text();
  assertMatch(body, /post-content/);
});

Deno.test("unknown route returns 404", async () => {
  const response = await handler(
    new Request("http://localhost:8001/does-not-exist"),
  );
  assertEquals(response.status, 404);
});
