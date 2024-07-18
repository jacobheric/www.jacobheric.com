import { PostType } from "@/lib/posts/posts.ts";
import { humanDate } from "@/routes/index.tsx";
import { PageLink } from "@/components/Link.tsx";
import { Picture } from "@/components/Picture.tsx";

export default function POST({ post }: { post: PostType }) {
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
      <hr class="w-10/12 border-gray-300  mx-auto" />

      <div class="mx-auto w-full flex flex-row italic text-lg font-medium tracking-wide my-10 justify-center space-x-4">
        <PageLink href={`/posts/${post.slug}/prev`}>
          <span>&lsaquo;</span>Prev
        </PageLink>

        <span className="font-sans not-italic">|</span>
        <PageLink href="/posts/random">Random</PageLink>
        <span className="font-sans not-italic">|</span>

        <PageLink href={`/posts/${post.slug}/next`}>
          Next<span>&rsaquo;</span>
        </PageLink>
      </div>
    </div>
  );
}
