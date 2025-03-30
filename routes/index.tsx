import { postPage, Posts, PostType } from "../lib/posts/posts.ts";
import { page, PageProps } from "fresh";
import { PageLink } from "@/components/Link.tsx";
import { Picture } from "../components/Picture.tsx";
import { Nav } from "@/components/Nav.tsx";
import { define } from "@/lib/state.ts";

export const humanDate = {
  year: "numeric" as const,
  month: "long" as const,
  day: "numeric" as const,
};

export const handler = define.handlers({
  GET(ctx) {
    const last = ctx.url.searchParams.get("last") ?? undefined;
    const start = ctx.url.searchParams.get("start") ?? undefined;
    const direction = ctx.url.searchParams.get("direction") ?? undefined;
    const limit = Number(ctx.url.searchParams.get("limit") || 10);

    if (direction && direction !== "forward" && direction !== "backward") {
      throw new Error('direction must be "forward" or "backward"');
    }

    return page(
      postPage({
        start,
        direction: direction as (undefined | "forward" | "backward"),
        limit,
        last: last === "true",
      }),
    );
  },
});

export default function Home(
  { data: { posts, hasPrev, hasNext, random } }: PageProps<Posts>,
) {
  return (
    <div class="w-11/12 mx-auto flex flex-col items-center justify-center">
      {posts.map((p: PostType) => {
        return (
          <div className="mt-6">
            <link rel="prefetch" href={`/posts/${p.slug}`} />
            <a href={`/posts/${p.slug}`}>
              <Picture
                src={p.image}
                alt={p.title}
                className="mx-auto"
              />
            </a>
            <div class="text-3xl italic my-6 text-center">
              <a href={`/posts/${p.slug}`}>
                {p.title}
              </a>
            </div>
            <div class="italic text-base mb-4 text-center w-full">
              {p.date.toLocaleDateString("en-us", humanDate)}
            </div>
            <div
              class="text-base mb-4 text-center"
              // deno-lint-ignore react-no-danger
              dangerouslySetInnerHTML={{ __html: p.excerpt }}
            />

            {p.showMore && (
              <div class="italic text-lg font-medium tracking-wide text-center">
                <a href={`/posts/${p.slug}`} class="next">More</a>
              </div>
            )}
            <hr class="w-10/12 border-gray-300 mt-12 mx-auto" />
          </div>
        );
      })}

      <Nav
        leftChildren={
          <>
            <PageLink href={hasPrev ? `/` : undefined}>
              <span>&laquo;</span>First
            </PageLink>

            <PageLink
              href={hasPrev
                ? `/?start=${posts[0].slug}&direction=backward`
                : undefined}
            >
              <span>&lsaquo;</span>Prev
            </PageLink>
          </>
        }
        rightChildren={
          <>
            <PageLink
              href={hasNext
                ? `/?start=${posts.at(-1)!.slug}&direction=forward`
                : undefined}
            >
              Next<span>&rsaquo;</span>
            </PageLink>

            <PageLink href={hasNext ? `/?last=true` : undefined}>
              Last<span>&raquo;</span>
            </PageLink>
          </>
        }
        className="mt-8 mb-4"
      />

      <Nav
        leftChildren={<PageLink href="/search">Search</PageLink>}
        rightChildren={<PageLink href={`/posts/${random}`}>Random</PageLink>}
        className="mb-8"
      />
    </div>
  );
}
