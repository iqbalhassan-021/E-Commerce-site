import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { toast } from 'react-toastify';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategorySlider = ({
  category,
  title,
  slidesDesktop = 4,
  slidesTablet = 2,
  slidesMobile = 2
}) => {

  const [products, setProducts] = useState([]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
      autoplay: false,
  autoplaySpeed: 2500,   // time between slides
  pauseOnHover: true,    // stops when user hovers
  pauseOnFocus: true,
  cssEase: "ease-in-out",
    slidesToShow: slidesDesktop,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1100,
        settings: { slidesToShow: slidesDesktop - 1 }
      },
        {
        breakpoint: 900,
        settings: { slidesToShow: slidesDesktop - 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: slidesTablet },
        arrows: false,
      },
      {
        breakpoint: 520,
        settings: { slidesToShow: slidesMobile },
        arrows: false,
      }
    ]
  };

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const db = getFirestore();

        // 🔥 Direct Firestore Query
        const productsQuery = query(
          collection(db, "products"),
          where("productType", "==", category)
        );

        const onSaleRef = collection(db, 'onSale');
        const storeSaleRef = collection(db, 'storeSale');

        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(productsQuery),
          getDocs(onSaleRef),
          getDocs(storeSaleRef)
        ]);

        const productList = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // SALE MAP
        const saleMap = new Map();
        saleSnap.docs.forEach(doc =>
          saleMap.set(doc.id, doc.data())
        );

        // CATEGORY SALE MAP
        const categorySalesMap = new Map();
        storeSaleSnap.docs.forEach(doc => {

          const data = doc.data();

          if (data.categoryId && data.salePercentage) {
            categorySalesMap.set(
              data.categoryId,
              data.salePercentage
            );
          }
        });

        // APPLY SALES
        const merged = productList.map(product => {

          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice)
            return { ...product, salePrice: individualSale.salePrice };

          const categorySale =
            categorySalesMap.get(product.productType);

          if (categorySale && product.productPrice) {

            const discounted =
              product.productPrice -
              (product.productPrice * categorySale) / 100;

            return {
              ...product,
              salePrice: parseFloat(discounted.toFixed(2))
            };
          }

          return product;
        });

        // SORT NEWEST FIRST
        merged.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

        setProducts(merged);

      } catch (error) {

        console.error("🔥 Firestore Error:", error);

      }
    };

    fetchProducts();

  }, [category]);


  // ✅ EXACT CART
  const addToCart = (product) => {

    try {

      const existingCart =
        JSON.parse(localStorage.getItem('cart')) || [];

      const actualPrice =
        product.salePrice || product.productPrice;

      const existingProduct =
        existingCart.find(item => item.id === product.id);

      const updatedCart = existingProduct
        ? existingCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...existingCart,
            {
              id: product.id,
              productName: product.productName,
              productPrice: actualPrice,
              productImage: product.productImage,
              productSize: product.productSize || 'L',
              productColor: product.productColor,
              productCode: product.productCode,
              productType: product.productType,
              quantity: 1,
            },
          ];

      localStorage.setItem('cart', JSON.stringify(updatedCart));

      window.dispatchEvent(new Event('toggle-cart'));

      toast.success('Added to cart!', {
        position: 'bottom-right'
      });

    } catch (error) {

      console.error('Cart error:', error);

      toast.error('Failed to add to cart.', {
        position: 'bottom-right'
      });
    }
  };


  if (!products.length) return null;

  return (
    <div className="category-section">

      {/* HEADER */}
      <div className="category-header">

        <Link
          to={`/category/${category}`}
          className="see-more"
        >
          <u>See More</u>
          
        </Link>

        <h2 className="category-title">
          {title || category}
        </h2>

      </div>


      {/* SLIDER */}
      <Slider {...sliderSettings}>

        {products.map(product => (

          <div key={product.id} className="slider-item">

            <Link
              to={`/product/${product.id}`}
              className="no-decoration"
            >
              <div className="product-card">

                <div
                  className="product-img-container"
                  style={{
                    backgroundImage: `url(${product.productImage})`,
                  }}
                >
                  <div className="product-buttons">
                    <button
                      className="product-button"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                    >
                      <i className="fa-regular fas fa-cart-plus"></i>
                    </button>
                  </div>
                </div>

                <div className="product-text-holder">

                  <p className="product-name-text">
                    {product.productName}
                  </p>

                  <div className="product-price">

                    {product.salePrice &&
                    product.salePrice !== product.productPrice ? (
                      <>
                        <p className="product-price-text text-strike">
                          Rs.{product.productPrice}
                        </p>
                        <p className="product-sale-price-text">
                          Rs.{product.salePrice}
                        </p>
                      </>
                    ) : (
                      <p className="product-price-text">
                        Rs.{product.productPrice}
                      </p>
                    )}

                  </div>
                </div>

              </div>
            </Link>

          </div>

        ))}

      </Slider>

    </div>
  );
};

export default CategorySlider;
