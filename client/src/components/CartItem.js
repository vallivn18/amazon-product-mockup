import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./cartItem.css";

const CartItem = ({ item, onQuantityChange, onRemoveItem }) => {
  const { productId, variant, quantity, productName } = item; // Ensure item structure is correct

  // Ensure productId is accessed correctly
  const productID = productId._id || productId; // Use productId._id if it exists, otherwise fallback

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) return; // Prevent setting quantity to 0 or negative
    onQuantityChange(item._id, newQuantity); // Use the correct product ID for quantity change
  };

  return (
    <div className="cart-item">
      {/* Wrap the details in a Link for redirection to the product page */}
      <Link to={`/product/${productID}`} className="cart-item-link">
        <div className="cart-item-details">
          {variant.images && variant.images.length > 0 ? (
            <img
              src={`https://amazon-product-mockup-server.vercel.app/images/${variant.images[0]}`} // Updated to use images from variant
              alt={variant.color}
              className="cart-item-image"
            />
          ) : (
            <img
              src="placeholder-image-url"
              alt="Placeholder"
              className="cart-item-image"
            />
          )}
          <h3 className="product-name">{productName}</h3>
          <span className="variant-color">Color: {variant.color}</span>
          <span className="item-price">Price: ₹{variant.price}</span>
        </div>
      </Link>
      <div className="quantity-control">
        <button
          className="quantity-button"
          onClick={(e) => {
            e.preventDefault();
            handleQuantityChange(quantity - 1);
          }}
        >
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button
          className="quantity-button"
          onClick={(e) => {
            e.preventDefault();
            handleQuantityChange(quantity + 1);
          }}
        >
          +
        </button>
        <button
          className="remove-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the link click event from firing
            onRemoveItem(item._id); // Call the remove item function
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
