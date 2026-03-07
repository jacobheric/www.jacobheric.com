import { makePosts } from "@/lib/cli/makePosts.ts";
import { resizePictures } from "@/lib/pictures/resize.ts";
import { loadPosts } from "@/lib/posts/load.ts";

export type SyncContentSummary = {
  createdPosts: number;
  appendedPosts: number;
  skippedPostImages: number;
  processedPictures: number;
  skippedPictures: number;
  copiedPictures: number;
  resizedPictures: number;
};

export const syncContent = async (
  {
    overwritePictures = false,
    persistPostsIndex = true,
  }: {
    overwritePictures?: boolean;
    persistPostsIndex?: boolean;
  } = {},
): Promise<SyncContentSummary> => {
  const postSummary = makePosts();
  const pictureSummary = await resizePictures(overwritePictures);
  await loadPosts({ persistIndex: persistPostsIndex });

  return {
    createdPosts: postSummary.created,
    appendedPosts: postSummary.appended,
    skippedPostImages: postSummary.skipped,
    processedPictures: pictureSummary.processed,
    skippedPictures: pictureSummary.skipped,
    copiedPictures: pictureSummary.copiedOnly,
    resizedPictures: pictureSummary.resized,
  };
};
