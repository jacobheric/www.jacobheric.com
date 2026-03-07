import {
  getImageUrl,
  isHeifImage,
  isPassthroughImage,
  isSupportedRawImage,
  setShardedName,
} from "@/lib/pictures/picture.ts";
import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.14";

Deno.test("supported raw image extensions include heif/heic", () => {
  assertEquals(isSupportedRawImage("2026-01-01-test.heif"), true);
  assertEquals(isSupportedRawImage("2026-01-01-test.HEIC"), true);
  assertEquals(isSupportedRawImage("2026-01-01-test.json"), false);
});

Deno.test("passthrough image detection only matches gif/png", () => {
  assertEquals(isPassthroughImage("2026-01-01-test.png"), true);
  assertEquals(isPassthroughImage("2026-01-01-test.gif"), true);
  assertEquals(isPassthroughImage("2026-01-01-test.heif"), false);
});

Deno.test("heif files are detected for fallback conversion", () => {
  assertEquals(isHeifImage("2026-01-01-test.heif"), true);
  assertEquals(isHeifImage("2026-01-01-test.heic"), true);
  assertEquals(isHeifImage("2026-01-01-test.jpg"), false);
});

Deno.test("heif source names map to jpeg output paths", () => {
  assertMatch(
    setShardedName("2026-01-01-test.heif", "pine"),
    /static\/image\/resized\/pine\/2026-01-01-test\.jpg$/,
  );
  assertMatch(
    setShardedName("2026-01-01-test.heif", "pine", "large"),
    /static\/image\/resized\/pine\/2026-01-01-test-large\.jpg$/,
  );
  assertMatch(
    getImageUrl("2026-01-01-test.heif", "pine", "small"),
    /2026-01-01-test-small\.jpg$/,
  );
});
