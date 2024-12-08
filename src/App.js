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
import ErrorPage from './pages/ErrorPage';
import Product from './pages/Product';
import Buy from "./pages/Buy";


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
    <Route path='*' element={<ErrorPage/>}/>
    </Routes>


    </Router>
  
  );
}

export default App;
