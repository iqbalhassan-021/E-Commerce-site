import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForHerComponent = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const forHerRef = collection(db, 'forHer');
      const onSaleRef = collection(db, 'onSale');
      const storeSaleRef = collection(db, 'storeSale');

      try {
        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(forHerRef),
          getDocs(onSaleRef),
          getDocs(storeSaleRef)
        ]);

        let productList = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter if a type is selected
        if (selectedProductType) {
          productList = productList.filter(
            product => product.productType === selectedProductType
          );
        }

        // Build sale lookup
        const saleMap = new Map();
        saleSnap.docs.forEach(doc => {
          saleMap.set(doc.id, doc.data());
        });

        const categorySaleMap = new Map();
        storeSaleSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.categoryId && data.salePercentage) {
            categorySaleMap.set(data.categoryId.toLowerCase().trim(), data.salePercentage);
          }
        });

        // Apply discount logic
        const mergedProducts = productList.map(product => {
          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice) {
            return {
              ...product,
              salePrice: individualSale.salePrice
            };
          }

          const categoryKey = product.productType?.toLowerCase().trim();
          const categoryDiscount = categorySaleMap.get(categoryKey);

          if (categoryDiscount && product.productPrice) {
            const discountedPrice =
              product.productPrice - (product.productPrice * (categoryDiscount / 100));
            return {
              ...product,
              salePrice: parseFloat(discountedPrice.toFixed(2))
            };
          }

          return product;
        });

        mergedProducts.sort((a, b) =>
          b.productCode?.localeCompare(a.productCode)
        );

        setProducts(mergedProducts);
      } catch (error) {
        console.error("❌ Error retrieving product data: ", error);
      }
    };

    fetchData();
  }, [selectedProductType]);

  const addToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const actualPrice = product.salePrice || product.productPrice;

      let updatedCart;
      const existingProduct = existingCart.find(item => item.id === product.id);

      if (existingProduct) {
        updatedCart = existingCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
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
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
         window.dispatchEvent(new Event('toggle-cart'));
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add to cart.', { position: 'bottom-right' });
    }
  };

  const displayedProducts = products.slice(0, 8);

  return (
    <>
      <div className="product-container">
        <div className="body-cover">
          <div className="products">
            <div className="section-title">
              <p>Products for Her</p>
            </div>

            <div className="grid-4x">
              {displayedProducts.length === 0 ? (
                <p>No products found</p>
              ) : (
                displayedProducts.map(product => (
                  <Link to={`/product/${product.id}`} className="no-decoration" key={product.id}>
                    <div className="product-card">
                      <div
                        className="product-img-container"
                        style={{ backgroundImage: `url(${product.productImage})` }}
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
                        <div className="product-name">
                          <p className="product-name-text">{product.productName}</p>
                        </div>
                        <div className="product-price">
                          {product.salePrice && product.salePrice !== product.productPrice ? (
                            <>
                              <p className="product-price-text text-strike">Rs.{product.productPrice}</p>
                              <p className="product-sale-price-text">Rs.{product.salePrice}</p>
                            </>
                          ) : (
                            <p className="product-price-text">Rs.{product.productPrice}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {products.length > 0 && (
              <div className="center-section">
                <Link to="/ForHer" className="primary-button">
                  EXPLORE ALL PRODUCTS
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ForHerComponent;
