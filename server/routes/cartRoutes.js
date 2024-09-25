const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET all cart items for a user
router.get('/cart', async (req, res) => {
    const userId = '605c72efb3e83b4a8c4e564a'; // Replace with your sample ObjectId
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        res.json(cart ? cart.items : []);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add item to cart with proper userId
router.post('/cart/add', async (req, res) => {
    const { productId, productName, variant, quantity } = req.body;
    const userId = '605c72efb3e83b4a8c4e564a'; // Replace with your sample ObjectId

    try {
        const existingCart = await Cart.findOne({ userId });

        if (!existingCart) {
            // Create a new cart if none exists for the user
            const newCart = new Cart({ userId, items: [{ productId, productName, variant, quantity }] });
            await newCart.save();
        } else {
            const existingItem = existingCart.items.find(item => item.productId.toString() === productId && item.variant.color === variant.color);
            if (existingItem) {
                existingItem.quantity += quantity; // Increase the quantity if the item exists
            } else {
                existingCart.items.push({ productId, productName, variant, quantity });
            }
            await existingCart.save();
        }

        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});



// GET all cart items for a user
router.get('/cart', async (req, res) => {
    const userId = '605c72efb3e83b4a8c4e564a'; // const userId = req.user.id; 
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        res.json(cart ? cart.items : []);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE route to remove an item from the cart
router.delete('/cart/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        // Remove the item from the cart based on the item's ID
        const updatedCart = await Cart.findOneAndUpdate(
            { 'items._id': itemId }, // Match the cart containing the item
            { $pull: { items: { _id: itemId } } }, // Remove the item from the items array
            { new: true } // Return the updated cart
        );

        if (!updatedCart) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
