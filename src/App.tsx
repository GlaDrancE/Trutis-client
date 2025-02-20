import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ClientInfo } from './types/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (

    <>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/public_key' element={<PublicID />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/add-card" element={<AddCardPage />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/:id' element={<HomePage />} />
            <Route path='/:id/couponscanner' element={<CouponScanner />} />
            <Route path='/coupon/:id' element={<CustomerDetailsPage />} />
            <Route path='/:id/profile' element={<Profile />} />
            <Route path='/:id/settings' element={<Settings />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;