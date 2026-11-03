import {
  assertEquals,
  assertMatch,
  assertNotEquals,
} from "jsr:@std/assert@^1.0.14";
import { createDevPreview } from "./dev.ts";

Deno.test("dev preview refreshes cached image URLs and strips conditional requests", async () => {
  const preview = createDevPreview((req) => {
    assertEquals(req.headers.has("if-none-match"), false);
    assertEquals(req.headers.has("if-modified-since"), false);
    return new Response(
      '<body><picture><source srcset="/image/test-large.jpg"/><img src="/image/test.jpg"/></picture></body>',
      { headers: { "content-type": "text/html", etag: '"old"' } },
    );
  });
  const request = () =>
    new Request("http://localhost/", {
      headers: { "if-none-match": '"old"', "if-modified-since": "yesterday" },
    });
  const first = await preview.handler(request());
  assertEquals(first.headers.get("cache-control"), "no-store");
  assertEquals(first.headers.has("etag"), false);
  const html = await first.text();
  assertMatch(html, /test-large\.jpg\?v=/);
  assertMatch(html, /test\.jpg\?v=/);
  assertMatch(html, /location\.reload\(\)/);

  const revision = () =>
    preview.handler(new Request("http://localhost/__dev/revision"))
      .then((response) => response.text());
  const before = await revision();
  assertEquals(await (await preview.handler(request())).text(), html);
  preview.reload();
  assertNotEquals(await revision(), before);
  assertNotEquals(await (await preview.handler(request())).text(), html);
});

Deno.test("dev assets override production cache headers without changing bytes", async () => {
  const preview = createDevPreview(() =>
    new Response(new Uint8Array([1, 2, 3]), {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": "image/jpeg",
      },
    })
  );
  const response = await preview.handler(
    new Request("http://localhost/image/a.jpg"),
  );
  assertEquals(response.headers.get("cache-control"), "no-store");
  assertEquals(
    new Uint8Array(await response.arrayBuffer()),
    new Uint8Array([1, 2, 3]),
  );
});
