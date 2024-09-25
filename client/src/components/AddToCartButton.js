import React, { useState } from 'react';
import './addToCartButton.css';
import { addToCart } from '../api/api';
import { ToastContainer, toast } from 'react-toastify'; // Import toast and ToastContainer

const AddToCartButton = ({ productId, productName, selectedVariant }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error('Please select a variant.');
            return;
        }

        // Prepare the data to be added to the cart
        const data = {
            productId,
            productName,
            variant: {
                color: selectedVariant.color,
                storage: selectedVariant.storage,
                price: selectedVariant.price,
                images: selectedVariant.images,
            },
            quantity,
        };

        try {
            const response = await addToCart(data);
            toast.success(`${productName} has been added to your cart!`);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleInputChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10));
        setQuantity(isNaN(value) ? 1 : value);
    };

    return (
        <div className="add-to-cart">
            <label className="quantity">Quantity:</label>
            <div className="quantity-input-container">
                <button onClick={decrementQuantity} className="quantity-button">-</button>
                <input
                    type="text"
                    value={quantity}
                    onChange={handleInputChange}
                    className="quantity-input"
                    min="1"
                />
                <button onClick={incrementQuantity} className="quantity-button">+</button>
            </div>
            <button onClick={handleAddToCart} className="add-to-cart-button">
                Add to Cart
            </button>

            {/* Toast container for notifications */}
            <ToastContainer />
        </div>
    );
};

export default AddToCartButton;
