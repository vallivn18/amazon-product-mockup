// src/pages/ProductList.js
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LazyLoadImage from "../components/LazyLoadImage";
import StarRating from "../components/StarRating";
import { FaCartPlus } from "react-icons/fa";
import "./productList.css";
import { ToastContainer, toast } from "react-toastify";
import { addToCart } from "../api/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://amazon-product-mockup-server.vercel.app/api/products"
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
      toast.error("Failed to load products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://amazon-product-mockup-server.vercel.app/api/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  if (error) return <div className="error">{error}</div>;

  const handleAddToCart = async (productId, productName, selectedVariant) => {
    const data = {
      productId,
      productName,
      variant: {
        color: selectedVariant.color,
        storage: selectedVariant.storage,
        price: selectedVariant.price,
        images: selectedVariant.images,
      },
      quantity: 1,
    };

    try {
      const response = await axios.post(
        "https://amazon-product-mockup-server.vercel.app/api/cart/add",
        data
      );
      toast.success(`${productName} has been added to your cart!`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      addToCart(data);
    } catch (error) {
      console.error("Error adding to cart:", error);
      //toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="product-list-container">
      <div className="search-filter">
        <select
          className="category-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or tag"
        />
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="product-list-link"
          >
            <div className="product-list-item">
              <div className="product-image-container">
                <LazyLoadImage
                  src={`https://amazon-product-mockup-server.vercel.app/images/${product.images[0]}`}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <span className="product-name">{product.name}</span>
                <p className="product-price">₹{product.variants[0].price}</p>
                <div className="product-rating">
                  <StarRating rating={product.averageRating} />
                  <span className="review-count">
                    [{product.reviews.length}]
                  </span>
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(
                    product._id,
                    product.name,
                    product.variants[0]
                  );
                }}
              >
                <FaCartPlus size={18} />
              </button>
            </div>
          </Link>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
