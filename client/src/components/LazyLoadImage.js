import React from 'react';

const LazyLoadImage = ({ src, alt }) => {
  return <img loading="lazy" src={src} alt={alt} className="product-image" />;
};

export default LazyLoadImage;
