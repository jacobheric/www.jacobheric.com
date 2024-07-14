import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jacob Heric</title>
        <link rel="icon" type="image/png" href="/image/avatar.png" />
        <link rel="shortcut icon" type="image/png" href="/image/avatar.png" />

        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="font-serif">
        <Component />
      </body>
    </html>
  );
}
