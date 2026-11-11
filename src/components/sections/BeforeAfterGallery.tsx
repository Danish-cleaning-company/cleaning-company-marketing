import { ResponsiveImage } from "@/components/ResponsiveImage";

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

type BeforeAfterGalleryProps = {
  heading: string;
  images: readonly [GalleryImage, GalleryImage];
};

export function BeforeAfterGallery({ heading, images }: BeforeAfterGalleryProps) {
  return (
    <section className="before-after">
      <h2 className="title">{heading}</h2>
      <div className="before-after-gallery">
        {images.map((image) => (
          <figure className="before-after-card" key={image.label}>
            <div className="before-after-media">
              <ResponsiveImage
                src={image.src}
                alt={image.alt}
                width={600}
                height={800}
                sizes="(max-width: 600px) calc((100vw - 2.5rem) / 2), (max-width: 900px) calc((100vw - 5rem) / 2), 390px"
                style={{ objectPosition: image.objectPosition ?? "center 58%" }}
              />
            </div>
            <figcaption>{image.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
