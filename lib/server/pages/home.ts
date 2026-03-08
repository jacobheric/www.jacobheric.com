import { HOME_LIMIT, HUMAN_DATE } from "@/lib/server/constants.ts";
import { escapeHtml, nav, page, pageLink } from "@/lib/server/layout.ts";
import { respondHtml } from "@/lib/server/http.ts";
import { renderPictureHtml } from "@/lib/pictures/render.ts";
import { postPage } from "@/lib/posts/posts.ts";

const renderInvalidDirection = (req: Request) =>
  respondHtml({
    req,
    cacheKey: "home:error:invalid-direction",
    status: 400,
    cacheControl: "public, max-age=120",
    render: () =>
      page({
        title: "Bad Request",
        body: "<article><h2>Invalid direction parameter.</h2></article>",
      }),
  });

const renderPosts = (
  {
    first,
    latest,
    hasPrev,
    hasNext,
    random,
    posts,
  }: {
    first?: string;
    latest?: string;
    hasPrev: boolean;
    hasNext: boolean;
    random: string;
    posts: ReturnType<typeof postPage>["posts"];
  },
) => `
  <div class="w-11/12 mx-auto flex flex-col items-center justify-center py-6">
    ${
  posts.map((post) => {
    const image = renderPictureHtml({ src: post.image, alt: post.title });
    const more = post.showMore
      ? `<div class="italic text-lg font-medium tracking-wide text-center dark:text-white"><a href="/posts/${post.slug}" class="next">More</a></div>`
      : "";

    return `<div class="mx-2">
        <link rel="prefetch" href="/posts/${post.slug}" />
        <a href="/posts/${post.slug}">${image}</a>
        <div class="text-3xl italic my-6 text-center dark:text-white">
          <a href="/posts/${post.slug}">${escapeHtml(post.title)}</a>
        </div>
        <div class="italic text-base mb-4 text-center w-full dark:text-white">${
      post.date.toLocaleDateString("en-us", HUMAN_DATE)
    }</div>
        <div class="text-base mb-4 text-center dark:text-white">${post.excerpt}</div>
        ${more}
        <hr class="w-10/12 border-gray-300 mt-12 mx-auto dark:border-gray-700" />
      </div>`;
  }).join("")
}
    ${
  nav({
    className: "mt-8 mb-4",
    left: `
          ${
      pageLink({
        href: hasPrev ? "/" : undefined,
        text: "<span>&laquo;</span>First",
      })
    }
          ${
      pageLink({
        href: hasPrev && first
          ? `/?start=${first}&direction=backward`
          : undefined,
        text: "<span>&lsaquo;</span>Prev",
      })
    }
        `,
    right: `
          ${
      pageLink({
        href: hasNext && latest
          ? `/?start=${latest}&direction=forward`
          : undefined,
        text: "Next<span>&rsaquo;</span>",
      })
    }
          ${
      pageLink({
        href: hasNext ? "/?last=true" : undefined,
        text: "Last<span>&raquo;</span>",
      })
    }
        `,
  })
}
    ${
  nav({
    left: pageLink({ href: "/search", text: "Search" }),
    right: pageLink({ href: `/posts/${random}`, text: "Random" }),
  })
}
  </div>
`;

export const renderHome = (req: Request, url: URL) => {
  const last = url.searchParams.get("last") ?? undefined;
  const start = url.searchParams.get("start") ?? undefined;
  const direction = url.searchParams.get("direction") ?? undefined;

  if (direction && direction !== "forward" && direction !== "backward") {
    return renderInvalidDirection(req);
  }

  const data = postPage({
    start,
    direction: direction as (undefined | "forward" | "backward"),
    limit: HOME_LIMIT,
    last: last === "true",
  });

  return respondHtml({
    req,
    cacheKey: `home:${url.search}`,
    render: () =>
      page({
        body: renderPosts({
          first: data.posts[0]?.slug,
          latest: data.posts.at(-1)?.slug,
          hasPrev: data.hasPrev,
          hasNext: data.hasNext,
          random: data.random,
          posts: data.posts,
        }),
      }),
  });
};
