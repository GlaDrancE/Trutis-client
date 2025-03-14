import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import { PublicID } from './pages/PublicID';
import LoginForm from './pages/Login';
import ProtectedRoute from './ProtectedRoutes';
import HomePage from './pages/HomePage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import Profile from './pages/Profile';
import { Settings } from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddCardPage from './pages/AddCard';
import SubscriptionPlans from './pages/SubscriptionPlans';
import PaymentPage from './pages/PaymentPage';
import CouponScanner from './pages/CouponScanner';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Home from './pages/Home';
import DashboardLayout from './layout/Layout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ContactUs from './pages/ContactPage';
import CouponsPage from './pages/Coupons';
interface CustomJwtPayload extends JwtPayload {
  userType?: string;
}

function App() {
  const HandleUnknownRoute = () => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    try {
      const decode = jwtDecode<CustomJwtPayload>(token);
      if (decode.exp && Date.now() >= decode.exp * 1000) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
      }

      const clientId = localStorage.getItem('clientId');
      if (!clientId) return <Navigate to="/login" replace />;

      return <Navigate to={`/${clientId}`} replace />;
    } catch (error) {
      console.error('Error decoding token:', error);
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/public_key" element={<PublicID />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/add-card" element={<AddCardPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/:id" element={<Home />} />
            <Route path="/:id/coupon-scanner" element={<CouponScanner />} />
            <Route path="/:id/customer/:couponId" element={<CustomerDetailsPage />} />
            <Route path="/:id/coupons" element={<CouponsPage />} />
            <Route path="/:id/profile" element={<Profile />} />
            <Route path="/:id/settings" element={<Settings />} />
            <Route path="/:id/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/:id/payment" element={<PaymentPage />} />
            <Route path="*" element={<HandleUnknownRoute />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;