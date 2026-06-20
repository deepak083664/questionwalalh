import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import GeneratePaper from '../pages/GeneratePaper';
import OCRImport from '../pages/OCRImport';
import PaperBuilder from '../pages/PaperBuilder';
import History from '../pages/History';

const AppRoutes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll position
    window.scrollTo(0, 0);
    // Reset layout viewport scroll position
    const mainScrollContent = document.getElementById('main-scroll-content');
    if (mainScrollContent) {
      mainScrollContent.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Guarded Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/generate"
          element={
            <DashboardLayout>
              <GeneratePaper />
            </DashboardLayout>
          }
        />
        <Route
          path="/ocr-import"
          element={
            <DashboardLayout>
              <OCRImport />
            </DashboardLayout>
          }
        />
        <Route
          path="/builder/:id"
          element={
            <DashboardLayout>
              <PaperBuilder />
            </DashboardLayout>
          }
        />
        <Route
          path="/history"
          element={
            <DashboardLayout>
              <History />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
