import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase'; // Make sure this path matches your project structure

const FullScreenSlider = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch slides from Firestore
    useEffect(() => {
        const fetchSlides = async () => {
            const db = getFirestore(app);
            const slidesCollection = collection(db, 'Category'); // 'Category' matches your Firestore collection name
            
            try {
                const querySnapshot = await getDocs(slidesCollection);
                const slidesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    image: doc.data().categoryImage,
                    name: doc.data().categoryName
                }));
                setSlides(slidesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching slides:', error);
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        if (slides.length > 0) {
            const slideInterval = setInterval(() => {
                setCurrentSlide((prev) => 
                    prev === slides.length - 1 ? 0 : prev + 1
                );
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(slideInterval); // Cleanup on unmount
        }
    }, [slides]);

    // Manual navigation
    const goToPrevious = () => {
        setCurrentSlide((prev) => 
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentSlide((prev) => 
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    if (loading) {
        return <div className="slider-loading">Loading slides...</div>;
    }

    if (slides.length === 0) {
        return <div className="slider-error">No slides available</div>;
    }

    return (
        <div className="fullscreen-slider">
            <div className="slider-container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-content">
                            <h2>{slide.name}</h2>
                        </div>
                    </div>
                ))}
                
                {/* Navigation Arrows */}
                <button className="slider-prev" onClick={goToPrevious}>
                    &#10094;
                </button>
                <button className="slider-next" onClick={goToNext}>
                    &#10095;
                </button>

                {/* Dots Navigation */}
                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullScreenSlider;