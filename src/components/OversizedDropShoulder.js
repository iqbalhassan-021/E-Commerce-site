import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { toast, ToastContainer } from 'react-toastify';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-toastify/dist/ReactToastify.css';

const CATEGORY_NAME = "Oversized T-Shirt Drop Shoulder";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 600,
  arrows: true,

  slidesToShow: 4,
  slidesToScroll: 1,

  responsive: [
    {
      breakpoint: 1400,
      settings: { slidesToShow: 4 }
    },
    {
      breakpoint: 1100,
      settings: { slidesToShow: 3 }
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 520,
      settings: { slidesToShow: 1 }
    }
  ]
};

const OversizedDropShoulder = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchCategoryProducts = async () => {

      const db = getFirestore();

      const productsRef = collection(db, 'products');
      const onSaleRef = collection(db, 'onSale');
      const storeSaleRef = collection(db, 'storeSale');

      try {

        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(productsRef),
          getDocs(onSaleRef),
          getDocs(storeSaleRef)
        ]);

        // FILTER CATEGORY
        const productList = productSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            p => p.productType?.toLowerCase().trim() === CATEGORY_NAME.toLowerCase()
          );

        // SALE MAP
        const saleMap = new Map();
        saleSnap.docs.forEach(doc => saleMap.set(doc.id, doc.data()));

        // CATEGORY SALE MAP
        const categorySalesMap = new Map();
        storeSaleSnap.docs.forEach(doc => {
          const data = doc.data();

          if (data.categoryId && data.salePercentage) {
            categorySalesMap.set(
              data.categoryId.toLowerCase().trim(),
              data.salePercentage
            );
          }
        });

        // APPLY SALES
        const mergedList = productList.map(product => {

          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice)
            return { ...product, salePrice: individualSale.salePrice };

          const categorySalePercentage =
            categorySalesMap.get(product.productType?.toLowerCase().trim());

          if (categorySalePercentage && product.productPrice) {

            const discounted =
              product.productPrice -
              (product.productPrice * categorySalePercentage) / 100;

            return {
              ...product,
              salePrice: parseFloat(discounted.toFixed(2))
            };
          }

          return product;
        });

        // SORT NEWEST
        mergedList.sort((a, b) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setProducts(mergedList);

      } catch (error) {

        console.error("❌ Error fetching Oversized products:", error);

      }
    };

    fetchCategoryProducts();

  }, []);


  // ✅ EXACT ADD TO CART
  const addToCart = (product) => {

    try {

      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const actualPrice = product.salePrice || product.productPrice;

      const existingProduct = existingCart.find(item => item.id === product.id);

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
              productSize: product.productSize,
              productColor: product.productColor,
              productCode: product.productCode,
              productType: product.productType,
              quantity: 1,
            },
          ];

      localStorage.setItem('cart', JSON.stringify(updatedCart));

      window.dispatchEvent(new Event('toggle-cart'));

      toast.success('Added to cart!', { position: 'bottom-right' });

    } catch (error) {

      console.error('❌ Error adding to cart:', error);

      toast.error('Failed to add to cart.', {
        position: 'bottom-right'
      });

    }
  };


  if (!products.length) return null;

  return (
    <>
      <div className="category-section">

        {/* HEADER */}
        <div className="category-header">

          <Link
            to={`/category/${CATEGORY_NAME}`}
            className="see-more"
          >
            See More
          </Link>

          <h2 className="category-title">
            Oversized Drop Shoulder
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

      <ToastContainer />
    </>
  );
};

export default OversizedDropShoulder;
