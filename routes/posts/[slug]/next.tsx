import { Handlers, PageProps } from "$fresh/server.ts";

import Post from "@/components/Post.tsx";
import { getPost } from "@/lib/posts/posts.ts";
import type { PostPage } from "@/routes/posts/[slug]/index.tsx";

export const handler: Handlers<PostPage> = {
  GET(_req, ctx) {
    try {
      const post = getPost(ctx.params.slug, 1);
      return ctx.render(post);
    } catch (e: unknown) {
      console.error("next post not found", e);
      return ctx.renderNotFound();
    }
  },
};

export default function NextPage(
  { data: { post, hasNext, hasPrev } }: PageProps<PostPage>,
) {
  return <Post post={post} hasNext={hasNext} hasPrev={hasPrev} />;
}
