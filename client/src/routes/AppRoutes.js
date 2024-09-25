import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductPage from '../pages/ProductPage';
import ProductList from '../pages/ProductList';
import CartPage from '../pages/CartPage'; 

const AppRoutes = ({ categories }) => {
  return (
    <Routes>
      <Route path="/" element={<ProductList categories={categories} />} />
      <Route path="/product/:productId" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
};

export default AppRoutes;
