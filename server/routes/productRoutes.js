const express = require('express'); // Import express
const router = express.Router(); // Create a router instance
const Product = require('../models/Product'); // Import the Product model
const mongoose = require('mongoose');

// Get related products by tags or category
router.post('/products/related', async (req, res) => {
    try {
        const { category, tags } = req.body;

        // Ensure we have at least category or tags to search for
        if (!category && (!tags || tags.length === 0)) {
            return res.status(400).json({ message: 'Category or tags required to find related products.' });
        }

        // Build a query to find related products
        const query = {
            $or: [
                { category },           // Match by category
                { tags: { $in: tags } }  // Match by tags
            ]
        };

        // Exclude the product itself in the query if necessary
        const relatedProducts = await Product.find(query).limit(10); // Limit the number of related products

        res.json(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        res.status(500).json({ message: 'Error fetching related products', error });
    }
});


// Get all unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send(error);
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Post a review for a product
router.post('/products/:id/reviews', async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const newReview = { rating, comment };
        product.reviews.push(newReview);

        // Calculate new average rating
        const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.averageRating = totalRating / product.reviews.length;
        product.reviewCount = product.reviews.length;

        await product.save();
        res.json({ averageRating: product.averageRating, reviews: product.reviews });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Update stock during checkout
router.post('/checkout', async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if there is enough stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        // Reduce stock
        product.stock -= quantity;
        await product.save();

        res.json({ message: 'Checkout successful', remainingStock: product.stock });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Error during checkout', error });
    }
});

module.exports = router; 
