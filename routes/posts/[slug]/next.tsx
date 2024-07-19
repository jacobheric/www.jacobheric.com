import { Handlers, PageProps } from "$fresh/server.ts";

import Post from "@/components/Post.tsx";
import { getNext, PostType } from "@/lib/posts/posts.ts";

export const handler: Handlers<PostType> = {
  async GET(_req, ctx) {
    try {
      const post = await getNext(ctx.params.slug);
      return ctx.render(post);
    } catch (e: unknown) {
      console.error("next post not found", e);
      return ctx.renderNotFound();
    }
  },
};

export default function NextPostPage(props: PageProps<PostType>) {
  const post = props.data;
  return <Post post={post} />;
}
