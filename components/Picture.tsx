import { getShardURLs, IMG_LARGE, IMG_SMALL } from "../lib/pictures/picture.ts";

export const Picture = (
  { src, alt, className }: { src?: string; alt: string; className?: string },
) => {
  if (!src) {
    console.info("image src not provided for the following post", alt);
    return null;
  }

  const { original, large, small } = getShardURLs(src);

  return (
    src.endsWith(".jpg")
      ? (
        <picture>
          {large && (
            <source
              sizes={`(min-width: 769px) ${IMG_LARGE}px`}
              srcset={`${large} ${IMG_LARGE}w`}
              type="image/jpeg"
            />
          )}

          {small &&
            (
              <source
                sizes={`(max-width: 768px) ${IMG_SMALL}px`}
                srcset={`${small}`}
                type="image/jpeg"
              />
            )}

          <img
            alt={alt}
            src={`${original}`}
            title={alt}
            className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
          />
        </picture>
      )
      : (
        <img
          alt={alt}
          src={`${original}`}
          title={alt}
          className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
        />
      )
  );
};
