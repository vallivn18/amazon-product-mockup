import axios from "axios";

const API_URL = "https://amazon-product-mockup-server.vercel.app/api";

export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Error fetching product details: " + error.message);
  }
};

// Fetch related products based on category or tags
export const getRelatedProducts = async (category, tags) => {
  try {
    const response = await axios.post(`${API_URL}/products/related`, {
      category,
      tags,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw new Error("Error fetching related products: " + error.message);
  }
};

export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Error fetching cart items: " + error.message);
  }
};

export const addToCart = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw new Error("Error adding item to cart: " + error.message);
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove item from cart");
    }

    return await response.json(); // Expect response to contain the updated cart
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    throw new Error("Failed to remove item from cart: " + error.message);
  }
};
