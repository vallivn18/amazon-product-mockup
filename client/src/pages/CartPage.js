import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import Promotions from '../components/Promotions';
import './cartPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CartPage = () => {
    const { state, loadCartItems, removeItemFromCart, updateQuantity } = useCart();
    const { items, discount } = state;

    useEffect(() => {
        loadCartItems(); // Fetch cart items on mount
    }, [loadCartItems]);

    const calculateTotalPrice = () => {
        const total = items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
        return (total * ((100 - discount) / 100)).toFixed(2);
    };

    const calculateOriginalPrice = () => {
        const total = items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
        return total.toFixed(2);
    };

    if (items.length === 0) {
        return (
            <div className="empty-cart">
                <i className="empty-cart-icon fas fa-shopping-cart"></i>
                <Link to="/" className="empty-cart-text">Your cart is empty. Click here to shop!</Link>
                <p>Looks like you haven't added anything yet. Start shopping!</p>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>

            <div className="cart-items">
                {items.map((item) => (
                    <CartItem
                        key={item._id}
                        item={item}
                        onQuantityChange={updateQuantity}
                        onRemoveItem={removeItemFromCart}
                    />
                ))}
            </div>

            <div className="cart-summary-container">
                <div className="promotions-section">
                    <Promotions />
                </div>
                <div className="cart-summary">
                    <h2>Cart Summary</h2>
                    <div className="total-price">
                        {discount > 0 ? (
                            <>
                                <span className="original-price">Original Price: <s>₹{calculateOriginalPrice()}</s></span><br /><br />
                                <span>Total Price: ₹{calculateTotalPrice()}</span>
                                <span className="discount-info"> (Discount: {discount}%)</span>
                            </>
                        ) : (
                            <span>Total Price: ₹{calculateOriginalPrice()}</span>
                        )}
                    </div>
                    <button className="checkout-button">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
