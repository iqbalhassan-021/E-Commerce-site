import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase';

const FullScreenSlider = () => {
  const [slides, setSlides] = useState([]);
  const db = getFirestore(app);

  // Fetch banner images from Firestore
  useEffect(() => {
    const fetchBannerImages = async () => {
      const bannerCollection = collection(db, 'bannerSection');
      try {
        const querySnapshot = await getDocs(bannerCollection);
        const bannerList = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          image: doc.data().image,
          alt: `Banner ${index + 1}`,
        }));
        console.log('Fetched slides:', bannerList); // Debug log
        setSlides(bannerList);
      } catch (error) {
        console.error('Error fetching banner images:', error);
      }
    };
    fetchBannerImages();
  }, [db]);

  // Slider settings optimized for single or multiple images
  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: slides.length > 1, // Disable infinite loop for single image
    autoplay: slides.length > 1, // Disable autoplay for single image
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    pauseOnFocus: false,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1200,
        settings: { dots: false }
      },
      {
        breakpoint: 992,
        settings: { dots: false }
      },
      {
        breakpoint: 768,
        settings: { dots: false }
      }
    ]
  };

  return (
    <div className="banner-container">
      <div className="body-cover">
        {slides.length === 0 ? (
          <div>
            <img
              src="assets/images/placeholder.png"
              alt="Placeholder"
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        ) : slides.length === 1 ? (
          <div className="single-image">
            <img
              src={slides[0].image}
              alt={slides[0].alt}
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        ) : (
          <Slider className="banner-slider" {...sliderSettings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                <img
                  src={slide.image}
                  alt={slide.alt}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover',borderRadius: '12px' }}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default FullScreenSlider;