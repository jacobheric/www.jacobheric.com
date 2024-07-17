import { Handlers, PageProps } from "$fresh/server.ts";
import { Picture } from "@/components/Picture.tsx";

import { getPost, Post } from "../../lib/posts/posts.ts";
import { humanDate } from "@/routes/index.tsx";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    try {
      const post = await getPost(ctx.params.slug);
      return ctx.render(post);
    } catch (e: unknown) {
      return ctx.renderNotFound();
    }
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;

  return (
    <div class="w-11/12 mx-auto flex flex-col items-center mt-12">
      <Picture src={post.image} alt={post.title} />

      <div class="title text-3xl italic my-6">
        {post.title}
      </div>
      <div class="italic text-base mb-4">
        {post.date.toLocaleDateString("en-us", humanDate)}
      </div>
      <div
        class="text-base text-justify mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      >
      </div>
    </div>
  );
}
