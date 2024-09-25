import React, { useState } from "react";

const ProductDetails = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState({});
  const [error, setError] = useState(null);

  const handleVariantChange = (key, value) => {
    setSelectedVariant((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = async () => {
    // Validate if all necessary fields are selected
    const isValid =
      Object.keys(selectedVariant).length === product.variants[0].length;

    if (!isValid) {
      setError("Please select all required options.");
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          variant: selectedVariant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Successfully added to cart
      setError(null);
      alert("Added to cart successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div>
        {product.variants.map((variant, index) => (
          <div key={index}>
            <h4>{variant.storage || variant.color || "Select Variant"}</h4>
            <button onClick={() => handleVariantChange("variant", variant)}>
              Select {variant.color || variant.storage}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProductDetails;
