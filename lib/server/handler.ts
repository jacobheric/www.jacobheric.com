import { PORT } from "@/lib/server/constants.ts";
import { redirect } from "@/lib/server/http.ts";
import {
  renderAbout,
  renderBooks,
  renderHome,
  renderNotFound,
  renderPost,
  renderSearch,
} from "@/lib/server/pages/index.ts";
import {
  canonicalPathname,
  isStaticPath,
  serveStatic,
} from "@/lib/server/static.ts";
import { getRandom } from "@/lib/posts/posts.ts";

export { PORT };

export const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const pathname = canonicalPathname(url.pathname);
  if (pathname !== url.pathname) {
    return redirect(`${pathname}${url.search}`, 308);
  }

  if (isStaticPath(pathname)) {
    return await serveStatic(req, pathname);
  }

  if (pathname === "/favicon.ico") {
    return redirect("/image/me-bw.png", 302);
  }

  if (pathname === "/") {
    return renderHome(req, url);
  }

  if (pathname === "/about") {
    return renderAbout(req);
  }

  if (pathname === "/books") {
    return renderBooks(req);
  }

  if (pathname === "/search") {
    return renderSearch(req, url);
  }

  if (pathname === "/posts/random") {
    return redirect(`/posts/${getRandom()}`);
  }

  const postMatch = pathname.match(/^\/posts\/([^/]+?)(?:\/(next|prev))?$/);
  if (postMatch) {
    const [, slug, direction] = postMatch;
    return renderPost(req, slug, direction as ("next" | "prev" | undefined));
  }

  return renderNotFound(req);
};
