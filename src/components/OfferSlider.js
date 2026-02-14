import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OfferSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const db = getFirestore();
        const saleRef = collection(db, "saleSection");
        const snapshot = await getDocs(saleRef);

        const fetchedSlides = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSlides(fetchedSlides);
      } catch (error) {
        console.error("❌ Error fetching saleSection data:", error);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    pauseOnFocus: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="offer-section">
      <div className="offers">
        <div className="body-cover offer-slider">
          {slides.length > 0 ? (
            <Slider {...settings}>
              {slides.map((slide, index) => (
                <div className="offer-slide" key={slide.id || index}>
                  <div className="offer-img">
                    <img
                      src={slide.image}
                    />
                  </div>
                  <div className="offer-text">
                    <p className="offer-heading">{slide.heading}</p>
                    <p className="offer-subheading">{slide.subheading}</p>
                    <Link to="/Sale" className="primary-button">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ textAlign: "center" }}>Loading offers...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferSlider;
