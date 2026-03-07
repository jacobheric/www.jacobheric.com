const HTML_CACHE_MAX = 500;

type HtmlCacheEntry = {
  body: string;
  etag: string;
};

const htmlCache = new Map<string, HtmlCacheEntry>();

const hash = (value: string) => {
  let result = 2166136261;
  for (let i = 0; i < value.length; i++) {
    result ^= value.charCodeAt(i);
    result += (result << 1) +
      (result << 4) +
      (result << 7) +
      (result << 8) +
      (result << 24);
  }
  return (result >>> 0).toString(16);
};

const toEtag = (value: string) => `W/"${hash(value)}"`;

const isNotModified = (req: Request, etag: string) => {
  const header = req.headers.get("if-none-match");
  if (!header) {
    return false;
  }

  return header
    .split(",")
    .map((tag) => tag.trim())
    .some((tag) => tag === "*" || tag === etag);
};

const getCachedHtml = (key: string) => {
  const cached = htmlCache.get(key);
  if (!cached) {
    return;
  }

  htmlCache.delete(key);
  htmlCache.set(key, cached);
  return cached;
};

const setCachedHtml = (key: string, entry: HtmlCacheEntry) => {
  if (htmlCache.has(key)) {
    htmlCache.delete(key);
  }

  htmlCache.set(key, entry);
  if (htmlCache.size > HTML_CACHE_MAX) {
    const oldest = htmlCache.keys().next().value;
    if (oldest) {
      htmlCache.delete(oldest);
    }
  }

  return entry;
};

const getOrCreateHtml = (key: string, render: () => string) =>
  getCachedHtml(key) ??
    setCachedHtml(
      key,
      (() => {
        const body = render();
        return {
          body,
          etag: toEtag(body),
        };
      })(),
    );

export const clearHtmlCache = () => htmlCache.clear();

export const respondHtml = (
  {
    req,
    cacheKey,
    render,
    status = 200,
    cacheControl = "public, max-age=300",
  }: {
    req: Request;
    cacheKey: string;
    render: () => string;
    status?: number;
    cacheControl?: string;
  },
) => {
  const cached = getOrCreateHtml(cacheKey, render);
  const headers = new Headers({
    "cache-control": cacheControl,
    etag: cached.etag,
  });

  if (isNotModified(req, cached.etag)) {
    return new Response(null, {
      status: 304,
      headers,
    });
  }

  headers.set("content-type", "text/html; charset=utf-8");
  return new Response(cached.body, {
    status,
    headers,
  });
};

export const redirect = (location: string, status: number = 307) =>
  new Response("", {
    status,
    headers: { location },
  });
