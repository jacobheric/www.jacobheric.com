import { getImageUrl, PICTURES } from "@/lib/pictures/picture.ts";

export const Picture = (
  { src, alt, className }: { src?: string; alt: string; className?: string },
) => {
  if (!src) {
    console.debug("image src not provided for the following post", alt);
    return null;
  }

  const { shard, sizes } = PICTURES.value[src.toLowerCase()];

  return (
    <picture>
      {sizes?.large && (
        <source
          srcset={getImageUrl(src, shard, "large")}
          media={`(min-width: 769px)`}
          type="image/jpeg"
        />
      )}

      {sizes?.small && (
        <source
          srcset={getImageUrl(src, shard, "small")}
          media={`(max-width: 768px)`}
          type="image/jpeg"
        />
      )}

      <img
        alt={alt}
        srcset={getImageUrl(src, shard)}
        title={alt}
        className={`max-h-screen rounded-md my-6 ${className}`}
      />
    </picture>
  );
};
