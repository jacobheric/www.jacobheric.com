import { getImageUrl, PICTURES } from "@/lib/pictures/picture.ts";

export const Picture = (
  { src, alt, className }: { src?: string; alt: string; className?: string },
) => {
  if (!src) {
    console.info("image src not provided for the following post", alt);
    return null;
  }

  const picInfo = PICTURES[src.toLowerCase()];

  return (
    <picture>
      <source
        srcset={getImageUrl(src, picInfo, "large")}
        media={`(min-width: 769px)`}
        type="image/jpeg"
      />

      <source
        srcset={getImageUrl(src, picInfo, "small")}
        media={`(max-width: 768px)`}
        type="image/jpeg"
      />

      <img
        alt={alt}
        srcset={getImageUrl(src, picInfo)}
        title={alt}
        className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
      />
    </picture>
  );
};
