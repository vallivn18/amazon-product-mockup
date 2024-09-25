import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext"; // Import CartProvider for global cart state
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories on app load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://amazon-product-mockup-server.vercel.app/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CartProvider>
      {" "}
      {/* Wrap the entire app with CartProvider to make cart state available globally */}
      <Router>
        <Navbar categories={categories} />
        <AppRoutes categories={categories} />
      </Router>
    </CartProvider>
  );
};

export default App;
