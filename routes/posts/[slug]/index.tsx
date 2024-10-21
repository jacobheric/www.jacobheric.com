import { HttpError, page, PageProps } from "fresh";

import Post from "@/components/Post.tsx";
import { getPost, PostType } from "@/lib/posts/posts.ts";
import { define } from "@/lib/state.ts";

export type PostPage = {
  post: PostType;
  hasPrev: boolean;
  hasNext: boolean;
  random: string;
};

export const handler = define.handlers({
  GET(ctx) {
    try {
      const path = ctx.url.pathname;
      const offset = path.includes("/prev")
        ? -1
        : path.includes("/next")
        ? 1
        : 0;
      const data = getPost(ctx.params.slug, offset);
      ctx.state.title = data.post.title;
      ctx.state.description = data.post.description;

      return page(data);
    } catch (e: unknown) {
      console.error("post not found", e);
      throw new HttpError(404);
    }
  },
});

export default function PostPage(
  { data: { post, hasNext, hasPrev, random } }: PageProps<PostPage>,
) {
  return (
    <Post post={post} hasNext={hasNext} hasPrev={hasPrev} random={random} />
  );
}
