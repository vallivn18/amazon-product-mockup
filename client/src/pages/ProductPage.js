import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetails, getRelatedProducts } from "../api/api";
import ProductImageCarousel from "../components/ProductImageCarousel";
import AddToCartButton from "../components/AddToCartButton";
import ReviewForm from "../components/ReviewForm";
import RelatedProducts from "../components/RelatedProducts";
import StarRating from "../components/StarRating";
import "./productPage.css";

const BASE_IMAGE_URL =
  "https://amazon-product-mockup-server.vercel.app/images/";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1); // State to manage quantity

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productData = await getProductDetails(productId);
        setProduct(productData);
        setSelectedVariant(productData?.variants?.[0] || null);
        setCurrentImage(`${BASE_IMAGE_URL}${productData?.images[0]}`);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (
        !product ||
        (!product.category && (!product.tags || product.tags.length === 0))
      ) {
        return;
      }

      try {
        const related = await getRelatedProducts(
          product.category,
          product.tags
        );
        setRelatedProducts(related || []); // Set related products or empty array if none found
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Failed to load related products.");
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setCurrentImage(`${BASE_IMAGE_URL}${variant.images[0]}`);
  };

  const handleImageClick = (image) => {
    setCurrentImage(`${BASE_IMAGE_URL}${image}`);
  };

  const updateAverageRating = (averageRating) => {
    setProduct((prev) => ({ ...prev, averageRating }));
  };

  const renderTabContent = () => {
    if (activeTab === "description") {
      return (
        <div className="tab-content">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <h4 className="price">
            ₹{selectedVariant ? selectedVariant.price : product.price}
          </h4>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock: {product.stock}</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="rating-section">
            <StarRating rating={product.averageRating} />
            <span className="review-count">[{product.reviews.length}]</span>
          </div>

          <div className="variant-options">
            <h3>Choose a Variant</h3>
            <div className="variant-buttons">
              {product.variants && product.variants.length > 0 ? (
                product.variants.map((variant) => (
                  <button
                    key={`${variant.color}-${variant.storage}`}
                    className={`variant-button ${
                      selectedVariant &&
                      selectedVariant.color === variant.color &&
                      selectedVariant.storage === variant.storage
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleVariantChange(variant)}
                  >
                    <img
                      src={`${BASE_IMAGE_URL}${variant.images[0]}`}
                      alt={variant.color}
                      className="variant-thumbnail"
                    />
                    <span>
                      {`${variant.color} - ${
                        variant.storage ? variant.storage : ""
                      }`.trim()}
                    </span>
                  </button>
                ))
              ) : (
                <p>No variants available</p>
              )}
            </div>
          </div>

          {/* Conditionally render the AddToCartButton */}
          {product.stock > 0 && quantity <= product.stock ? (
            <div className="action-buttons">
              <AddToCartButton
                productId={productId}
                productName={product.name}
                selectedVariant={selectedVariant}
                quantity={quantity}
                stock={product.stock}
              />
            </div>
          ) : (
            <div className="action-buttons">
              <button className="add-to-cart-disabled" disabled>
                Out of Stock
              </button>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === "reviews") {
      return (
        <div className="tab-content">
          <ReviewForm productId={productId} onUpdate={updateAverageRating} />
        </div>
      );
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-page">
      <div className="product-page-container">
        <div className="product-page-left">
          <ProductImageCarousel
            images={product.images}
            currentImage={currentImage}
            onThumbnailClick={handleImageClick}
          />
        </div>
        <div className="product-page-right">
          <div className="tab-header">
            <div
              className={`tab-item ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </div>
            <div
              className={`tab-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </div>
          </div>
          {renderTabContent()}
        </div>
      </div>

      <div className="related-products-section">
        {relatedProducts.length > 0 ? (
          <RelatedProducts
            category={product.category}
            tags={product.tags}
            currentProductId={productId}
          />
        ) : (
          <p>No related products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
