import { HttpError, page, PageProps } from "fresh";

import Post from "@/components/Post.tsx";
import { getPost, PostType } from "@/lib/posts/posts.ts";
import { define } from "@/lib/state.ts";

export type PostPage = { post: PostType; hasPrev: boolean; hasNext: boolean };

export const handler = define.handlers({
  GET(ctx) {
    try {
      const data = getPost(ctx.params.slug);
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
  { data: { post, hasNext, hasPrev } }: PageProps<PostPage>,
) {
  return <Post post={post} hasNext={hasNext} hasPrev={hasPrev} />;
}
