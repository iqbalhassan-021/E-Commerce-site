import React, { useState } from "react";
import './App.css';
import Home from './pages/Home';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ProductsPage from './pages/NewProducts';
import BlogPage from './pages/Blog';
import LoginPage from './pages/Login';
import AdminPage from './pages/Admin';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Product from './pages/Product';
import Buy from "./pages/Buy";
import FAQPage from "./pages/FAQPage";
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import PaymentInfo from './pages/PaymentInfo';
import CartPage from './pages/CartPage';
import ForHer  from './pages/ForHer';
import CheckoutPage  from './pages/CheckoutPage';
import Sale from './pages/onSale';
import CategoryProductsPage  from './pages/CategoryProductsPage';
import GiftPage from './pages/GiftPage';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
   <Router>
    <Routes>

        <Route path="/Login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />

        <Route path="/Admin" element={isLoggedIn ? <AdminPage /> : <Navigate to="/Login" />} />

    <Route path="/" element={<Home />} />
    <Route path='/About' element={<AboutPage/>}/>
    <Route path='/Contact' element={<ContactPage/>}/>
    <Route path='/Products' element={<ProductsPage/>}/>
    <Route path='/Blog' element={<BlogPage/>}/>

    <Route path="/product/:id" element={<Product/>} />
    <Route path="/Buy/:id" element={<Buy/>} />
    <Route path='*' element={<Home/>}/>
    <Route path="/FAQ" element={<FAQPage />} />
    <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
    <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
    <Route path="/PaymentInfo" element={<PaymentInfo />} />
    <Route path="/Cart" element={<CartPage />} />
    <Route path="/Checkout" element={<CheckoutPage />} />
    <Route path="/ForHer" element={<ForHer />} />
    <Route path="/Sale" element={<Sale />} />
    <Route path="/Category/:categoryName" element={<CategoryProductsPage />} />
    <Route path="/GiftPage" element={<GiftPage />} />
    <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
    </Routes>


    </Router>
  
  );
}

export default App;
