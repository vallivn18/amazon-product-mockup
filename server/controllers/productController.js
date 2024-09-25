const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Products fetched:', products);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send(error);
    }
};

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send(error);
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const reviewCount = product.reviews.length;
        res.status(200).json({ 
            ...product._doc, 
            reviewCount // Add review count to the response
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Add a review to a product
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send({ message: 'Product not found' });

        const newReview = { rating, comment };
        product.reviews.push(newReview);
        
        // Calculate new average rating
        const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
        product.averageRating = averageRating;
        
        await product.save();
        res.status(200).json({ averageRating, reviews: product.reviews });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getAllCategories,
    addReview
};
