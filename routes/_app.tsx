import { type PageProps } from "fresh";
import { define, type State } from "@/lib/state.ts";

function App({ Component, state }: PageProps<never, State>) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jacob Heric{state.title ? ` - ${state.title}` : ""}</title>
        <meta
          name="description"
          content={state.description || "The life and times of Jacob Heric"}
        />
        <link rel="icon" type="image/png" href="/image/me-bw.png" />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/image/me-bw.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik+80s+Fade&family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="font-serif">
        <Component />
      </body>
    </html>
  );
}

export default define.page(App);
