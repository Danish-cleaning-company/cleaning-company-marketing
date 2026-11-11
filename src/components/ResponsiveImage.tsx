type ResponsiveImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

function variantPath(src: string, width: 480 | 768) {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
  style,
}: ResponsiveImageProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${variantPath(src, 480)} 480w, ${variantPath(src, 768)} 768w, ${src} 1280w`}
        sizes={sizes}
      />
      {/* The explicit dimensions preserve the existing layout before the image loads. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
