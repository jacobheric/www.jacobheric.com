import { assertEquals } from "jsr:@std/assert@^1.0.14";
import { needsResize } from "./resize.ts";

Deno.test("resizing detects replaced originals and missing variants", async () => {
  const originalCwd = Deno.cwd();
  const directory = await Deno.makeTempDir();
  try {
    Deno.chdir(directory);
    await Deno.mkdir("static/image/resized/pine", { recursive: true });
    await Deno.writeTextFile("raw.jpg", "original");
    const original = "static/image/resized/pine/photo.jpg";
    const small = "static/image/resized/pine/photo-small.jpg";
    await Deno.writeTextFile(original, "resized");
    await Deno.writeTextFile(small, "small");
    const future = new Date(Date.now() + 10000);
    await Deno.utime(original, future, future);
    await Deno.utime(small, future, future);
    const picture = {
      shard: "pine" as const,
      sizes: { small: true, large: false },
    };
    assertEquals(await needsResize("raw.jpg", "photo.jpg", picture), false);

    const replaced = new Date(future.getTime() + 10000);
    await Deno.writeTextFile("raw.jpg", "replacement");
    await Deno.utime("raw.jpg", replaced, replaced);
    assertEquals(await needsResize("raw.jpg", "photo.jpg", picture), true);

    await Deno.utime("raw.jpg", new Date(0), new Date(0));
    await Deno.remove(small);
    assertEquals(await needsResize("raw.jpg", "photo.jpg", picture), true);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(directory, { recursive: true });
  }
});
