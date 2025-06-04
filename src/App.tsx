import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import { PublicID } from './pages/PublicID';
import LoginForm from './pages/Login';
import ProtectedRoute from './ProtectedRoutes';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import Profile from './pages/Profile';
import { Settings } from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddCardPage from './pages/AddCard';
// import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionPlans from './pages/RozorpaySubscriptionPlans';
// import PaymentPage from './pages/PaymentPage';
import PaymentPage from './pages/RozorpayPaymentPage';
import CouponScanner from './pages/CouponScanner';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Home from './pages/Home';
import DashboardLayout from './layout/Layout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ContactUs from './pages/ContactPage';
import CouponsPage from './pages/Coupons';
import ReviewPage from './pages/ReviewPage';
import { useAuthStore } from './store/slices/authStore';
import { ThemeProvider } from './context/theme-context';
import MarketingPage from './pages/MarketingPage';


interface CustomJwtPayload extends JwtPayload {
  userType?: string;
}


function App() {
  const authStore = useAuthStore();
  const HandleUnknownRoute = () => {
    const token = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const clientId = localStorage.getItem('clientId');
    if (!token) return <Navigate to="/login" replace />;

    try {
      const decode = jwtDecode<CustomJwtPayload>(token);
      if (decode.exp && Date.now() >= decode.exp * 1000) {
        authStore.logout();
        return <Navigate to="/login" replace />;
      }

      if (!clientId) return <Navigate to="/login" replace />;

      return <Navigate to={`/${clientId}`} replace />;
    } catch (error) {
      console.error('Error decoding token:', error);
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      {/* <Toaster position="top-right" /> */}
      <Router>
        <ThemeProvider>
          <Routes>
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
              <Route path="/:id/reviews" element={<ReviewPage />} />
              <Route path="/:id/marketing" element={<MarketingPage />} />
              <Route path="/:id/help-center" element={<MarketingPage />} />
              <Route path="*" element={<HandleUnknownRoute />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;