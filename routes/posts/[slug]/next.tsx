import { PageProps } from "fresh";

import Post from "@/components/Post.tsx";
import type { PostPage } from "@/routes/posts/[slug]/index.tsx";
import { handler as postHandler } from "./index.tsx";

export const handler = postHandler;

export default function NextPage(
  { data: { post, hasNext, hasPrev } }: PageProps<PostPage>,
) {
  return <Post post={post} hasNext={hasNext} hasPrev={hasPrev} />;
}
