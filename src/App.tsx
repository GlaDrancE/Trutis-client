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

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/public_key' element={<PublicID />} />
        <Route path='/login' element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/:id' element={<HomePage />} />
          <Route path='/coupon/:id' element={<CustomerDetailsPage />} />
          <Route path='/:id/profile' element={<Profile />} />


        </Route>
      </Routes>
    </Router>
  )
}

export default App;