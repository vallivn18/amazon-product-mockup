import React, { useState } from "react";
import "./productImageCarousel.css"; // Use the new CSS file

const BASE_IMAGE_URL =
  "https://amazon-product-mockup-server.vercel.app/images/";

const ProductImageCarousel = ({
  images = [],
  currentImage,
  onThumbnailClick,
}) => {
  const [isZoomed, setIsZoomed] = useState(false); // Track whether the image is zoomed
  const [zoomPosition, setZoomPosition] = useState({
    x: "center",
    y: "center",
  }); // Track zoom position

  const handleImageClick = () => {
    setIsZoomed(!isZoomed); // Toggle zoom on click
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return; // Only allow mouse movement if the image is zoomed

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const xPos = ((e.pageX - left) / width) * 100;
    const yPos = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x: `${xPos}%`, y: `${yPos}%` });
  };

  return (
    <div className="product-page">
      <div className="product-page-container">
        {/* Thumbnails on the left */}
        <div className="thumbnail-container-left">
          {images.map((img, index) => (
            <img
              key={index}
              src={`${BASE_IMAGE_URL}${img}`}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${
                currentImage === `${BASE_IMAGE_URL}${img}` ? "active" : ""
              }`}
              onClick={() => onThumbnailClick(img)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div
          className="main-image-container"
          onClick={handleImageClick} // Zoom on click
          onMouseMove={handleMouseMove} // Track mouse movement when zoomed
          style={{
            cursor: isZoomed ? "move" : "zoom-in", // Change cursor style based on zoom state
          }}
        >
          <img
            src={currentImage}
            alt="Product"
            className="main-image"
            style={{
              transform: isZoomed ? "scale(2)" : "scale(1)", // Zoom level: 2x when zoomed
              transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`, // Pan around based on mouse movement
              transition: "transform 0.3s ease", // Smooth transition when toggling zoom
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageCarousel;
