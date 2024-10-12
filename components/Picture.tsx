export const Picture = (
  { src, alt, className }: { src?: string; alt: string; className?: string },
) => {
  if (!src) {
    console.info("image src not provided for the following post", alt);
    return null;
  }

  return (
    <picture>
      <source
        srcset={`/pictures/${src}?size=large`}
        media={`(min-width: 769px)`}
        type="image/jpeg"
      />

      <source
        srcset={`/pictures/${src}?size=small`}
        media={`(max-width: 768px)`}
        type="image/jpeg"
      />

      <img
        alt={alt}
        src={`/pictures/${src}`}
        title={alt}
        className={`max-h-screen max-w-screen rounded-md my-6 ${className}`}
      />
    </picture>
  );
};
