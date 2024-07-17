import {
  IMG_LARGE,
  IMG_SMALL,
  largeName,
  originalName,
  smallName,
} from "../lib/pictures/picture.ts";
import { existsSync } from "@std/fs";

const IMAGE_DIR = "/image/posts";

export const Picture = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    console.info("image src not provided for the following post", alt);
    return null;
  }
  return (
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
        class="my-6 max-h-screen max-w-screen rounded-md"
        src={`${originalName(src, IMAGE_DIR)}`}
        title={alt}
      />
    </picture>
  );
};
