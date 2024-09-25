const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
const addToCart = async (req, res) => {
    const { productId, variant, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Find price and image based on selected variant
        const selectedVariant = product.variants.find(
            v => v.color === variant.color && v.storage === variant.storage
        );

        if (!selectedVariant) {
            return res.status(400).json({ message: 'Selected variant not found' });
        }

        const pricePerItem = selectedVariant.price;
        const image = selectedVariant.images[0];

        // Fetch or create cart
        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart();
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId &&
                     item.variant.color === variant.color &&
                     item.variant.storage === variant.storage
        );

        if (existingItem) {
            // If the item exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // Otherwise, add a new item to the cart
            cart.items.push({
                productId,
                productName: product.name,
                variant,
                pricePerItem,
                image,
                quantity,
            });
        }

        // Recalculate total quantity and price
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.pricePerItem, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add to cart', error });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    const { productId, variant } = req.body;

    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => !(item.productId.equals(productId) && 
            item.variant.color === variant.color && 
            item.variant.storage === variant.storage));

        // Recalculate total quantity and price
        cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.pricePerItem * item.quantity), 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};
