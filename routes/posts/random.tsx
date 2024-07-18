import { Handlers, PageProps } from "$fresh/server.ts";
import Post from "@/components/Post.tsx";

import { PostType, random } from "../../lib/posts/posts.ts";

export const handler: Handlers<PostType> = {
  async GET(_req, ctx) {
    return ctx.render(await random());
  },
};

export default function RandomPost(props: PageProps<PostType>) {
  const post = props.data;
  return <Post post={post} />;
}
