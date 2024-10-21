import { PageLink } from "@/components/Link.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Picture } from "@/components/Picture.tsx";
import { humanDate } from "@/routes/index.tsx";
import type { PostPage } from "@/routes/posts/[slug]/index.tsx";

export default function Post({ post, hasNext, hasPrev, random }: PostPage) {
  return (
    <div class="2xl:max-w-[80%] max-w-[90%] flex flex-col mt-12 ">
      <Picture src={post.image} alt={post.title} className="mx-auto" />

      <div class="title text-3xl italic my-6 mx-auto ">
        {post.title}
      </div>
      <div class="italic text-base mb-4 mx-auto">
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
            <PageLink href={hasPrev ? `/posts/${post.slug}/prev` : undefined}>
              <span>&lsaquo;</span>Prev
            </PageLink>
            <PageLink href="/search">
              Search
            </PageLink>
          </>
        }
        rightChildren={
          <>
            <PageLink href={`/posts/${random}`}>
              Random
            </PageLink>
            <PageLink href={hasNext ? `/posts/${post.slug}/next` : undefined}>
              Next<span>&rsaquo;</span>
            </PageLink>
          </>
        }
        className="my-8"
      />
    </div>
  );
}
