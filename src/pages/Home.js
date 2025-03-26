import React from 'react';
import '../App.css';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import HeroSlider from '../components/heroSlider';
import ProductShowcase from '../components/Products';
import QuickBuy from '../components/QuickBuy';
import Categories from '../components/Categories';
import FullScreenSlider from '../components/FullScreenSlider';

function Home(){
    return (
        <>
        <div className='sticky'>
            <Navbar/>
        </div>
     
            <HeroSlider/>
            <ProductShowcase/>
            <Categories/>
            <FullScreenSlider/>
            <QuickBuy/>
        <Footer/>
        </>

    );
}
export default Home;
