import { Handlers } from "$fresh/server.ts";

import { db } from "@/lib/db.ts";
import {
  getImageUrl,
  type PictureType,
  type SizeName,
} from "@/lib/pictures/picture.ts";
import { PostType } from "@/lib/posts/posts.ts";

export const handler: Handlers<PostType> = {
  async GET(_req, ctx) {
    const src = ctx.params.src;
    const size = ctx.url.searchParams.get("size") ?? undefined;
    const { value } = await db.get<PictureType>([
      "pictures",
      src.toLowerCase(),
    ]);

    if (!value) {
      return ctx.renderNotFound();
    }

    if (size && !["small", "large"].includes(size)) {
      throw new Error('Invalid size, must be "small" or "large"');
    }

    const url = getImageUrl(src, value, size as SizeName);

    //
    // strings are relative local paths
    if (typeof url === "string") {
      return new Response("", {
        status: 301,
        headers: { Location: url },
      });
    }

    return Response.redirect(
      url,
      301,
    );
  },
};

export default function Pictures() {
}
