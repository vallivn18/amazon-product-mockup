import React, { useState } from 'react';
import './addToCartButton.css';
import { addToCart } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';

const AddToCartButton = ({ productId, productName, selectedVariant, stock }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error('Please select a variant.');
            return;
        }
        const data = {
            productId,
            productName,
            stock,
            variant: {
                color: selectedVariant.color,
                storage: selectedVariant.storage,
                price: selectedVariant.price,
                images: selectedVariant.images,
            },
            quantity,
        };

        try {
            await addToCart(data);
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
        setQuantity((prev) => Math.min(prev + 1, stock)); 
    };

    const decrementQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleInputChange = (e) => {
        const value = Math.max(1, Math.min(parseInt(e.target.value, 10), stock));
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
                    max={stock}
                />
                <button onClick={incrementQuantity} className="quantity-button">+</button>
            </div>
            <button onClick={handleAddToCart} className="add-to-cart-button">
                Add to Cart
            </button>

            <ToastContainer />
        </div>
    );
};

export default AddToCartButton;
