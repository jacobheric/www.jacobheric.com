import {
  marked,
  Token,
  TokenizerAndRendererExtension,
} from "https://esm.sh/marked@7.0.2";
import { renderToString } from "preact-render-to-string";
import { h } from "preact";
import { Picture } from "@/components/Picture.tsx";

const pictureExtension: TokenizerAndRendererExtension = {
  name: "picture",
  level: "inline",
  start(src) {
    return src.match(/^{%/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^\s*{%\s*picture\s*"([^"]+)"\s*,\s*"([^"]+)"\s*%}/;
    const match = rule.exec(src);

    if (match) {
      return {
        type: "picture",
        raw: match[0],
        imageSrc: match[1]?.trim(),
        imageAlt: match[2]?.trim(),
        html: "",
      };
    }
  },
  renderer(token) {
    return token.html;
  },
};

const walkTokens = (token: Token) => {
  if (token.type === "picture") {
    token.html = renderToString(
      h(Picture, { src: token.imageSrc, alt: token.imageAlt }),
    );
  }
};

marked.use({
  gfm: true,
  extensions: [
    pictureExtension,
  ],
  walkTokens,
});

export const renderMarkdown = (
  input: string,
): string => marked.parse(input) as string;
