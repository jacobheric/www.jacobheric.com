import { Handlers, PageProps } from "$fresh/server.ts";

import Post from "@/components/Post.tsx";
import { getPrev, PostType } from "@/lib/posts/posts.ts";

export const handler: Handlers<PostType> = {
  async GET(_req, ctx) {
    try {
      const post = await getPrev(ctx.params.slug);
      return ctx.render(post);
    } catch (e: unknown) {
      console.log("previous post not found", e);
      return ctx.renderNotFound();
    }
  },
};

export default function PrevPostPage(props: PageProps<PostType>) {
  const post = props.data;
  return <Post post={post} />;
}
