import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 }},
    { breakpoint: 768, settings: { slidesToShow: 2 }},
    { breakpoint: 480, settings: { slidesToShow: 1 }}
  ]
};

const AllProducts = () => {

  const [categorizedProducts, setCategorizedProducts] = useState({});

  useEffect(() => {

    const fetchAllProducts = async () => {

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

        const productList = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const saleMap = new Map();
        saleSnap.docs.forEach(doc => saleMap.set(doc.id, doc.data()));

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

          const categoryKey = product.productType?.toLowerCase().trim();
          const categorySalePercentage = categorySalesMap.get(categoryKey);

          if (categorySalePercentage && product.productPrice) {

            const discountedPrice =
              product.productPrice -
              (product.productPrice * categorySalePercentage) / 100;

            return {
              ...product,
              salePrice: parseFloat(discountedPrice.toFixed(2))
            };
          }

          return product;
        });

        // SORT NEWEST FIRST
        const withTimestamp = mergedList
          .filter(p => p.createdAt)
          .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        const withoutTimestamp = mergedList.filter(p => !p.createdAt);

        const finalList = [...withTimestamp, ...withoutTimestamp];

        // GROUP BY CATEGORY
        const grouped = finalList.reduce((acc, product) => {

          const category = product.productType || "Other";

          if (!acc[category]) acc[category] = [];

          // limit to 12 for performance
          if (acc[category].length < 12) {
            acc[category].push(product);
          }

          return acc;

        }, {});

        setCategorizedProducts(grouped);

      } catch (error) {

        console.error('❌ Error fetching data:', error);

      }
    };

    fetchAllProducts();

  }, []);


  // ✅ EXACT ADD TO CART — NOTHING REMOVED
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


  // ✅ PRODUCT CARD (Reusable — no duplicate code)
  const ProductCard = ({ product }) => (

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
  );


  return (
    <>
      <div className="product-container">
        <div className="body-cover">

          {Object.entries(categorizedProducts).map(([category, products]) => (

            <div className="category-section" key={category}>

              {/* HEADER */}
              <div className="category-header">

                <Link
                  to={`/category/${category}`}
                  className="see-more"
                >
                  See More
                </Link>

                <h2 className="category-title">
                  {category}
                </h2>

              </div>

              {/* SLIDER */}
              <Slider {...sliderSettings}>

                {products.map(product => (
                  <div key={product.id} className="slider-item">
                    <ProductCard product={product} />
                  </div>
                ))}

              </Slider>

            </div>
          ))}

        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default AllProducts;
