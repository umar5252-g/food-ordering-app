import { useState } from "react";

const FALLBACK_IMAGE = "https://placehold.co/300x200?text=No+Image";

const ImageWithFallback = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      src={hasError ? FALLBACK_IMAGE : src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;
