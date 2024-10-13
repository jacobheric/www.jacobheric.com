import { Handlers, PageProps } from "$fresh/server.ts";

import Post from "@/components/Post.tsx";
import { getPost, PostType } from "@/lib/posts/posts.ts";

export type PostPage = { post: PostType; hasPrev: boolean; hasNext: boolean };

export const handler: Handlers<PostPage> = {
  GET(_req, ctx) {
    try {
      const post = getPost(ctx.params.slug);

      return ctx.render(post);
    } catch (e: unknown) {
      console.error("post not found", e);
      return ctx.renderNotFound();
    }
  },
};

export default function PostPage(
  { data: { post, hasNext, hasPrev } }: PageProps<PostPage>,
) {
  return <Post post={post} hasNext={hasNext} hasPrev={hasPrev} />;
}
