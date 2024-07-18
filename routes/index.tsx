import { Posts, PostType, recentPostsParsed } from "../lib/posts/posts.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { PageLink } from "@/components/Link.tsx";
import { Picture } from "@/components/Picture.tsx";

export const humanDate = {
  year: "numeric" as const,
  month: "long" as const,
  day: "numeric" as const,
};

export const handler: Handlers<Posts> = {
  async GET(_req, ctx) {
    const start = Number(ctx.url.searchParams.get("start") || 0);
    const limit = Number(ctx.url.searchParams.get("limit") || 10);
    return ctx.render(await recentPostsParsed(start, limit));
  },
};

export default function Home(
  { data: { posts, total, start } }: PageProps<Posts>,
) {
  return (
    <div class="w-11/12 mx-auto flex flex-col items-center justify-center ">
      {posts.map((p: PostType) => (
        <div className="mt-10">
          <a href={`/posts/${p.slug}`}>
            <Picture src={p.image} alt={p.title} />
          </a>
          <div class="text-3xl italic my-6 text-center">
            <a href={`/posts/${p.slug}`}>
              {p.title}
            </a>
          </div>
          <div class="italic text-base mb-4 text-center w-full">
            {p.date.toLocaleDateString("en-us", humanDate)}
          </div>
          <div class="text-base mb-4 text-center">
            {p.excerpt}
          </div>
          {p.excerpt && (
            <div class="italic text-lg font-medium tracking-wide text-center">
              <a href={`/posts/${p.slug}`} class="next">More</a>
            </div>
          )}
          <hr class="w-10/12 border-gray-300 mt-12 mx-auto" />
        </div>
      ))}

      <div class="mx-auto w-64 flex flex-row italic text-lg font-medium tracking-wide mt-8 mb-2 space-x-4">
        <PageLink href={start > 0 ? `/?start=0` : undefined}>
          <span>&laquo;</span>First
        </PageLink>

        <PageLink href={start > 0 ? `/?start=${start - 10 || 0}` : undefined}>
          <span>&lsaquo;</span>Prev
        </PageLink>

        <span className="font-sans not-italic">|</span>

        <PageLink
          href={start + 10 < total ? `/?start=${start + 10}` : undefined}
        >
          Next<span>&rsaquo;</span>
        </PageLink>

        <PageLink
          href={start + 10 < total ? `/?start=${total - 10}` : undefined}
        >
          Last<span>&raquo;</span>
        </PageLink>
      </div>

      <div class="mx-auto flex flex-row italic text-lg font-medium tracking-wide mt-2 mb-8 justify-center space-x-4">
        <PageLink href="/search">Search</PageLink>
        <span className="font-sans not-italic">|</span>
        <PageLink href="/posts/random">Random</PageLink>
      </div>
    </div>
  );
}
