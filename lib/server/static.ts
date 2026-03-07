import { serveDir } from "@std/http/file-server";

export const canonicalPathname = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

export const isStaticPath = (pathname: string) =>
  pathname.startsWith("/image/") || pathname.startsWith("/assets/") ||
  pathname === "/manifest.json";

export const serveStatic = async (req: Request, pathname: string) => {
  const response = await serveDir(req, {
    fsRoot: "static",
    urlRoot: "",
    quiet: true,
  });
  if (!response.ok) {
    return response;
  }

  const headers = new Headers(response.headers);
  const immutable = pathname.startsWith("/image/");
  headers.set(
    "cache-control",
    immutable ? "public, max-age=31536000, immutable" : "public, max-age=3600",
  );

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};
