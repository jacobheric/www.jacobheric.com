import { page, PageProps } from "fresh";
import { PageLink } from "@/components/Link.tsx";
import { Posts } from "../lib/posts/posts.ts";
import { search } from "@/lib/search/search.ts";
import { humanDate } from "@/routes/index.tsx";
import { define } from "@/lib/state.ts";

export type SearchPosts = Posts & { term?: string };

export const handler = define.handlers({
  GET(ctx) {
    const term = ctx.url.searchParams.get("term") || "";
    const limit = 50;
    const result = {
      posts: [],
      limit,
      term,
      hasNext: false,
      hasPrev: false,
    };

    if (!term) {
      return page(result);
    }

    const results = search(term);
    return page({
      ...result,
      posts: results.slice(0, limit),
    });
  },
});

export default function Search(
  { data: { term, posts } }: PageProps<SearchPosts>,
) {
  return (
    <div class="w-full text-lg mt-12 max-w-prose">
      <form className="flex flex-row justify-center mx-4">
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
      <ul class="w-full my-6 mx-4">
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
