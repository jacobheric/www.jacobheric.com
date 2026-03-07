import { syncContent } from "@/lib/content/sync.ts";
import { clearHtmlCache, handler, PORT } from "@/server.ts";

const SYNC_PATHS = ["posts", "static/image/raw"];
const SYNC_DEBOUNCE_MS = 250;

const isContentPath = (path: string) =>
  path.includes("/posts/") || path.includes("/static/image/raw/");

type ContentSummary = Awaited<ReturnType<typeof syncContent>>;

const formatContentSummary = (label: string, summary: ContentSummary) =>
  [
    `${label}`,
    "  [posts]",
    `    + created : ${summary.createdPosts}`,
    `    + appended: ${summary.appendedPosts}`,
    `    - skipped : ${summary.skippedPostImages}`,
    "  [pictures]",
    `    * processed: ${summary.processedPictures}`,
    `    * resized  : ${summary.resizedPictures}`,
    `    * copied   : ${summary.copiedPictures}`,
    `    - skipped  : ${summary.skippedPictures}`,
  ].join("\n");

const startContentWatcher = () => {
  const watcher = Deno.watchFs(SYNC_PATHS);
  let pending = false;
  let running = false;
  let timer: number | undefined;

  const runSync = async () => {
    if (running) {
      pending = true;
      return;
    }

    running = true;
    do {
      pending = false;
      const summary = await syncContent({ persistPostsIndex: false });
      clearHtmlCache();
      console.log(formatContentSummary("content update:", summary));
    } while (pending);
    running = false;
  };

  const scheduleSync = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      void runSync();
    }, SYNC_DEBOUNCE_MS);
  };

  void (async () => {
    for await (const event of watcher) {
      if (event.paths.some(isContentPath)) {
        scheduleSync();
      }
    }
  })();
};

console.log("syncing content before server start...");
const summary = await syncContent({ persistPostsIndex: false });
console.log(formatContentSummary("content sync complete:", summary));
startContentWatcher();

console.log(`Blog server running on http://localhost:${PORT}`);
Deno.serve({ port: PORT }, handler);
