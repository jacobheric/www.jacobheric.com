import {
  marked,
  Token,
  TokenizerAndRendererExtension,
  type Tokens,
} from "marked";
import { renderPictureHtml } from "@/lib/pictures/render.ts";

type PictureToken = Tokens.Generic & {
  imageSrc?: string;
  imageAlt?: string;
  html: string;
};

const pictureExtension: TokenizerAndRendererExtension = {
  name: "picture",
  level: "inline",
  start(src: string) {
    return src.match(/{%/)?.index;
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
  renderer(token: Tokens.Generic) {
    return (token as PictureToken).html;
  },
};

const walkTokens = (token: Token) => {
  if (token.type === "picture") {
    const pictureToken = token as PictureToken;
    pictureToken.html = renderPictureHtml({
      src: pictureToken.imageSrc,
      alt: pictureToken.imageAlt,
    });
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
