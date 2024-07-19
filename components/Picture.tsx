import {
  fullName,
  IMG_LARGE,
  IMG_SMALL,
  largeName,
  originalName,
  smallName,
} from "../lib/pictures/picture.ts";
import { existsSync } from "@std/fs";

const IMAGE_DIR = "/image/out";

export const Picture = (
  { src, alt, className }: { src?: string; alt: string; className?: string },
) => {
  if (!src) {
    console.info("image src not provided for the following post", alt);
    return null;
  }

  return (
    src.endsWith(".jpg")
      ? (
        <picture>
          {existsSync(largeName(src)) && (
            <source
              sizes={`(min-width: ${IMG_LARGE - 50}px) ${IMG_LARGE}px`}
              srcset={`${largeName(src, IMAGE_DIR)} ${IMG_LARGE}w`}
              type="image/jpeg"
            />
          )}

          {existsSync(smallName(src)) &&
            (
              <source
                sizes={`(min-width: ${IMG_SMALL - 50}px) ${IMG_SMALL}px`}
                srcset={`${smallName(src, IMAGE_DIR)} ${IMG_SMALL}w`}
                type="image/jpeg"
              />
            )}

          <img
            alt={alt}
            src={`${originalName(src, IMAGE_DIR)}`}
            title={alt}
            className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
          />
        </picture>
      )
      : (
        <img
          alt={alt}
          src={`${fullName(src, IMAGE_DIR)}`}
          title={alt}
          className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
        />
      )
  );
};
