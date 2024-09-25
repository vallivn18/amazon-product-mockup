import React, { createContext, useReducer, useContext } from 'react';
import { addToCart, getCartItems, removeCartItem } from '../api/api';

// Create the Cart Context
const CartContext = createContext();

// Cart Reducer to manage cart actions
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_CART':
            return { ...state, items: action.payload };
        case 'ADD_TO_CART':
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter(item => item._id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.payload.itemId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case 'SET_DISCOUNT':
            return { ...state, discount: action.payload };
        default:
            return state;
    }
};

// CartProvider component to wrap the app
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], discount: 0 });

    // Fetch cart items
    const loadCartItems = async () => {
        const items = await getCartItems();
        dispatch({ type: 'LOAD_CART', payload: items });
    };

    // Add an item to the cart
    const addItemToCart = async (data) => {
        await addToCart(data);
        dispatch({ type: 'ADD_TO_CART', payload: data });
    };

    // Remove an item from the cart
    const removeItemFromCart = async (itemId) => {
        await removeCartItem(itemId);
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    // Update quantity
    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    };

    // Set discount
    const applyDiscount = (discount) => {
        dispatch({ type: 'SET_DISCOUNT', payload: discount });
    };

    return (
        <CartContext.Provider value={{ state, loadCartItems, addItemToCart, removeItemFromCart, updateQuantity, applyDiscount }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);
