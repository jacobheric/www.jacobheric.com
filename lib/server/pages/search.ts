import { HUMAN_DATE, SEARCH_LIMIT } from "@/lib/server/constants.ts";
import { escapeHtml, page, pageLink } from "@/lib/server/layout.ts";
import { respondHtml } from "@/lib/server/http.ts";
import { search } from "@/lib/search/search.ts";

export const renderSearch = (req: Request, url: URL) => {
  const term = (url.searchParams.get("term") ?? "").trim();
  const posts = term ? search(term).slice(0, SEARCH_LIMIT) : [];

  return respondHtml({
    req,
    cacheKey: `search:${term.toLowerCase()}`,
    cacheControl: term ? "public, max-age=180" : "public, max-age=300",
    render: () =>
      page({
        title: "Search",
        body: `<div class="w-full text-lg mt-12 max-w-prose dark:text-white">
          <form class="flex flex-row justify-center mx-4" method="get" action="/search">
            <input
              name="term"
              class="w-72 mr-4 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              type="search"
              placeholder="something to search..."
              value="${escapeHtml(term)}"
            />
            <button type="submit" class="w-40 border rounded-md">search</button>
          </form>
          <ul class="w-full my-6 mx-4">
            ${
          posts.map((post) =>
            `<div class="mb-2 flex flex-row items-center">${
              pageLink({
                href: `/posts/${post.slug}`,
                text: `<span class="font-bold">${
                  escapeHtml(post.title)
                }</span> - ${
                  post.date.toLocaleDateString("en-us", HUMAN_DATE)
                }`,
              })
            }</div>`
          ).join("")
        }
          </ul>
        </div>`,
      }),
  });
};
