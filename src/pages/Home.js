import React from 'react';
import '../App.css';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

import NewAlerts from '../components/NewAlerts';

import BottomBar from '../components/BottomBar';

import { Helmet } from "react-helmet-async";

import CategorySlider from '../components/CategorySlider';
import BentoGrid from '../components/BentoGrid';
import HeroSection from '../components/SimpleHero';
function Home() {
  return (
    <>
      <Helmet>
        <title>Isha Prints | Premium Clothing</title>

        <meta
          name="description"
          content="Isha Prints is a custom on-demand clothing brand creating unique, high-quality apparel made to order for everyday style and self-expression."
        />

        <meta
          name="keywords"
          content="Isha Prints, custom clothing, print on demand apparel, personalized fashion, custom t shirts, hoodies, streetwear brand"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Isha Prints | Custom On-Demand Clothing Brand" />
        <meta
          property="og:description"
          content="Wear what represents you. Isha Prints offers custom on-demand apparel designed for comfort, quality, and individuality."
        />
        <meta property="og:url" content="https://ishaprints.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ishaprints.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Isha Prints | Custom On-Demand Clothing" />
        <meta
          name="twitter:description"
          content="Custom-made apparel printed on demand. Express your style with Isha Prints."
        />
        <meta name="twitter:image" content="https://ishaprints.com/og-image.jpg" />

      </Helmet>


      <Navbar />
      <HeroSection />
      {/* <HeroSlider/>  */}
      <NewAlerts />
      {/* <Categories /> */}
      {/* <Heromobile/> */}
      {/* <AllProducts/> */}
      <br />
      <h1 className='google-title' >Isha Prints | Premium Clothing</h1>
      {/* <OversizedDropShoulder/>
            <CapSlider/> */}
      <BentoGrid
        heroImage="/assets/images/ov-01.jpg"
        topRightImage="/assets/images/ov-02.jpg"
        topLeftImage="/assets/images/ov-03.jpg"
        bottomImage="/assets/images/ov-04.jpg"
      />

      <CategorySlider
        category="Oversized T-Shirt Drop Shoulder"

      />
      <BentoGrid
        heroImage="/assets/images/ts-01.jpg"
        topRightImage="/assets/images/ts-02.jpg"
        topLeftImage="/assets/images/ts-03.jpg"
        bottomImage="/assets/images/ts-04.jpg"
      />
      <CategorySlider
        category="T-Shirt"
      />
      <BentoGrid
        heroImage="/assets/images/cp-02.jpg"
        topRightImage="/assets/images/cp-04.jpg"
        topLeftImage="/assets/images/cp-03.jpg"
        bottomImage="/assets/images/cp-01.jpg"
      />
      <CategorySlider
        category="Cap"
      />
      <BentoGrid
        heroImage="/assets/images/tt-01.jpg"
        topRightImage="/assets/images/tt-02.jpg"
        topLeftImage="/assets/images/tt-03.jpg"
        bottomImage="/assets/images/tt-04.jpg"
      />
      <CategorySlider
        category="Tanktop"
      />
      <BentoGrid
        heroImage="/assets/images/ls-01.jpg"
        topRightImage="/assets/images/ls-02.jpg"
        topLeftImage="/assets/images/ls-03.jpg"
        bottomImage="/assets/images/ls-04.jpg"
      />
      <CategorySlider
        category="Long Sleeves Shirt"
      />
      <BentoGrid
        heroImage="/assets/images/pf-01.jpg"
        topRightImage="/assets/images/pf-02.jpg"
        topLeftImage="/assets/images/pf-03.jpg"
        bottomImage="/assets/images/pf-04.jpg"
      />
      <CategorySlider
        category="Photo Frames"
      />


      {/* <OfferSlider/> */}
      {/* <OnSalePage/> */}
      {/* <GiftComp/> */}
      {/* <FullScreenSlider/> */}
      <BottomBar />
      <Footer />

    </>

  );
}
export default Home;
