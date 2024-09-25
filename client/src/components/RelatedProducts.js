import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./relatedProducts.css";

const RelatedProducts = ({ category, tags, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.post(
          "https://amazon-product-mockup-server.vercel.app/api/products/related",
          { category, tags }
        );
        // Filter out the current product
        const filteredProducts = response.data.filter(
          (product) => product._id !== currentProductId
        );
        setRelatedProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products.");
      }
    };

    if (category || (tags && tags.length > 0)) {
      fetchRelatedProducts();
    }
  }, [category, tags, currentProductId]);

  if (error) return <div className="error">{error}</div>;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  return (
    <div className="related-products">
      <h2 className="related-products-title">You May Also Like</h2>
      <div className="slider">
        <button
          className="slider-button left"
          onClick={() =>
            document
              .querySelector(".slider .cards")
              .scrollBy({ left: -220, behavior: "smooth" })
          }
        >
          &#10094; {/* Left Arrow */}
        </button>
        <div className="cards">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <div
                key={product._id}
                className="related-product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={`https://amazon-product-mockup-server.vercel.app/images/${product.images[0]}`}
                  alt={product.name}
                  className="related-product-image"
                />
                <h4 className="related-product-name">{product.name}</h4>
                <p className="related-product-price">
                  ₹{product.variants[0].price}
                </p>
              </div>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
        <button
          className="slider-button right"
          onClick={() =>
            document
              .querySelector(".slider .cards")
              .scrollBy({ left: 220, behavior: "smooth" })
          }
        >
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default RelatedProducts;
