import { Handlers } from "$fresh/server.ts";

import { PostType, random } from "../../lib/posts/posts.ts";

export const handler: Handlers<PostType> = {
  async GET(_req) {
    return new Response("", {
      status: 307,
      headers: { Location: `/posts/${await random()}` },
    });
  },
};
