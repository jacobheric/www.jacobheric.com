import { HUMAN_DATE } from "@/lib/server/constants.ts";
import { escapeHtml, nav, page, pageLink } from "@/lib/server/layout.ts";
import { respondHtml } from "@/lib/server/http.ts";
import { renderPictureHtml } from "@/lib/pictures/render.ts";
import { getPost } from "@/lib/posts/posts.ts";
import { renderNotFound } from "@/lib/server/pages/info.ts";

type Direction = "next" | "prev" | undefined;

const toOffset = (direction: Direction) =>
  direction === "prev" ? -1 : direction === "next" ? 1 : 0;

export const renderPost = (
  req: Request,
  slug: string,
  direction: Direction,
) => {
  try {
    const data = getPost(slug, toOffset(direction));
    return respondHtml({
      req,
      cacheKey: `post:${slug}:${direction ?? "current"}`,
      render: () =>
        page({
          title: data.post.title,
          description: data.post.description,
          body:
            `<div class="flex flex-col justify-center mt-8 max-w-[90%] xl:max-w-6xl">
              ${
              renderPictureHtml({
                src: data.post.image,
                alt: data.post.title,
                className: "mx-auto",
              })
            }
              <div class="title text-3xl italic mt-4 mx-auto dark:text-white">${
              escapeHtml(data.post.title)
            }</div>
              <div class="italic text-base mb-4 mx-auto dark:text-white">${
              data.post.date.toLocaleDateString("en-us", HUMAN_DATE)
            }</div>
              <div class="post-content text-base text-justify mb-6 dark:text-white mx-auto">${data.post.content}</div>
              <hr class="w-10/12 border-gray-300 mx-auto dark:border-gray-700" />
              ${
              nav({
                className: "my-8",
                left: `
                  ${
                  pageLink({
                    href: data.hasPrev
                      ? `/posts/${data.post.slug}/prev`
                      : undefined,
                    text: "<span>&lsaquo;</span>Prev",
                  })
                }
                  ${pageLink({ href: "/search", text: "Search" })}
                `,
                right: `
                  ${
                  pageLink({
                    href: `/posts/${data.random}`,
                    text: "Random",
                  })
                }
                  ${
                  pageLink({
                    href: data.hasNext
                      ? `/posts/${data.post.slug}/next`
                      : undefined,
                    text: "Next<span>&rsaquo;</span>",
                  })
                }
                `,
              })
            }
            </div>`,
        }),
    });
  } catch {
    return renderNotFound(req);
  }
};
