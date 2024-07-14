import { Handlers, PageProps } from "$fresh/server.ts";
import { PageLink } from "@/components/Link.tsx";
import { Posts } from "@/lib/posts.ts";
import { search } from "@/lib/search/search.ts";
import { humanDate } from "@/routes/index.tsx";

export type SearchPosts = Posts & { term?: string };

export const handler: Handlers<SearchPosts> = {
  GET(_req, ctx) {
    const term = ctx.url.searchParams.get("term") || "";
    const start = 0;
    const limit = 50;

    if (!term) {
      return ctx.render({ posts: [], start: 0, limit: 50, total: 0, term });
    }

    const results = search(term);
    return ctx.render({
      posts: results.slice(start, start + limit),
      start,
      limit,
      total: results.length,
      term,
    });
  },
};

export default function Search(
  { data: { term, posts } }: PageProps<SearchPosts>,
) {
  return (
    <div class="w-full text-lg mt-12">
      <form className="flex flex-row items center w-full">
        <input
          name="term"
          class="w-72 mr-4 p-2 border rounded-md"
          type="search"
          placeholder="something to search..."
          defaultValue={term}
        />
        <button type="submit" className="w-40 border rounded-md">
          search
        </button>
      </form>
      <ul class="w-full my-6">
        {posts.map((p) => (
          <div className="mb-2 flex flex-row items-center">
            <PageLink href={`/posts/${p.slug}`}>
              <span className="font-bold">{p.title}</span> -{" "}
              {p.date.toLocaleDateString("en-us", humanDate)}
            </PageLink>
          </div>
        ))}
      </ul>
    </div>
  );
}
