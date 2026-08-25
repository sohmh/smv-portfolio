// ImageBlock.jsx
// Renders a local image with an optional caption.
// Usage: <ImageBlock src={importedImage} alt="description" caption="My photo" />

export default function ImageBlock({ src, alt = "", caption = "" }) {
  if (!src) return null;

  return (
    <figure className="img-block">
      <img src={src} alt={alt} className="img-block__img" />
      {caption && <figcaption className="img-block__caption">{caption}</figcaption>}
    </figure>
  );
}
