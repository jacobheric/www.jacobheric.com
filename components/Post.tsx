import { PostType } from "@/lib/posts/posts.ts";
import { humanDate } from "@/routes/index.tsx";
import { PageLink } from "@/components/Link.tsx";
import { Picture } from "@/components/Picture.tsx";
import { Nav } from "@/components/Nav.tsx";

export default function POST({ post }: { post: PostType }) {
  return (
    <div class="2xl:max-w-[80%] max-w-[90%] flex flex-col mt-12 ">
      <Picture src={post.image} alt={post.title} className="mx-auto" />

      <div class="title text-3xl italic my-6 w-full ">
        {post.title}
      </div>
      <div class="italic text-base mb-4">
        {post.date.toLocaleDateString("en-us", humanDate)}
      </div>
      <div
        class="text-base text-justify mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      >
      </div>
      <hr class="w-10/12 border-gray-300 mx-auto" />

      <Nav
        leftChildren={
          <>
            <PageLink href={`/posts/${post.slug}/prev`}>
              <span>&lsaquo;</span>Prev
            </PageLink>
            <PageLink href="/search">
              Search
            </PageLink>
          </>
        }
        rightChildren={
          <>
            <PageLink href="/posts/random">
              Random
            </PageLink>
            <PageLink href={`/posts/${post.slug}/next`}>
              Next<span>&rsaquo;</span>
            </PageLink>
          </>
        }
        className="my-8"
      />
    </div>
  );
}
