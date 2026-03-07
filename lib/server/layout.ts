export const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const page = (
  {
    title,
    description,
    body,
  }: { title?: string; description?: string; body: string },
) =>
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${
    escapeHtml(title ? `Jacob Heric - ${title}` : "Jacob Heric")
  }</title>
    <meta name="description" content="${
    escapeHtml(description ?? "The life and times of Jacob Heric")
  }" />
    <link rel="icon" type="image/png" href="/image/me-bw.png" />
    <link rel="shortcut icon" type="image/png" href="/image/me-bw.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <script>
      (() => {
        if (!HTMLScriptElement.supports?.("speculationrules")) {
          return;
        }

        const connection = navigator.connection;
        if (connection?.saveData) {
          return;
        }

        if (
          connection?.effectiveType &&
          (connection.effectiveType === "slow-2g" ||
            connection.effectiveType === "2g")
        ) {
          return;
        }

        const script = document.createElement("script");
        script.type = "speculationrules";
        script.textContent = JSON.stringify({
          prerender: [{
            source: "document",
            where: { selector: "a[data-prerender='true']" },
            eagerness: "moderate",
          }],
        });
        document.head.append(script);
      })();
    </script>
    <style>
      .post-content::after { content: ""; display: block; clear: both; }
    </style>
  </head>
  <body class="font-serif">
    <div class="flex flex-col min-h-screen justify-between dark:bg-gray-900">
      <div class="flex flex-col justify-start">
        <div class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-center pt-7 pb-3">
          <div>
            <h3 class="uppercase font-bold text-6xl tracking-widest pb-4 dark:text-white">
              <a class="no-underline" href="/" title="Home">JACOB HERIC</a>
            </h3>
            <hr class="w-14 border-black dark:border-white mx-auto" />
            <div class="p-4 tagline uppercase text-yellow-700 font-thin text-base tracking-wide font-sans">
              I PREFER NOT TO
            </div>
          </div>
          <div class="italic text-lg font-medium tracking-wide dark:text-white">
            <a href="/about" title="About Jacob Heric">About</a>
            <span class="font-sans mx-2 not-italic">|</span>
            <a href="/books" title="Jacob Heric's Books">Books</a>
          </div>
        </div>
        <div class="flex justify-center dark:bg-gray-900">
          ${body}
        </div>
      </div>
      <footer class="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white border-t flex flex-row items-center tracking-wide justify-center text-lg py-6">
        <div class="w-full inline text-right">
          <a href="https://github.com/jacobheric/www.jacobheric.com" class="inline">Made</a> with
        </div>
        <div class="text-2xl mx-2">&#9829;</div>
        <div class="flex flex-row justify-start w-full">
          in Maine
        </div>
      </footer>
    </div>
  </body>
</html>`;

export const pageLink = (
  { href, text, prefetch = true, prerender = false }: {
    href?: string;
    text: string;
    prefetch?: boolean;
    prerender?: boolean;
  },
) =>
  href
    ? `<a href="${href}"${
      prerender ? ' data-prerender="true"' : ""
    }>${text}</a>${prefetch ? `<link rel="prefetch" href="${href}" />` : ""}`
    : `<div class="cursor-not-allowed text-slate-400">${text}</div>`;

export const nav = (
  {
    left,
    right,
    className = "",
  }: {
    left: string;
    right: string;
    className?: string;
  },
) => `
  <div class="w-full flex flex-row items-center italic text-lg font-medium tracking-wide justify-center gap-4 dark:text-white ${className}">
    <div class="flex flex-row justify-end w-full gap-4">
      ${left}
    </div>
    <div class="flex flex-row justify-center items-center font-sans not-italic w-2">
      |
    </div>
    <div class="flex flex-row justify-start w-full gap-4">
      ${right}
    </div>
  </div>`;
