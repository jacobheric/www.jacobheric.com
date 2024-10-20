import { HttpError, page, PageProps } from "fresh";

import Post from "@/components/Post.tsx";
import { getPost } from "@/lib/posts/posts.ts";
import { define } from "@/lib/state.ts";
import type { PostPage } from "@/routes/posts/[slug]/index.tsx";

export const handler = define.handlers({
  GET(ctx) {
    try {
      const data = getPost(ctx.params.slug, 1);
      ctx.state.title = data.post.title;
      ctx.state.description = data.post.description;

      return page(data);
    } catch (e: unknown) {
      console.error("post not found", e);
      throw new HttpError(404);
    }
  },
});

export default function NextPage(
  { data: { post, hasNext, hasPrev } }: PageProps<PostPage>,
) {
  return <Post post={post} hasNext={hasNext} hasPrev={hasPrev} />;
}
