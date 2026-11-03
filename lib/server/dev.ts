type Handler = (req: Request) => Response | Promise<Response>;

export const createDevPreview = (serve: Handler) => {
  let revision = crypto.randomUUID();

  const reload = () => {
    revision = crypto.randomUUID();
  };

  const handler = async (req: Request) => {
    if (new URL(req.url).pathname === "/__dev/revision") {
      return new Response(revision, {
        headers: { "cache-control": "no-store" },
      });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.delete("if-none-match");
    requestHeaders.delete("if-modified-since");
    const response = await serve(new Request(req, { headers: requestHeaders }));
    const headers = new Headers(response.headers);
    headers.set("cache-control", "no-store");
    headers.delete("etag");
    headers.delete("last-modified");

    if (!headers.get("content-type")?.includes("text/html")) {
      return new Response(response.body, { status: response.status, headers });
    }

    const script = `<script>
      (() => {
        const revision = ${JSON.stringify(revision)};
        const check = async () => {
          try {
            const response = await fetch("/__dev/revision", { cache: "no-store" });
            if (response.ok && await response.text() !== revision) {
              location.reload();
              return;
            }
          } catch {}
          setTimeout(check, 1000);
        };
        setTimeout(check, 1000);
      })();
    </script>`;
    const body = (await response.text())
      .replace(
        /((?:src|srcset|href)=")([^\"]+)(")/g,
        (_, before, value: string, after) =>
          before + value.replace(
            /\/(?:image|assets)\/[^,\s"<>]+/g,
            (url) => `${url}${url.includes("?") ? "&" : "?"}v=${revision}`,
          ) + after,
      )
      .replace("</body>", `${script}</body>`);
    headers.delete("content-length");
    return new Response(body, { status: response.status, headers });
  };

  return { handler, reload };
};
