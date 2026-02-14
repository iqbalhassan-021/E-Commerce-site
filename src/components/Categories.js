import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const db = getFirestore();
      const categoryRef = collection(db, 'Category');
      try {
        const snapshot = await getDocs(categoryRef);
        const categoryList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryList);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    arrows: true,
    dots: false,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          arrows: false,
          slidesToScroll: 5,
        },
      },
        {
        breakpoint: 470,
        settings: {
          slidesToShow: 4,
          arrows: false,
        slidesToScroll: 4,
        },
      },
    {
        breakpoint: 400,
        settings: {
          slidesToShow: 3,
          arrows: false,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <div className="newcategories-section">
      <div className="body-cover">
        {/* <div className="section-title">
          <p>CATEGORIES</p>
        </div> */}

        {categories.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No categories available.</p>
        ) : (
          <Slider {...settings} className="categories">
            {categories.map((cat) => (
         <Link to={`/category/${cat.categoryName}`} key={cat.id} className="no-decoration">
                <div className="category-card">
                  <div className="category-img" style={{backgroundImage: `url(${cat.categoryImage})`}}/>
                  <div className="category-text">
                    <div className="category-name">
                      <p className="catg-name">{cat.categoryName || 'Unnamed Category'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        )}

      </div>
    </div>
  );
};

export default Categories;
