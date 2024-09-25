import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './promotions.css'; // Ensure you have a corresponding CSS file for styles

const Promotions = () => {
    const [promoCode, setPromoCode] = useState('');
    const { applyDiscount } = useCart();

    const handleApplyPromo = () => {
        if (promoCode === 'DISCOUNT10') {
            applyDiscount(10); // Apply 10% discount for 'DISCOUNT10'
        } else if (promoCode === 'DISCOUNT20') {
            applyDiscount(20); // Apply 20% discount for 'DISCOUNT20'
        } else {
            applyDiscount(0); // No discount if invalid
        }
    };

    return (
        <div className="promotions">
            <h2 className="promo-title">Apply Promo Code</h2>
            <div className="promo-input-container">
                <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="promo-input"
                />
                <button onClick={handleApplyPromo} className="promo-button">Apply</button>
            </div>
        </div>
    );
};

export default Promotions;
