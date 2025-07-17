import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './components/ClientLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MenuDetailPage from './pages/MenuDetailPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import PromotionsPage from './pages/PromotionsPage';
import ContactPage from './pages/ContactPage';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<MenuDetailPage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="packages/:id" element={<PackageDetailPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
