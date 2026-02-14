import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

const slideData = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

// Products WITH createdAt → newest first
const withCreatedAt = slideData
  .filter(p => p.createdAt)
  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

// Products WITHOUT createdAt
const withoutCreatedAt = slideData.filter(p => !p.createdAt);

// Merge and LIMIT to 5
const finalSlides = [...withCreatedAt, ...withoutCreatedAt].slice(0, 5);

setSlides(finalSlides);


      } catch (error) {
        console.error("❌ Error fetching products for slider:", error);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    cssEase: "ease-in-out",
  };

  return (
    <div className="hero-container">
      <div className="body-cover">
        {slides.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : (
          <Slider {...settings} className="hero">
            {slides.map((slide, index) => (
              <div className="hero-slide" key={slide.id || index}>
                <div className="hero-text-holder">
                  <p className="hero-heading">{slide.productName}</p>
                  <p className="hero-subheading">{slide.productDescription || "Create products that truly stand out with our premium custom printing. Whether it’s t-shirts, hoodies, tote bags, or accessories, every item is crafted with vibrant, long-lasting prints that won’t fade. Enjoy comfortable, durable materials designed for everyday wear, gifting, or branding. Perfect for personal style, businesses, events, and teams looking to make a statement." }</p>
                  <Link to="/products" className="primary-button">
                    Shop Now
                  </Link>
                </div>
                <div className="hero-img-holder">
                        <div className="image-wrapper-hero">
                        <div class="the-hero-img" style={{ backgroundImage: `url(${slide.productImage})` }}>
                            
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
