import { getImageUrl, PICTURES } from "@/lib/pictures/picture.ts";

export interface RenderPictureOptions {
  src?: string;
  alt?: string;
  className?: string;
}

const escapeAttr = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const renderPictureHtml = (
  { src, alt, className }: RenderPictureOptions,
) => {
  if (!src) {
    return "";
  }

  const picture = PICTURES[src.toLowerCase()];
  if (!picture) {
    return "";
  }

  const imageAlt = escapeAttr(alt ?? "");
  const imageClass = [
    "max-h-screen",
    "rounded-md",
    "my-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const { shard, sizes } = picture;
  const large = sizes?.large
    ? `<source srcset="${
      escapeAttr(getImageUrl(src, shard, "large"))
    }" media="(min-width: 769px)" type="image/jpeg"/>`
    : "";
  const small = sizes?.small
    ? `<source srcset="${
      escapeAttr(getImageUrl(src, shard, "small"))
    }" media="(max-width: 768px)" type="image/jpeg"/>`
    : "";
  const img = `<img alt="${imageAlt}" srcset="${
    escapeAttr(getImageUrl(src, shard))
  }" title="${imageAlt}" class="${imageClass}"/>`;

  return `<picture>${large}${small}${img}</picture>`;
};
