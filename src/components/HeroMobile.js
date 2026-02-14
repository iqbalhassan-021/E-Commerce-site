import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const Heromobile = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

       const productData = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

// products WITH createdAt → newest first
const withCreatedAt = productData
  .filter(p => p.createdAt)
  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

// products WITHOUT createdAt
const withoutCreatedAt = productData.filter(p => !p.createdAt);

// merge + limit to 5
const finalProducts = [...withCreatedAt, ...withoutCreatedAt].slice(0, 5);

setProducts(finalProducts);

      } catch (error) {
        console.error("❌ Error fetching product data:", error);
      }
    };

    fetchProducts();
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
    adaptiveHeight: true,
  };

  return (
    <div className="mobile-hero-container">
      <div className="body-cover">
        {products.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : (
          <Slider {...settings} className="hero">
            {products.map((product, index) => (
              <div className="hero-slide" key={product.id || index}>
                <div className="hero-text-holder">
                  <p className="hero-heading">{product.productName}</p>
                  <p className="hero-subheading">{product.productDescription}</p>
                  <Link to="/products" className="primary-button">
                    Shop Now
                  </Link>
                </div>
                <div className="hero-img-holder">
                    <div class="image-wrapper-hero">
                        <div class="the-hero-img" style={{ backgroundImage: `url(${product.productImage})` }}>
                            
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

export default Heromobile;
