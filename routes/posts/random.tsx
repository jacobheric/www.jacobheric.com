import { define } from "@/lib/state.ts";
import { getRandom } from "../../lib/posts/posts.ts";

export const handler = define.handlers({
  GET(_req) {
    return new Response("", {
      status: 307,
      headers: { Location: `/posts/${getRandom()}` },
    });
  },
});
